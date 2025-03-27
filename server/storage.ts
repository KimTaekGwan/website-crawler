import { 
  users, type User, type InsertUser,
  tags, type Tag, type InsertTag,
  websites, type Website, type InsertWebsite,
  websiteTags, type WebsiteTag, type InsertWebsiteTag,
  captures, type Capture, type InsertCapture,
  pages, type Page, type InsertPage,
  pageTags, type PageTag, type InsertPageTag,
  screenshots, type Screenshot, type InsertScreenshot,
  deviceProfiles, type DeviceProfile, type InsertDeviceProfile,
  type WebsiteWithDetails, type CaptureWithDetails, type PageWithDetails
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Tag methods
  createTag(tag: InsertTag): Promise<Tag>;
  getTags(): Promise<Tag[]>;
  getTagById(id: number): Promise<Tag | undefined>;
  deleteTag(id: number): Promise<void>;

  // Website methods
  createWebsite(website: InsertWebsite): Promise<Website>;
  getWebsiteById(id: number): Promise<Website | undefined>;
  getWebsiteByUrl(url: string): Promise<Website | undefined>;
  getWebsites(): Promise<WebsiteWithDetails[]>;
  addTagToWebsite(websiteTag: InsertWebsiteTag): Promise<WebsiteTag>;
  getWebsiteTags(websiteId: number): Promise<Tag[]>;
  
  // Capture methods
  createCapture(capture: InsertCapture): Promise<Capture>;
  getCaptureById(id: number): Promise<Capture | undefined>;
  getCaptureWithDetails(id: number): Promise<CaptureWithDetails | undefined>;
  getCaptures(): Promise<CaptureWithDetails[]>;
  updateCaptureStatus(id: number, status: string): Promise<Capture>;
  updateCaptureProgress(id: number, progress: number): Promise<Capture>;
  setCaptureError(id: number, error: string): Promise<Capture>;
  setCaptureCompleted(id: number): Promise<Capture>;
  
  // Page methods
  createPage(page: InsertPage): Promise<Page>;
  getPageById(id: number): Promise<Page | undefined>;
  getPagesByWebsiteId(websiteId: number): Promise<Page[]>;
  getPageWithDetails(id: number): Promise<PageWithDetails | undefined>;
  addTagToPage(pageTag: InsertPageTag): Promise<PageTag>;
  getPageTags(pageId: number): Promise<Tag[]>;
  
  // Screenshot methods
  createScreenshot(screenshot: InsertScreenshot): Promise<Screenshot>;
  getScreenshotById(id: number): Promise<Screenshot | undefined>;
  getScreenshotsByPageId(pageId: number): Promise<Screenshot[]>;
  getScreenshotsByDeviceType(pageId: number, deviceType: string): Promise<Screenshot[]>;
  getLatestScreenshot(pageId: number, deviceType: string): Promise<Screenshot | undefined>;
  
  // Device profile methods
  createDeviceProfile(profile: InsertDeviceProfile): Promise<DeviceProfile>;
  getDeviceProfiles(): Promise<DeviceProfile[]>;
  getDefaultDeviceProfiles(): Promise<DeviceProfile[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tags: Map<number, Tag>;
  private websites: Map<number, Website>;
  private websiteTags: Map<number, WebsiteTag>;
  private captures: Map<number, Capture>;
  private pages: Map<number, Page>;
  private pageTags: Map<number, PageTag>;
  private screenshots: Map<number, Screenshot>;
  private deviceProfiles: Map<number, DeviceProfile>;
  
  private currentUserIds: number;
  private currentTagIds: number;
  private currentWebsiteIds: number;
  private currentWebsiteTagIds: number;
  private currentCaptureIds: number;
  private currentPageIds: number;
  private currentPageTagIds: number;
  private currentScreenshotIds: number;
  private currentDeviceProfileIds: number;

  constructor() {
    this.users = new Map();
    this.tags = new Map();
    this.websites = new Map();
    this.websiteTags = new Map();
    this.captures = new Map();
    this.pages = new Map();
    this.pageTags = new Map();
    this.screenshots = new Map();
    this.deviceProfiles = new Map();
    
    this.currentUserIds = 1;
    this.currentTagIds = 1;
    this.currentWebsiteIds = 1;
    this.currentWebsiteTagIds = 1;
    this.currentCaptureIds = 1;
    this.currentPageIds = 1;
    this.currentPageTagIds = 1;
    this.currentScreenshotIds = 1;
    this.currentDeviceProfileIds = 1;

    // Initialize default device profiles
    this.initDefaultDeviceProfiles();
  }

  private initDefaultDeviceProfiles() {
    this.createDeviceProfile({
      name: "Desktop",
      width: 1920,
      height: 1080,
      isDefault: true,
      userId: null
    });
    
    this.createDeviceProfile({
      name: "Tablet",
      width: 768,
      height: 1024,
      isDefault: true,
      userId: null
    });
    
    this.createDeviceProfile({
      name: "Mobile",
      width: 375,
      height: 667,
      isDefault: true,
      userId: null
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserIds++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Tag methods
  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.currentTagIds++;
    const tag: Tag = { ...insertTag, id };
    this.tags.set(id, tag);
    return tag;
  }

  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  async getTagById(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }

  async deleteTag(id: number): Promise<void> {
    this.tags.delete(id);

    // Remove tag associations
    Array.from(this.websiteTags.values())
      .filter(wt => wt.tagId === id)
      .forEach(wt => this.websiteTags.delete(wt.id));
    
    Array.from(this.pageTags.values())
      .filter(pt => pt.tagId === id)
      .forEach(pt => this.pageTags.delete(pt.id));
  }

  // Website methods
  async createWebsite(insertWebsite: InsertWebsite): Promise<Website> {
    const id = this.currentWebsiteIds++;
    const website: Website = { 
      ...insertWebsite, 
      id, 
      createdAt: new Date() 
    };
    this.websites.set(id, website);
    return website;
  }

  async getWebsiteById(id: number): Promise<Website | undefined> {
    return this.websites.get(id);
  }

  async getWebsiteByUrl(url: string): Promise<Website | undefined> {
    return Array.from(this.websites.values()).find(
      (website) => website.url === url
    );
  }

  async getWebsites(): Promise<WebsiteWithDetails[]> {
    return Promise.all(
      Array.from(this.websites.values()).map(async (website) => {
        const tags = await this.getWebsiteTags(website.id);
        const websiteCaptures = Array.from(this.captures.values())
          .filter(capture => capture.websiteId === website.id);
        
        const latestCapture = websiteCaptures.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        const websitePages = Array.from(this.pages.values())
          .filter(page => page.websiteId === website.id);
          
        return {
          ...website,
          tags,
          captureCount: websiteCaptures.length,
          pageCount: websitePages.length,
          latestCapture: latestCapture ? {
            status: latestCapture.status,
            createdAt: latestCapture.createdAt
          } : undefined
        };
      })
    );
  }

  async addTagToWebsite(insertWebsiteTag: InsertWebsiteTag): Promise<WebsiteTag> {
    const id = this.currentWebsiteTagIds++;
    const websiteTag: WebsiteTag = { ...insertWebsiteTag, id };
    this.websiteTags.set(id, websiteTag);
    return websiteTag;
  }

  async getWebsiteTags(websiteId: number): Promise<Tag[]> {
    const tagIds = Array.from(this.websiteTags.values())
      .filter(wt => wt.websiteId === websiteId)
      .map(wt => wt.tagId);
    
    return Array.from(this.tags.values())
      .filter(tag => tagIds.includes(tag.id));
  }

  // Capture methods
  async createCapture(insertCapture: InsertCapture): Promise<Capture> {
    const id = this.currentCaptureIds++;
    const capture: Capture = { 
      ...insertCapture, 
      id, 
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      completedAt: null,
      error: null
    };
    this.captures.set(id, capture);
    return capture;
  }

  async getCaptureById(id: number): Promise<Capture | undefined> {
    return this.captures.get(id);
  }

  async getCaptureWithDetails(id: number): Promise<CaptureWithDetails | undefined> {
    const capture = this.captures.get(id);
    if (!capture) return undefined;

    const website = this.websites.get(capture.websiteId);
    const capturePages = Array.from(this.pages.values())
      .filter(page => page.websiteId === capture.websiteId);
    
    const captureScreenshots = Array.from(this.screenshots.values())
      .filter(ss => ss.captureId === id);
    
    const completedPages = new Set(captureScreenshots.map(ss => ss.pageId));

    return {
      ...capture,
      website: website ? {
        id: website.id,
        name: website.name,
        domain: website.domain,
        url: website.url
      } : undefined,
      pages: capturePages.map(page => ({
        id: page.id,
        url: page.url,
        title: page.title || ''
      })),
      pageCount: capturePages.length,
      completedPageCount: completedPages.size
    };
  }

  async getCaptures(): Promise<CaptureWithDetails[]> {
    return Promise.all(
      Array.from(this.captures.values()).map(async (capture) => {
        return this.getCaptureWithDetails(capture.id) as Promise<CaptureWithDetails>;
      })
    );
  }

  async updateCaptureStatus(id: number, status: string): Promise<Capture> {
    const capture = this.captures.get(id);
    if (!capture) throw new Error(`Capture with ID ${id} not found`);
    
    const updatedCapture = { ...capture, status };
    this.captures.set(id, updatedCapture);
    return updatedCapture;
  }

  async updateCaptureProgress(id: number, progress: number): Promise<Capture> {
    const capture = this.captures.get(id);
    if (!capture) throw new Error(`Capture with ID ${id} not found`);
    
    const updatedCapture = { ...capture, progress };
    this.captures.set(id, updatedCapture);
    return updatedCapture;
  }

  async setCaptureError(id: number, error: string): Promise<Capture> {
    const capture = this.captures.get(id);
    if (!capture) throw new Error(`Capture with ID ${id} not found`);
    
    const updatedCapture = { ...capture, status: 'failed', error };
    this.captures.set(id, updatedCapture);
    return updatedCapture;
  }

  async setCaptureCompleted(id: number): Promise<Capture> {
    const capture = this.captures.get(id);
    if (!capture) throw new Error(`Capture with ID ${id} not found`);
    
    const updatedCapture = { 
      ...capture, 
      status: 'complete', 
      progress: 100,
      completedAt: new Date()
    };
    this.captures.set(id, updatedCapture);
    return updatedCapture;
  }

  // Page methods
  async createPage(insertPage: InsertPage): Promise<Page> {
    const id = this.currentPageIds++;
    const page: Page = { 
      ...insertPage, 
      id, 
      createdAt: new Date()
    };
    this.pages.set(id, page);
    return page;
  }

  async getPageById(id: number): Promise<Page | undefined> {
    return this.pages.get(id);
  }

  async getPagesByWebsiteId(websiteId: number): Promise<Page[]> {
    return Array.from(this.pages.values())
      .filter(page => page.websiteId === websiteId);
  }

  async getPageWithDetails(id: number): Promise<PageWithDetails | undefined> {
    const page = this.pages.get(id);
    if (!page) return undefined;

    const tags = await this.getPageTags(id);
    const screenshots = Array.from(this.screenshots.values())
      .filter(ss => ss.pageId === id);

    return {
      ...page,
      tags,
      screenshots
    };
  }

  async addTagToPage(insertPageTag: InsertPageTag): Promise<PageTag> {
    const id = this.currentPageTagIds++;
    const pageTag: PageTag = { ...insertPageTag, id };
    this.pageTags.set(id, pageTag);
    return pageTag;
  }

  async getPageTags(pageId: number): Promise<Tag[]> {
    const tagIds = Array.from(this.pageTags.values())
      .filter(pt => pt.pageId === pageId)
      .map(pt => pt.tagId);
    
    return Array.from(this.tags.values())
      .filter(tag => tagIds.includes(tag.id));
  }

  // Screenshot methods
  async createScreenshot(insertScreenshot: InsertScreenshot): Promise<Screenshot> {
    const id = this.currentScreenshotIds++;
    const screenshot: Screenshot = { 
      ...insertScreenshot, 
      id, 
      version: 1,
      createdAt: new Date()
    };
    this.screenshots.set(id, screenshot);
    return screenshot;
  }

  async getScreenshotById(id: number): Promise<Screenshot | undefined> {
    return this.screenshots.get(id);
  }

  async getScreenshotsByPageId(pageId: number): Promise<Screenshot[]> {
    return Array.from(this.screenshots.values())
      .filter(ss => ss.pageId === pageId);
  }

  async getScreenshotsByDeviceType(pageId: number, deviceType: string): Promise<Screenshot[]> {
    return Array.from(this.screenshots.values())
      .filter(ss => ss.pageId === pageId && ss.deviceType === deviceType)
      .sort((a, b) => b.version - a.version); // Sort by version, newest first
  }

  async getLatestScreenshot(pageId: number, deviceType: string): Promise<Screenshot | undefined> {
    const screenshots = await this.getScreenshotsByDeviceType(pageId, deviceType);
    return screenshots.length > 0 ? screenshots[0] : undefined;
  }

  // Device profile methods
  async createDeviceProfile(insertProfile: InsertDeviceProfile): Promise<DeviceProfile> {
    const id = this.currentDeviceProfileIds++;
    const profile: DeviceProfile = { ...insertProfile, id };
    this.deviceProfiles.set(id, profile);
    return profile;
  }

  async getDeviceProfiles(): Promise<DeviceProfile[]> {
    return Array.from(this.deviceProfiles.values());
  }

  async getDefaultDeviceProfiles(): Promise<DeviceProfile[]> {
    return Array.from(this.deviceProfiles.values())
      .filter(profile => profile.isDefault);
  }
}

export const storage = new MemStorage();
