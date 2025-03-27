import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertTagSchema, 
  insertWebsiteSchema, 
  insertCaptureSchema,
  insertPageSchema,
  insertWebsiteTagSchema,
  insertPageTagSchema,
  insertScreenshotSchema,
  insertDeviceProfileSchema,
  type CaptureConfig
} from "@shared/schema";
import { startCapture } from "./capture";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure storage directory exists
const storageDir = path.join(__dirname, '..', 'storage');
const websitesDir = path.join(storageDir, 'websites');
fs.mkdirSync(websitesDir, { recursive: true });

export async function registerRoutes(app: Express): Promise<Server> {
  // All routes under /api prefix

  // ===== Tag routes =====
  app.get('/api/tags', async (req: Request, res: Response) => {
    const tags = await storage.getTags();
    res.json(tags);
  });

  app.post('/api/tags', async (req: Request, res: Response) => {
    try {
      const tagData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(tagData);
      res.status(201).json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An error occurred creating the tag' });
      }
    }
  });

  app.get('/api/tags/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const tag = await storage.getTagById(id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json(tag);
  });

  app.delete('/api/tags/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    await storage.deleteTag(id);
    res.status(204).send();
  });

  // ===== Website routes =====
  app.get('/api/websites', async (req: Request, res: Response) => {
    const websites = await storage.getWebsites();
    res.json(websites);
  });

  app.get('/api/websites/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const website = await storage.getWebsiteById(id);
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    const tags = await storage.getWebsiteTags(id);
    res.json({ ...website, tags });
  });

  // ===== Website tags routes =====
  app.get('/api/websites/:id/tags', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const tags = await storage.getWebsiteTags(id);
    res.json(tags);
  });

  app.post('/api/websites/:id/tags', async (req: Request, res: Response) => {
    const websiteId = parseInt(req.params.id);
    if (isNaN(websiteId)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
      const tagData = insertWebsiteTagSchema.parse({
        ...req.body,
        websiteId
      });
      
      const websiteTag = await storage.addTagToWebsite(tagData);
      res.status(201).json(websiteTag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An error occurred adding the tag' });
      }
    }
  });

  // ===== Capture routes =====
  app.get('/api/captures', async (req: Request, res: Response) => {
    const captures = await storage.getCaptures();
    res.json(captures);
  });

  app.get('/api/captures/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const capture = await storage.getCaptureWithDetails(id);
    if (!capture) {
      return res.status(404).json({ message: 'Capture not found' });
    }

    res.json(capture);
  });

  app.post('/api/captures', async (req: Request, res: Response) => {
    try {
      // Parse and validate the capture config from request body
      const captureConfigSchema = z.object({
        url: z.string().url(),
        deviceTypes: z.array(z.string()),
        captureFullPage: z.boolean().optional().default(true),
        captureDynamicElements: z.boolean().optional().default(false),
        initialTags: z.array(z.string()).optional(),
        customSizes: z.array(z.object({
          name: z.string(),
          width: z.number().positive(),
          height: z.number().positive()
        })).optional()
      });

      const captureConfig = captureConfigSchema.parse(req.body) as CaptureConfig;

      // Get or create website based on the URL
      let website = await storage.getWebsiteByUrl(captureConfig.url);
      
      if (!website) {
        const urlObj = new URL(captureConfig.url);
        const domain = urlObj.hostname;
        const name = domain.replace(/^www\./i, '').split('.')[0];
        
        const websiteData = {
          url: captureConfig.url,
          domain,
          name: name.charAt(0).toUpperCase() + name.slice(1)
        };
        
        website = await storage.createWebsite(websiteData);
        
        // Add initial tags to website if provided
        if (captureConfig.initialTags && captureConfig.initialTags.length > 0) {
          for (const tagName of captureConfig.initialTags) {
            // Check if tag exists, if not create it
            let tag = (await storage.getTags()).find(t => t.name === tagName);
            
            if (!tag) {
              tag = await storage.createTag({
                name: tagName,
                color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
                description: null
              });
            }
            
            // Add tag to website
            await storage.addTagToWebsite({
              websiteId: website.id,
              tagId: tag.id
            });
          }
        }
      }

      // Create capture record
      const captureData = {
        websiteId: website.id,
        deviceTypes: captureConfig.deviceTypes,
        captureFullPage: captureConfig.captureFullPage,
        captureDynamicElements: captureConfig.captureDynamicElements
      };
      
      const capture = await storage.createCapture(captureData);

      // Start capture process in background
      startCapture(capture.id, captureConfig, storage);
      
      res.status(201).json(capture);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error('Capture error:', error);
        res.status(500).json({ message: 'An error occurred starting the capture' });
      }
    }
  });

  // ===== Page routes =====
  app.get('/api/pages/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const page = await storage.getPageWithDetails(id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  });

  app.get('/api/websites/:id/pages', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const pages = await storage.getPagesByWebsiteId(id);
    res.json(pages);
  });

  // ===== Page tags routes =====
  app.get('/api/pages/:id/tags', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const tags = await storage.getPageTags(id);
    res.json(tags);
  });

  app.post('/api/pages/:id/tags', async (req: Request, res: Response) => {
    const pageId = parseInt(req.params.id);
    if (isNaN(pageId)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
      const tagData = insertPageTagSchema.parse({
        ...req.body,
        pageId
      });
      
      const pageTag = await storage.addTagToPage(tagData);
      res.status(201).json(pageTag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An error occurred adding the tag' });
      }
    }
  });

  app.delete('/api/pages/:pageId/tags/:tagId', async (req: Request, res: Response) => {
    const pageId = parseInt(req.params.pageId);
    const tagId = parseInt(req.params.tagId);
    
    if (isNaN(pageId) || isNaN(tagId)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    // Implementation would remove the association
    // Not implemented in the MemStorage yet
    res.status(204).send();
  });

  // ===== Screenshot routes =====
  app.get('/api/screenshots/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const screenshot = await storage.getScreenshotById(id);
    if (!screenshot) {
      return res.status(404).json({ message: 'Screenshot not found' });
    }

    res.json(screenshot);
  });

  app.get('/api/pages/:id/screenshots', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const deviceType = req.query.deviceType as string;
    
    let screenshots;
    if (deviceType) {
      screenshots = await storage.getScreenshotsByDeviceType(id, deviceType);
    } else {
      screenshots = await storage.getScreenshotsByPageId(id);
    }
    
    res.json(screenshots);
  });

  // ===== Device profile routes =====
  app.get('/api/device-profiles', async (req: Request, res: Response) => {
    const profiles = await storage.getDeviceProfiles();
    res.json(profiles);
  });

  app.get('/api/device-profiles/default', async (req: Request, res: Response) => {
    const profiles = await storage.getDefaultDeviceProfiles();
    res.json(profiles);
  });

  app.post('/api/device-profiles', async (req: Request, res: Response) => {
    try {
      const profileData = insertDeviceProfileSchema.parse(req.body);
      const profile = await storage.createDeviceProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An error occurred creating the device profile' });
      }
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
