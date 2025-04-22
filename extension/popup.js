// FocusShield Popup Script
// Handles the popup UI and user interactions

// UI Elements
const websiteFilteringToggle = document.getElementById('website-filtering');
const imageDetectionToggle = document.getElementById('image-detection');
const vpnDetectionToggle = document.getElementById('vpn-detection');
const statusText = document.getElementById('status-text');
const daysCleanElement = document.getElementById('days-clean');
const progressBar = document.getElementById('progress-bar');
const advancedSettingsButton = document.getElementById('advanced-settings');
const openDashboardButton = document.getElementById('open-dashboard');
const enableStrictModeButton = document.getElementById('enable-strict-mode');

// Settings and state
let settings = {
  websiteFiltering: true,
  imageDetection: true,
  vpnDetection: true,
  keywordFiltering: true
};
let strictMode = {
  enabled: false,
  expiryDate: null,
  password: ''
};
let daysClean = 0;

// Get settings when popup opens
document.addEventListener('DOMContentLoaded', function() {
  // Get settings from storage
  chrome.storage.sync.get(['settings', 'strictMode'], function(data) {
    if (data.settings) {
      settings = data.settings;
      updateUI();
    }
    
    if (data.strictMode) {
      strictMode = data.strictMode;
      
      // If strict mode is enabled, disable toggle switches
      if (strictMode.enabled) {
        disableToggleSwtiches();
        updateStrictModeUI();
      }
    }
  });
  
  // Get days clean
  chrome.storage.sync.get('startDate', function(data) {
    if (data.startDate) {
      const startDate = new Date(data.startDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      daysClean = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // Update UI
      daysCleanElement.textContent = `${daysClean} days`;
      
      // Calculate progress percentage (toward 30 day milestone)
      const progressPercentage = Math.min(100, (daysClean / 30) * 100);
      progressBar.style.width = `${progressPercentage}%`;
    } else {
      // Set start date if not already set
      chrome.storage.sync.set({ 
        startDate: new Date().toISOString() 
      });
    }
  });
  
  // Get blocked sites count today
  chrome.storage.local.get('blockedSites', function(data) {
    if (data.blockedSites && data.blockedSites.length > 0) {
      // Count today's blocks
      const today = new Date().toDateString();
      const todayBlocks = data.blockedSites.filter(site => {
        return new Date(site.timestamp).toDateString() === today;
      });
      
      console.log(`Blocked ${todayBlocks.length} sites today.`);
    }
  });
});

// Update UI based on settings
function updateUI() {
  websiteFilteringToggle.checked = settings.websiteFiltering;
  imageDetectionToggle.checked = settings.imageDetection;
  vpnDetectionToggle.checked = settings.vpnDetection;
  
  statusText.textContent = isProtectionActive() ? 'Active' : 'Inactive';
  
  // Update status badge color
  if (isProtectionActive()) {
    statusText.parentElement.style.backgroundColor = '#10B981'; // green
  } else {
    statusText.parentElement.style.backgroundColor = '#F59E0B'; // amber
  }
}

// Check if any protection is active
function isProtectionActive() {
  return settings.websiteFiltering || 
         settings.imageDetection || 
         settings.vpnDetection || 
         settings.keywordFiltering;
}

// Disable toggle switches when strict mode is active
function disableToggleSwtiches() {
  websiteFilteringToggle.disabled = true;
  imageDetectionToggle.disabled = true;
  vpnDetectionToggle.disabled = true;
  
  // Apply disabled style to settings section
  document.querySelector('.settings-container').classList.add('disabled');
  
  // Show lock icon on status
  statusText.innerHTML = 'Locked <i class="fas fa-lock"></i>';
}

// Update UI when strict mode is enabled
function updateStrictModeUI() {
  enableStrictModeButton.innerHTML = '<i class="fas fa-unlock"></i> Unlock Mode';
  enableStrictModeButton.classList.add('disabled');
  
  // If there's an expiry date, show it
  if (strictMode.expiryDate) {
    const expiryDate = new Date(strictMode.expiryDate);
    const today = new Date();
    const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      statusText.innerHTML = `Locked for ${diffDays} days <i class="fas fa-lock"></i>`;
    }
  }
}

// Event listeners for toggle switches
websiteFilteringToggle.addEventListener('change', function() {
  settings.websiteFiltering = this.checked;
  saveSettings();
});

imageDetectionToggle.addEventListener('change', function() {
  settings.imageDetection = this.checked;
  saveSettings();
});

vpnDetectionToggle.addEventListener('change', function() {
  settings.vpnDetection = this.checked;
  saveSettings();
});

// Save settings to storage
function saveSettings() {
  chrome.storage.sync.set({ settings: settings }, function() {
    updateUI();
    
    // Notify content script of settings change
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'update_settings', 
          settings: settings 
        });
      }
    });
  });
}

// Advanced settings button
advancedSettingsButton.addEventListener('click', function() {
  // Open dashboard to settings page
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') + '?page=protection' });
});

// Open dashboard button
openDashboardButton.addEventListener('click', function() {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});

// Enable strict mode button
enableStrictModeButton.addEventListener('click', function() {
  if (strictMode.enabled) {
    // Ask for password to disable strict mode
    const password = prompt('Enter your strict mode password to unlock:');
    if (!password) return;
    
    chrome.runtime.sendMessage({
      action: 'disable_strict_mode',
      password: password
    }, function(response) {
      if (response.success) {
        strictMode.enabled = false;
        document.querySelector('.settings-container').classList.remove('disabled');
        enableStrictModeButton.innerHTML = '<i class="fas fa-lock"></i> Lock Mode';
        enableStrictModeButton.classList.remove('disabled');
        
        // Enable toggle switches
        websiteFilteringToggle.disabled = false;
        imageDetectionToggle.disabled = false;
        vpnDetectionToggle.disabled = false;
        
        // Update status
        statusText.textContent = 'Active';
        statusText.parentElement.style.backgroundColor = '#10B981';
      } else {
        alert('Error: ' + (response.error || 'Invalid password'));
      }
    });
  } else {
    // Open dashboard to strict mode page
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') + '?page=strict-mode' });
  }
});
