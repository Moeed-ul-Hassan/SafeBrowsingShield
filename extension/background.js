// FocusShield Background Script
// This script handles background monitoring and blocking

// Import the blocklist and check it hasn't been tampered with
const adultDomains = [
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'redtube.com',
  'youporn.com', 'brazzers.com', 'onlyfans.com', 'adultfriendfinder.com',
  'livejasmin.com', 'stripchat.com', 'chaturbate.com', 'cam4.com',
  'myfreecams.com', 'bongacams.com', 'spankbang.com', 'flirt4free.com',
  'pornmd.com', 'youjizz.com', 'pornhat.com', 'porn.com', 'porntrex.com',
  'efukt.com', 'xhamster1.com', 'xhamster2.com', 'xhamster3.com', 'xhamster4.com',
  'xhamster5.com', 'xhamster6.com', 'xhamster7.com', 'xhamster8.com', 'xhamster9.com',
  'pornone.com', 'thumbzilla.com', 'tube8.com', 'swinglifestyle.com', 'worldsex.com',
  'adultdvdtalk.com', 'adultdvdempire.com', 'adultfriendfinders.com', 'adultism.com',
  'adultmoviezone.com', 'adultonlinecinema.com', 'adultsales.com', 'adultsight.com',
  'adultsites.com', 'adultsonly.com', 'adulttopsites.com', 'amateuralbum.com'
];

const adultKeywords = [
  'porn', 'xxx', 'adult', 'sex', 'nude', 'naked', 'cam', 'hot', 'sexy', 'escorts',
  'playboy', 'playmate', 'hustler', 'penthouse', 'adultfriendfinder', 'amateur',
  'boobs', 'nsfw', 'xvideos', 'pornhub', 'xhamster', 'xnxx', 'redtube', 'youporn',
  'brazzers', 'onlyfans', 'ass', 'milf', 'gangbang', 'orgy', 'hardcore'
];

// User settings (with default values)
let settings = {
  websiteFiltering: true,
  imageDetection: true,
  vpnDetection: true,
  keywordFiltering: true,
  strictModeEnabled: false,
  strictModeExpiry: null,
  strictModePassword: ''
};

// Get settings from storage
chrome.storage.sync.get(['settings', 'strictMode'], function(data) {
  if (data.settings) {
    settings = { ...settings, ...data.settings };
  }
  
  if (data.strictMode) {
    settings.strictModeEnabled = data.strictMode.enabled;
    settings.strictModeExpiry = data.strictMode.expiryDate;
    settings.strictModePassword = data.strictMode.password;
    
    // Check if strict mode has expired
    if (settings.strictModeEnabled && settings.strictModeExpiry) {
      const expiryDate = new Date(settings.strictModeExpiry);
      if (expiryDate < new Date()) {
        settings.strictModeEnabled = false;
        chrome.storage.sync.set({ 
          strictMode: { 
            enabled: false, 
            expiryDate: null, 
            password: settings.strictModePassword 
          } 
        });
      }
    }
  }
});

// Listen for settings changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync') {
    if (changes.settings) {
      settings = { ...settings, ...changes.settings.newValue };
    }
    if (changes.strictMode) {
      settings.strictModeEnabled = changes.strictMode.newValue.enabled;
      settings.strictModeExpiry = changes.strictMode.newValue.expiryDate;
      settings.strictModePassword = changes.strictMode.newValue.password;
    }
  }
});

