import { users, type User, type InsertUser, type Settings, type InsertSettings, type BlockedSite, type InsertBlockedSite, type AccountabilityPartner, type InsertPartner } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Settings methods
  getSettings(userId: number): Promise<Settings | undefined>;
  saveSettings(settings: InsertSettings): Promise<Settings>;
  
  // Blocked site methods
  getBlockedSites(userId: number): Promise<BlockedSite[]>;
  addBlockedSite(blockedSite: InsertBlockedSite): Promise<BlockedSite>;
  
  // Accountability partner methods
  getAccountabilityPartners(userId: number): Promise<AccountabilityPartner[]>;
  addAccountabilityPartner(partner: InsertPartner): Promise<AccountabilityPartner>;
  
  // Strict mode methods
  enableStrictMode(userId: number, password: string, expiryDate: Date): Promise<boolean>;
  disableStrictMode(userId: number, password: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private settings: Map<number, Settings>;
  private blockedSites: Map<number, BlockedSite[]>;
  private accountabilityPartners: Map<number, AccountabilityPartner[]>;
  
  currentId: number;
  currentSettingsId: number;
  currentBlockedSiteId: number;
  currentPartnerId: number;

  constructor() {
    this.users = new Map();
    this.settings = new Map();
    this.blockedSites = new Map();
    this.accountabilityPartners = new Map();
    
    this.currentId = 1;
    this.currentSettingsId = 1;
    this.currentBlockedSiteId = 1;
    this.currentPartnerId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      strictModeEnabled: false,
      strictModeExpiry: null,
      strictModePassword: null,
      daysClean: 0,
      startDate: new Date()
    };
    this.users.set(id, user);
    
    // Create default settings for the user
    this.saveSettings({
      userId: id,
      websiteFiltering: true,
      imageDetection: true,
      vpnDetection: true,
      keywordFiltering: true
    });
    
    return user;
  }
  
  async getSettings(userId: number): Promise<Settings | undefined> {
    return this.settings.get(userId);
  }
  
  async saveSettings(insertSettings: InsertSettings): Promise<Settings> {
    const existingSettings = this.settings.get(insertSettings.userId);
    
    if (existingSettings) {
      // Update existing settings
      const updatedSettings: Settings = {
        ...existingSettings,
        websiteFiltering: insertSettings.websiteFiltering,
        imageDetection: insertSettings.imageDetection,
        vpnDetection: insertSettings.vpnDetection,
        keywordFiltering: insertSettings.keywordFiltering
      };
      this.settings.set(insertSettings.userId, updatedSettings);
      return updatedSettings;
    } else {
      // Create new settings
      const id = this.currentSettingsId++;
      const settings: Settings = {
        id,
        ...insertSettings
      };
      this.settings.set(insertSettings.userId, settings);
      return settings;
    }
  }
  
  async getBlockedSites(userId: number): Promise<BlockedSite[]> {
    return this.blockedSites.get(userId) || [];
  }
  
  async addBlockedSite(insertBlockedSite: InsertBlockedSite): Promise<BlockedSite> {
    const id = this.currentBlockedSiteId++;
    const blockedSite: BlockedSite = {
      id,
      ...insertBlockedSite,
      timestamp: new Date()
    };
    
    // Get existing blocked sites for this user
    const userBlockedSites = this.blockedSites.get(insertBlockedSite.userId) || [];
    userBlockedSites.push(blockedSite);
    
    // Save updated list
    this.blockedSites.set(insertBlockedSite.userId, userBlockedSites);
    
    return blockedSite;
  }
  
  async getAccountabilityPartners(userId: number): Promise<AccountabilityPartner[]> {
    return this.accountabilityPartners.get(userId) || [];
  }
  
  async addAccountabilityPartner(insertPartner: InsertPartner): Promise<AccountabilityPartner> {
    const id = this.currentPartnerId++;
    const partner: AccountabilityPartner = {
      id,
      ...insertPartner
    };
    
    // Get existing partners for this user
    const userPartners = this.accountabilityPartners.get(insertPartner.userId) || [];
    userPartners.push(partner);
    
    // Save updated list
    this.accountabilityPartners.set(insertPartner.userId, userPartners);
    
    return partner;
  }
  
  async enableStrictMode(userId: number, password: string, expiryDate: Date): Promise<boolean> {
    const user = this.users.get(userId);
    
    if (!user) {
      return false;
    }
    
    user.strictModeEnabled = true;
    user.strictModeExpiry = expiryDate;
    user.strictModePassword = password;
    
    // Update user
    this.users.set(userId, user);
    
    return true;
  }
  
  async disableStrictMode(userId: number, password: string): Promise<boolean> {
    const user = this.users.get(userId);
    
    if (!user || user.strictModePassword !== password) {
      return false;
    }
    
    user.strictModeEnabled = false;
    user.strictModeExpiry = null;
    
    // Update user
    this.users.set(userId, user);
    
    return true;
  }
}

export const storage = new MemStorage();
