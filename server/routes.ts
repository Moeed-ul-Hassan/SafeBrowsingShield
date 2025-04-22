import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertSettingsSchema, 
  insertBlockedSiteSchema, 
  insertPartnerSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ success: true, userId: user.id });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      // Don't send password in response
      const { password, strictModePassword, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Settings routes
  app.post('/api/settings', async (req, res) => {
    try {
      const settingsData = insertSettingsSchema.parse(req.body);
      const settings = await storage.saveSettings(settingsData);
      res.json({ success: true, settings });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid settings data' });
    }
  });

  app.get('/api/settings/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await storage.getSettings(userId);
      
      if (!settings) {
        return res.status(404).json({ success: false, message: 'Settings not found' });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Blocked sites routes
  app.post('/api/blocked-sites', async (req, res) => {
    try {
      const blockedSiteData = insertBlockedSiteSchema.parse(req.body);
      const blockedSite = await storage.addBlockedSite(blockedSiteData);
      res.json({ success: true, blockedSite });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid blocked site data' });
    }
  });

  app.get('/api/blocked-sites/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const blockedSites = await storage.getBlockedSites(userId);
      res.json(blockedSites);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Accountability partners routes
  app.post('/api/accountability-partners', async (req, res) => {
    try {
      const partnerData = insertPartnerSchema.parse(req.body);
      const partner = await storage.addAccountabilityPartner(partnerData);
      res.json({ success: true, partner });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid partner data' });
    }
  });

  app.get('/api/accountability-partners/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const partners = await storage.getAccountabilityPartners(userId);
      res.json(partners);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // VPN check route
  app.get('/api/check-vpn', async (req, res) => {
    try {
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
      // In a real implementation, we would use a service like ipapi.co
      // For demonstration purposes, we're returning a mock response
      res.json({ 
        isVpn: false,
        message: 'No VPN detected'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Strict mode routes
  app.post('/api/strict-mode/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { password, duration } = req.body;
      
      if (!password || !duration) {
        return res.status(400).json({ success: false, message: 'Password and duration required' });
      }
      
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(duration));
      
      const updated = await storage.enableStrictMode(userId, password, expiryDate);
      
      if (!updated) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, message: 'Strict mode enabled', expiryDate });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.post('/api/strict-mode/:userId/disable', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ success: false, message: 'Password required' });
      }
      
      const result = await storage.disableStrictMode(userId, password);
      
      if (!result) {
        return res.status(403).json({ success: false, message: 'Invalid password or user not found' });
      }
      
      res.json({ success: true, message: 'Strict mode disabled' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