// Check if a URL should be blocked
function shouldBlockUrl(url) {
  if (!settings.websiteFiltering) return false;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    // Check if domain is in our blocklist
    for (const adultDomain of adultDomains) {
      if (domain === adultDomain || domain.endsWith(`.${adultDomain}`)) {
        return true;
      }
    }
    
    // If keyword filtering is enabled, check for adult keywords
    if (settings.keywordFiltering) {
      // Check domain for keywords
      for (const keyword of adultKeywords) {
        if (domain.includes(keyword) || urlObj.pathname.toLowerCase().includes(keyword)) {
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('URL parsing error:', error);
    return false;
  }
}

// Block requests to adult websites
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Skip non-document requests
    if (details.type !== 'main_frame') return { cancel: false };
    
    // Check if URL should be blocked
    if (shouldBlockUrl(details.url)) {
      // Log the blocked site
      logBlockedSite(details.url, 'Adult Website');
      
      // Redirect to the block page
      return { 
        redirectUrl: chrome.runtime.getURL("blocked.html") + 
                     "?url=" + encodeURIComponent(details.url)
      };
    }
    
    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Log blocked sites
function logBlockedSite(url, category) {
  const blockedSite = {
    url: url,
    timestamp: new Date().toISOString(),
    category: category
  };
  
  // Save to local storage
  chrome.storage.local.get({ blockedSites: [] }, function(data) {
    const blockedSites = data.blockedSites;
    blockedSites.push(blockedSite);
    chrome.storage.local.set({ blockedSites: blockedSites });
  });
  
  // If accountability partner exists, notify them
  chrome.storage.sync.get('accountabilityPartner', function(data) {
    if (data.accountabilityPartner && data.accountabilityPartner.email && 
        data.accountabilityPartner.notifyBlocked) {
      notifyPartner(data.accountabilityPartner.email, blockedSite);
    }
  });
}

// Notify accountability partner
function notifyPartner(email, blockedSite) {
  // In a real implementation, this would send an email or notification 
  // to the accountability partner through a server-side API
  console.log('Notifying partner:', email, 'about:', blockedSite);
  
  // For now, we'll just make a request to our backend API if it's available
  fetch('https://api.focusshield.com/notify-partner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      blockedSite: blockedSite
    })
  }).catch(error => {
    console.error('Error notifying partner:', error);
  });
}

// Detect VPN usage
async function checkVpnUsage() {
  if (!settings.vpnDetection) return;
  
  try {
    // Get API key from environment (or use a free fallback)
    const apiKey = ""; // You would add your API key here in production
    
    // Make request to ipapi.co to detect VPN
    const response = await fetch(`https://ipapi.co/json/${apiKey ? '?key=' + apiKey : ''}`);
    const data = await response.json();
    
    if (data.security && (data.security.vpn || data.security.proxy || data.security.tor)) {
      // VPN detected, notify tabs
      chrome.tabs.query({}, function(tabs) {
        for (const tab of tabs) {
          chrome.tabs.sendMessage(tab.id, { action: 'vpn_detected' });
        }
      });
      
      // Log the VPN usage
      logBlockedSite('VPN_USAGE', 'VPN/Proxy');
    }
  } catch (error) {
    console.error('Error checking VPN:', error);
  }
}

// Check for VPN usage periodically (every 30 minutes)
setInterval(checkVpnUsage, 30 * 60 * 1000);
// Also check on startup
setTimeout(checkVpnUsage, 5000);

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'check_settings') {
    sendResponse({ settings: settings });
  }
  else if (message.action === 'update_settings') {
    // If strict mode is enabled, don't allow changes without password
    if (settings.strictModeEnabled && !message.password) {
      sendResponse({ success: false, error: 'Strict mode is enabled' });
      return true;
    }
    
    // If password provided, check it matches
    if (settings.strictModeEnabled && message.password !== settings.strictModePassword) {
      sendResponse({ success: false, error: 'Incorrect password' });
      return true;
    }
    
    // Update settings
    chrome.storage.sync.set({ settings: message.settings }, function() {
      sendResponse({ success: true });
    });
    return true;
  }
  else if (message.action === 'enable_strict_mode') {
    const strictMode = {
      enabled: true,
      expiryDate: message.expiryDate,
      password: message.password
    };
    
    chrome.storage.sync.set({ strictMode: strictMode }, function() {
      sendResponse({ success: true });
    });
    return true;
  }
  else if (message.action === 'disable_strict_mode') {
    // Verify password
    if (message.password !== settings.strictModePassword) {
      sendResponse({ success: false, error: 'Incorrect password' });
      return true;
    }
    
    const strictMode = {
      enabled: false,
      expiryDate: null,
      password: settings.strictModePassword
    };
    
    chrome.storage.sync.set({ strictMode: strictMode }, function() {
      sendResponse({ success: true });
    });
    return true;
  }
  else if (message.action === 'get_blocked_sites') {
    chrome.storage.local.get({ blockedSites: [] }, function(data) {
      sendResponse({ blockedSites: data.blockedSites });
    });
    return true;
  }
  else if (message.action === 'content_blocked') {
    logBlockedSite(message.url, message.reason);
    sendResponse({ success: true });
  }
});

// Check for updates to the blocklist periodically
function updateBlocklist() {
  // In a production environment, you would fetch the latest blocklist
  // from your server here
  console.log('Checking for blocklist updates...');
}

// Update blocklist daily
setInterval(updateBlocklist, 24 * 60 * 60 * 1000);
