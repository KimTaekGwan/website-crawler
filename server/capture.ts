import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { IStorage } from './storage';
import { CaptureConfig } from '@shared/schema';
import { chromium, devices } from 'playwright';
import { Browser, BrowserContext, Page } from 'playwright-core';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure storage directories exist
const storageDir = path.join(__dirname, '..', 'storage');
const websitesDir = path.join(storageDir, 'websites');
fs.mkdirSync(websitesDir, { recursive: true });

// Real Playwright implementation for capturing screenshots
async function captureWithPlaywright(
  url: string,
  deviceType: string,
  width: number,
  height: number,
  captureFullPage: boolean,
  captureDynamicElements: boolean
): Promise<{ screenshot: Buffer, thumbnail: Buffer, title: string, links: string[] }> {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;
  
  try {
    // Launch browser
    browser = await chromium.launch({ headless: true });
    
    // Setup viewport and device emulation
    let contextOptions: any = {
      viewport: { width, height },
      deviceScaleFactor: 1,
    };
    
    // Apply device emulation for standard device types
    if (deviceType === 'mobile') {
      contextOptions = devices['iPhone 12'];
    } else if (deviceType === 'tablet') {
      contextOptions = devices['iPad Pro 11'];
    }
    
    // Create browser context
    context = await browser.newContext(contextOptions);
    
    // Create page
    page = await context.newPage();
    
    // Navigate to URL with timeout
    await page.goto(url, { 
      waitUntil: captureFullPage ? 'networkidle' : 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait for dynamic content if requested
    if (captureDynamicElements) {
      await page.waitForTimeout(3000); // Additional time for dynamic content
    }
    
    // Get page title
    const title = await page.title();
    
    // Extract all links from the page
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href]'))
        .map(a => a.getAttribute('href'))
        .filter(href => href && !href.startsWith('#') && !href.startsWith('javascript:'))
        .map(href => {
          try {
            return new URL(href!, window.location.href).toString();
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean) as string[];
    });
    
    // Take screenshot
    const screenshot = await page.screenshot({ 
      fullPage: captureFullPage,
      type: 'png'
    });
    
    // Generate thumbnail using sharp
    const thumbnail = await sharp(screenshot)
      .resize(300, null) // Resize width to 300px, maintain aspect ratio
      .toBuffer();
      
    return { 
      screenshot: screenshot,
      thumbnail: thumbnail,
      title: title,
      links: links
    };
  } catch (error) {
    console.error('Playwright capture error:', error);
    throw error;
  } finally {
    // Clean up resources
    if (page) await page.close().catch(e => console.error('Error closing page:', e));
    if (context) await context.close().catch(e => console.error('Error closing context:', e));
    if (browser) await browser.close().catch(e => console.error('Error closing browser:', e));
  }
}

export async function startCapture(
  captureId: number,
  config: CaptureConfig,
  storage: IStorage
): Promise<void> {
  try {
    // Update capture status to in progress
    await storage.updateCaptureStatus(captureId, 'in_progress');
    
    // Get capture details
    const capture = await storage.getCaptureById(captureId);
    if (!capture) {
      throw new Error(`Capture with ID ${captureId} not found`);
    }
    
    // Get or create website
    const website = await storage.getWebsiteById(capture.websiteId);
    if (!website) {
      throw new Error(`Website with ID ${capture.websiteId} not found`);
    }
    
    // Create website directory if it doesn't exist
    const websiteDir = path.join(websitesDir, website.id.toString());
    const captureDir = path.join(websiteDir, captureId.toString());
    const pagesDir = path.join(captureDir, 'pages');
    fs.mkdirSync(pagesDir, { recursive: true });
    
    // Start with the main URL and discover links from there
    let pageUrls = [config.url];
    let discoveredUrls = new Set<string>([config.url]);
    
    // Initial capture of the main page to discover links
    try {
      // Get device dimensions for desktop (default)
      const width = 1920;
      const height = 1080;
      
      // Capture the main page to discover links
      const { links, title } = await captureWithPlaywright(
        config.url,
        'desktop',
        width,
        height,
        capture.captureFullPage,
        capture.captureDynamicElements
      );
      
      // Filter discovered links to stay within the same domain
      const urlObj = new URL(config.url);
      const baseDomain = urlObj.hostname;
      
      for (const link of links) {
        try {
          const linkUrl = new URL(link);
          // Only include links from the same domain and limit to a reasonable number
          if (linkUrl.hostname === baseDomain && !discoveredUrls.has(link) && discoveredUrls.size < 10) {
            pageUrls.push(link);
            discoveredUrls.add(link);
          }
        } catch (e) {
          // Skip invalid URLs
          console.error('Invalid URL:', link, e);
        }
      }
      
      // Update the main page title if we got it from the capture
      if (title) {
        await storage.updateWebsite(website.id, { name: title });
      }
      
    } catch (error) {
      console.error('Error during link discovery:', error);
      // Continue with just the main URL if discovery fails
    }
    
    // Create page records for each URL
    const pages = [];
    for (const url of pageUrls) {
      const page = await storage.createPage({
        websiteId: website.id,
        url,
        title: null // We'll update this during capture
      });
      pages.push(page);
    }
    
    // Process each device type
    const deviceTypes = config.deviceTypes;
    const totalOperations = pages.length * deviceTypes.length;
    let completedOperations = 0;
    
    for (const pageObj of pages) {
      // Create page directory
      const pageDir = path.join(pagesDir, pageObj.id.toString());
      fs.mkdirSync(pageDir, { recursive: true });
      
      for (const deviceType of deviceTypes) {
        try {
          // Create device type directory
          const deviceDir = path.join(pageDir, deviceType);
          fs.mkdirSync(deviceDir, { recursive: true });
          
          // Get device dimensions
          let width = 1920;
          let height = 1080;
          
          if (deviceType === 'tablet') {
            width = 768;
            height = 1024;
          } else if (deviceType === 'mobile') {
            width = 375;
            height = 667;
          } else if (config.customSizes) {
            // Check for custom size that matches this device type
            const customSize = config.customSizes.find(s => s.name.toLowerCase() === deviceType.toLowerCase());
            if (customSize) {
              width = customSize.width;
              height = customSize.height;
            }
          }
          
          // Capture screenshot using Playwright
          const { screenshot, thumbnail, title } = await captureWithPlaywright(
            pageObj.url,
            deviceType,
            width,
            height,
            capture.captureFullPage,
            capture.captureDynamicElements
          );
          
          // Update page title if not already set
          if (title && (!pageObj.title || pageObj.title === `Page at ${pageObj.url}`)) {
            await storage.updatePage(pageObj.id, { title });
            pageObj.title = title;
          }
          
          // Save screenshot and thumbnail
          const screenshotPath = path.join(deviceDir, 'current.png');
          const thumbnailPath = path.join(deviceDir, 'thumbnail.png');
          
          fs.writeFileSync(screenshotPath, screenshot);
          fs.writeFileSync(thumbnailPath, thumbnail);
          
          // Create screenshot record
          await storage.createScreenshot({
            pageId: pageObj.id,
            captureId: captureId,
            deviceType,
            path: screenshotPath,
            thumbnailPath,
            width,
            height,
            metadata: {
              url: pageObj.url,
              title: pageObj.title,
              captureFullPage: capture.captureFullPage,
              captureDynamicElements: capture.captureDynamicElements
            }
          });
        } catch (error) {
          console.error(`Error capturing ${pageObj.url} for device ${deviceType}:`, error);
          // Continue with other captures even if one fails
        }
        
        // Update progress
        completedOperations++;
        const progress = Math.round((completedOperations / totalOperations) * 100);
        await storage.updateCaptureProgress(captureId, progress);
      }
    }
    
    // Mark capture as complete
    await storage.setCaptureCompleted(captureId);
  } catch (error) {
    console.error('Capture process error:', error);
    
    // Update capture status to failed
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await storage.setCaptureError(captureId, errorMessage);
  }
}
