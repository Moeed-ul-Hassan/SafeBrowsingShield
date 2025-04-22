interface Settings {
  websiteFiltering: boolean;
  imageDetection: boolean;
  vpnDetection: boolean;
  keywordFiltering: boolean;
}

interface AccountabilityPartner {
  email: string;
  notifyBlocked: boolean;
  notifySettings: boolean;
  weeklyReports: boolean;
}

interface BlockedSite {
  url: string;
  timestamp: string;
  category: string;
}

interface StrictModeSettings {
  enabled: boolean;
  password: string;
  expiryDate: string | null;
}

/**
 * Local storage helper for the extension and web app
 * Provides methods to save and retrieve user settings and logs
 */
export const storage = {
  /**
   * Save user settings to local storage
   * @param settings The settings object to save
   */
  saveSettings(settings: Settings): void {
    localStorage.setItem('focusshield_settings', JSON.stringify(settings));
  },

  /**
   * Get user settings from local storage
   * @returns The settings object or default settings if none exists
   */
  getSettings(): Settings {
    const stored = localStorage.getItem('focusshield_settings');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default settings
    return {
      websiteFiltering: true,
      imageDetection: true,
      vpnDetection: true,
      keywordFiltering: true
    };
  },

  /**
   * Save strict mode settings to local storage
   * @param strictMode The strict mode settings object
   */
  saveStrictMode(strictMode: StrictModeSettings): void {
    localStorage.setItem('focusshield_strictmode', JSON.stringify(strictMode));
  },

  /**
   * Get strict mode settings from local storage
   * @returns The strict mode settings or default (disabled) if none exists
   */
  getStrictMode(): StrictModeSettings {
    const stored = localStorage.getItem('focusshield_strictmode');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default strict mode settings (disabled)
    return {
      enabled: false,
      password: '',
      expiryDate: null
    };
  },

  /**
   * Save accountability partner information to local storage
   * @param partner The accountability partner object
   */
  saveAccountabilityPartner(partner: AccountabilityPartner): void {
    localStorage.setItem('focusshield_partner', JSON.stringify(partner));
  },

  /**
   * Get accountability partner information from local storage
   * @returns The accountability partner object or null if none exists
   */
  getAccountabilityPartner(): AccountabilityPartner | null {
    const stored = localStorage.getItem('focusshield_partner');
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Log a blocked site to local storage
   * @param blockedSite The blocked site information to log
   */
  logBlockedSite(blockedSite: BlockedSite): void {
    const logs = this.getBlockedSites();
    logs.push(blockedSite);
    localStorage.setItem('focusshield_blocked_sites', JSON.stringify(logs));
  },

  /**
   * Get all logged blocked sites from local storage
   * @returns Array of blocked site logs
   */
  getBlockedSites(): BlockedSite[] {
    const stored = localStorage.getItem('focusshield_blocked_sites');
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Reset all days clean counter and set new start date
   */
  resetDaysClean(): void {
    localStorage.setItem('focusshield_start_date', new Date().toISOString());
  },

  /**
   * Get the number of days clean based on the start date
   * @returns Number of days clean
   */
  getDaysClean(): number {
    const startDateStr = localStorage.getItem('focusshield_start_date');
    if (!startDateStr) {
      // If no start date, set it to today and return 0
      this.resetDaysClean();
      return 0;
    }
    
    const startDate = new Date(startDateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  },

  /**
   * Clear all stored data
   * Use with caution - only when user explicitly requests to reset everything
   */
  clearAllData(): void {
    localStorage.removeItem('focusshield_settings');
    localStorage.removeItem('focusshield_strictmode');
    localStorage.removeItem('focusshield_partner');
    localStorage.removeItem('focusshield_blocked_sites');
    localStorage.removeItem('focusshield_start_date');
  }
};
