import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  strictModeEnabled: boolean("strict_mode_enabled").default(false),
  strictModeExpiry: timestamp("strict_mode_expiry"),
  strictModePassword: text("strict_mode_password"),
  daysClean: integer("days_clean").default(0),
  startDate: timestamp("start_date").defaultNow()
});

export const blockedSites = pgTable("blocked_sites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow(),
  url: text("url").notNull(),
  category: text("category").notNull()
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  websiteFiltering: boolean("website_filtering").default(true),
  imageDetection: boolean("image_detection").default(true),
  vpnDetection: boolean("vpn_detection").default(true),
  keywordFiltering: boolean("keyword_filtering").default(true)
});

export const accountabilityPartners = pgTable("accountability_partners", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  email: text("email").notNull(),
  notifyBlocked: boolean("notify_blocked").default(true),
  notifySettings: boolean("notify_settings").default(true),
  weeklyReports: boolean("weekly_reports").default(false)
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSettingsSchema = createInsertSchema(settings).pick({
  userId: true,
  websiteFiltering: true,
  imageDetection: true,
  vpnDetection: true,
  keywordFiltering: true,
});

export const insertBlockedSiteSchema = createInsertSchema(blockedSites).pick({
  userId: true,
  url: true,
  category: true,
});

export const insertPartnerSchema = createInsertSchema(accountabilityPartners).pick({
  userId: true,
  email: true,
  notifyBlocked: true,
  notifySettings: true,
  weeklyReports: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Settings = typeof settings.$inferSelect;
export type BlockedSite = typeof blockedSites.$inferSelect;
export type AccountabilityPartner = typeof accountabilityPartners.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type InsertBlockedSite = z.infer<typeof insertBlockedSiteSchema>;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
