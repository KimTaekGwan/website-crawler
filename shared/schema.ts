import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Tags schema
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default('#3B82F6'),
  description: text("description"),
});

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  color: true,
  description: true,
});

// Websites schema
export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWebsiteSchema = createInsertSchema(websites).pick({
  url: true,
  name: true,
  domain: true,
});

// Website tags schema - junction table for website-tag many-to-many relationship
export const websiteTags = pgTable("website_tags", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").notNull().references(() => websites.id),
  tagId: integer("tag_id").notNull().references(() => tags.id),
});

export const insertWebsiteTagSchema = createInsertSchema(websiteTags).pick({
  websiteId: true,
  tagId: true,
});

// Captures schema - represents a capture session
export const captures = pgTable("captures", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").notNull().references(() => websites.id),
  status: text("status").notNull().default('pending'),
  deviceTypes: text("device_types").array().notNull(),
  captureFullPage: boolean("capture_full_page").notNull().default(true),
  captureDynamicElements: boolean("capture_dynamic_elements").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  error: text("error"),
  progress: integer("progress").notNull().default(0),
});

export const insertCaptureSchema = createInsertSchema(captures).pick({
  websiteId: true,
  deviceTypes: true,
  captureFullPage: true,
  captureDynamicElements: true,
});

// Pages schema - represents pages within a website
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").notNull().references(() => websites.id),
  url: text("url").notNull(),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPageSchema = createInsertSchema(pages).pick({
  websiteId: true,
  url: true,
  title: true,
});

// Page tags schema - junction table for page-tag many-to-many relationship
export const pageTags = pgTable("page_tags", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull().references(() => pages.id),
  tagId: integer("tag_id").notNull().references(() => tags.id),
});

export const insertPageTagSchema = createInsertSchema(pageTags).pick({
  pageId: true,
  tagId: true,
});

// Screenshots schema - represents screenshot for a page
export const screenshots = pgTable("screenshots", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull().references(() => pages.id),
  captureId: integer("capture_id").notNull().references(() => captures.id),
  deviceType: text("device_type").notNull(),
  path: text("path").notNull(),
  thumbnailPath: text("thumbnail_path").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  version: integer("version").notNull().default(1),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScreenshotSchema = createInsertSchema(screenshots).pick({
  pageId: true,
  captureId: true,
  deviceType: true,
  path: true,
  thumbnailPath: true,
  width: true,
  height: true,
  metadata: true,
});

// Custom device profiles schema
export const deviceProfiles = pgTable("device_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  userId: integer("user_id").references(() => users.id),
  isDefault: boolean("is_default").notNull().default(false),
});

export const insertDeviceProfileSchema = createInsertSchema(deviceProfiles).pick({
  name: true,
  width: true,
  height: true,
  userId: true,
  isDefault: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type Website = typeof websites.$inferSelect;
export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;

export type WebsiteTag = typeof websiteTags.$inferSelect;
export type InsertWebsiteTag = z.infer<typeof insertWebsiteTagSchema>;

export type Capture = typeof captures.$inferSelect;
export type InsertCapture = z.infer<typeof insertCaptureSchema>;

export type Page = typeof pages.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;

export type PageTag = typeof pageTags.$inferSelect;
export type InsertPageTag = z.infer<typeof insertPageTagSchema>;

export type Screenshot = typeof screenshots.$inferSelect;
export type InsertScreenshot = z.infer<typeof insertScreenshotSchema>;

export type DeviceProfile = typeof deviceProfiles.$inferSelect;
export type InsertDeviceProfile = z.infer<typeof insertDeviceProfileSchema>;

// Extended types with joined data
export interface WebsiteWithDetails extends Website {
  tags?: Tag[];
  captureCount?: number;
  pageCount?: number;
  latestCapture?: {
    status: string;
    createdAt: Date;
  };
}

export interface CaptureWithDetails extends Capture {
  website?: {
    id: number;
    name: string;
    domain: string;
    url: string;
  };
  pages?: {
    id: number;
    url: string;
    title: string;
  }[];
  pageCount?: number;
  completedPageCount?: number;
}

export interface PageWithDetails extends Page {
  tags?: Tag[];
  screenshots?: Screenshot[];
}

// CaptureConfig type used for the capture process
export interface CaptureConfig {
  url: string;
  deviceTypes: string[];
  customSizes?: Array<{
    name: string;
    width: number;
    height: number;
  }>;
  captureFullPage: boolean;
  captureDynamicElements: boolean;
  initialTags?: string[];
}
