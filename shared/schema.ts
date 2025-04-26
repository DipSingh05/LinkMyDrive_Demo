import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Cloud drives schema
export const drives = pgTable("drives", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "google", "onedrive", "dropbox", "icloud"
  email: text("email").notNull(),
  totalSpace: integer("total_space").notNull(), // in MB
  usedSpace: integer("used_space").notNull(), // in MB
  isConnected: boolean("is_connected").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDriveSchema = createInsertSchema(drives).pick({
  userId: true,
  name: true,
  type: true,
  email: true,
  totalSpace: true,
  usedSpace: true,
  isConnected: true,
});

// Files schema
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  driveId: integer("drive_id").notNull(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  type: text("type").notNull(), // "pdf", "doc", "image", "video", "audio", "spreadsheet", etc.
  size: integer("size").notNull(), // in KB
  lastModified: text("last_modified").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const insertFileSchema = createInsertSchema(files).pick({
  driveId: true,
  userId: true,
  name: true,
  path: true,
  type: true,
  size: true,
  lastModified: true,
});

// Upload statistics schema
export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  driveId: integer("drive_id").notNull(),
  fileId: integer("file_id").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(), // in KB
  uploadTime: integer("upload_time").notNull(), // in seconds
  uploadDate: timestamp("upload_date").defaultNow(),
  fileType: text("file_type").notNull(),
});

export const insertUploadSchema = createInsertSchema(uploads).pick({
  userId: true,
  driveId: true,
  fileId: true,
  fileName: true,
  fileSize: true,
  uploadTime: true,
  fileType: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Drive = typeof drives.$inferSelect;
export type InsertDrive = z.infer<typeof insertDriveSchema>;

export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
