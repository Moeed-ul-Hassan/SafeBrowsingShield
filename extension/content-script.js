// FocusShield Content Script
// This script inspects page content for adult material and applies filters

// Configuration
const NSFW_CONFIDENCE_THRESHOLD = 0.7;
const MIN_IMAGE_SIZE = 40;
let nsfwjsModel = null;
let settings = {
  websiteFiltering: true,
  imageDetection: true,
  vpnDetection: true,
  keywordFiltering: true
};

// Adult keywords to look for in page content
const adultKeywords = [
  'porn', 'xxx', 'adult', 'sex', 'nude', 'naked', 'cam', 'hot', 'sexy', 'escorts',
  'playboy', 'playmate', 'hustler', 'penthouse', 'adultfriendfinder', 'amateur',
  'boobs', 'nsfw', 'xvideos', 'pornhub', 'xhamster', 'xnxx', 'redtube', 'youporn',
  'brazzers', 'onlyfans'
];

// Get settings from background script
chrome.runtime.sendMessage({ action: 'check_settings' }, function(response) {
  if (response && response.settings) {
    settings = response.settings;
    
    // Start content scanning if settings enable it
    if (settings.keywordFiltering) {
      analyzePageContent();
    }
    
    if (settings.imageDetection) {
      loadNsfwModel().then(() => {
        scanImages();
        setupMutationObserver();
      });
    }
  }
});

// Load NSFW.js model
async function loadNsfwModel() {
  if (!settings.imageDetection) return;
  
  // First, ensure TensorFlow.js is available
  if (!window.tf) {
    // Load TensorFlow.js from CDN if needed
    await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js');
  }
  
  // Then load NSFW.js
  if (!window.nsfwjs) {
    await loadScript('https://cdn.jsdelivr.net/npm/nsfwjs@2.4.2/dist/nsfwjs.min.js');
  }
  
  try {
    // Load the model
    nsfwjsModel = await window.nsfwjs.load(
      'https://tfhub.dev/google/tfjs-model/nsfwjs/1/default/1',
      { size: 299 }
    );
    console.log('NSFW model loaded successfully');
  } catch (error) {
    console.error('Error loading NSFW model:', error);
  }
}

// Helper function to load scripts dynamically
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Analyze page content for adult keywords
function analyzePageContent() {
  if (!settings.keywordFiltering) return;
  
  // Get page content
  const pageText = document.body.innerText.toLowerCase();
  
  // Check for adult keywords
  let foundKeywords = [];
  for (const keyword of adultKeywords) {
    if (pageText.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }
  
  // If adult keywords found, check keyword density
  if (foundKeywords.length > 0) {
    const totalWords = pageText.split(/\s+/).length;
    const keywordDensity = foundKeywords.length / totalWords;
    
    // If keyword density is high enough, block the page
    if (keywordDensity > 0.01 || foundKeywords.length >= 5) {
      // Report to background script
      chrome.runtime.sendMessage({
        action: 'content_blocked',
        url: window.location.href,
        reason: 'Adult Content Keywords'
      });
      
      // Replace page with blocked message
      showBlockedOverlay('This page contains adult content and has been blocked.');
    }
  }
}

// Scan images for NSFW content
async function scanImages() {
  if (!settings.imageDetection || !nsfwjsModel) return;
  
  // Get all images on the page
  const images = document.querySelectorAll('img');
  
  for (const img of images) {
    // Skip small images
    if (img.width < MIN_IMAGE_SIZE || img.height < MIN_IMAGE_SIZE) {
      continue;
    }
    
    // Skip images that have already been processed
    if (img.dataset.nsfwChecked) {
      continue;
    }
    
    // Skip images that aren't loaded yet
    if (!img.complete || img.naturalWidth === 0) {
      img.addEventListener('load', () => checkImage(img));
      continue;
    }
    
    // Check image
    checkImage(img);
  }
}

// Check if an image is NSFW
async function checkImage(img) {
  if (!settings.imageDetection || !nsfwjsModel) return;
  
  // Skip if already processed
  if (img.dataset.nsfwChecked) return;
  
  // Mark as processed
  img.dataset.nsfwChecked = 'true';
  
  try {
    // Check if image is visible and large enough
    if (img.width < MIN_IMAGE_SIZE || img.height < MIN_IMAGE_SIZE || !isVisible(img)) {
      return;
    }
    
    // Predict content
    const predictions = await nsfwjsModel.classify(img);
    
    // Check for NSFW content
    const pornPrediction = predictions.find(p => p.className === 'Porn');
    const sexyPrediction = predictions.find(p => p.className === 'Sexy');
    
    if ((pornPrediction && pornPrediction.probability > NSFW_CONFIDENCE_THRESHOLD) ||
        (sexyPrediction && sexyPrediction.probability > NSFW_CONFIDENCE_THRESHOLD)) {
      // Blur the image
      blurImage(img);
      
      // Report to background script
      chrome.runtime.sendMessage({
        action: 'content_blocked',
        url: window.location.href,
        reason: 'NSFW Image'
      });
    }
  } catch (error) {
    console.error('Error classifying image:', error);
  }
}

// Determine if an element is visible
function isVisible(element) {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

// Blur an NSFW image
function blurImage(img) {
  // Add blur style
  img.style.filter = 'blur(20px)';
  img.style.transition = 'filter 0.5s ease';
  
  // Create a parent wrapper if needed
  let wrapper = img.parentElement;
  if (getComputedStyle(wrapper).position === 'static') {
    wrapper.style.position = 'relative';
  }
  
  // Add warning overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  overlay.style.color = 'white';
  overlay.style.fontSize = '14px';
  overlay.style.fontWeight = 'bold';
  overlay.style.textAlign = 'center';
  overlay.style.textShadow = '0 0 3px rgba(0, 0, 0, 0.8)';
  overlay.style.zIndex = '1000';
  overlay.textContent = 'Potentially explicit content blurred';
  
  wrapper.appendChild(overlay);
}

// Set up a mutation observer to detect new content
function setupMutationObserver() {
  // Create an observer instance
  const observer = new MutationObserver((mutations) => {
    let newImages = false;
    let contentChanged = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        // Check for new images in added nodes
        for (const node of mutation.addedNodes) {
          if (node.nodeName === 'IMG') {
            newImages = true;
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.querySelector('img')) {
              newImages = true;
            }
            
            // Check if text content was added
            if (node.textContent && node.textContent.trim().length > 0) {
              contentChanged = true;
            }
          }
        }
      }
    }
    
    // If new images were added, scan them
    if (newImages && settings.imageDetection) {
      setTimeout(scanImages, 500);
    }
    
    // If content changed, analyze page again
    if (contentChanged && settings.keywordFiltering) {
      setTimeout(analyzePageContent, 1000);
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Show blocked content overlay
function showBlockedOverlay(message) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'focusshield-blocked-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'white';
  overlay.style.zIndex = '9999999';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '2rem';
  overlay.style.fontFamily = 'Inter, sans-serif';
  
  // Overlay content
  overlay.innerHTML = `
    <div style="max-width: 600px; text-align: center;">
      <div style="width: 96px; height: 96px; border-radius: 50%; background-color: #FEE2E2; 
                  display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
             stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18.364 5.636a9 9 0 1 0 .002 12.728 9 9 0 0 0-.002-12.728"/>
          <path d="M16.95 7.05a7 7 0 1 0 .001 9.9 7 7 0 0 0-.001-9.9"/>
          <path d="m9 15 6-6"/>
          <path d="m15 15-6-6"/>
        </svg>
      </div>
      
      <h2 style="font-size: 1.875rem; font-weight: 700; color: #1F2937; margin-bottom: 1rem;">
        Content Blocked
      </h2>
      
      <p style="color: #4B5563; margin-bottom: 1.5rem;">
        ${message || 'This website contains explicit content that you\'ve chosen to block as part of your recovery journey.'}
      </p>
      
      <div style="background-color: #F9FAFB; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem;">
        <blockquote style="font-size: 1.25rem; font-style: italic; color: #4B5563; margin-bottom: 0.5rem;">
          "Every time you resist temptation, you become stronger than you were before."
        </blockquote>
        <p style="color: #6B7280; font-size: 0.875rem;">Remember why you started this journey</p>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 400px; margin: 0 auto;">
        <button id="focusshield-back-button" style="padding: 0.75rem 1rem; background-color: #2563EB; color: white; 
                border: none; border-radius: 0.375rem; font-weight: 500; cursor: pointer; display: flex; 
                align-items: center; justify-content: center; gap: 0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          Go Back
        </button>
        
        <button id="focusshield-motivation-button" style="padding: 0.75rem 1rem; background-color: white; 
                border: 1px solid #D1D5DB; color: #4B5563; border-radius: 0.375rem; font-weight: 500; 
                cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
            <line x1="16" x2="2" y1="8" y2="22"/>
            <line x1="17.5" x2="9" y1="15" y2="15"/>
          </svg>
          View Motivation
        </button>
      </div>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(overlay);
  
  // Store original body content
  const originalContent = document.body.innerHTML;
  document.body.innerHTML = '';
  document.body.appendChild(overlay);
  
  // Add event listeners
  document.getElementById('focusshield-back-button').addEventListener('click', () => {
    window.history.back();
  });
  
  document.getElementById('focusshield-motivation-button').addEventListener('click', () => {
    // Open motivation page in extension or redirect to dashboard
    chrome.runtime.sendMessage({ action: 'open_motivation' });
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'vpn_detected') {
    showVpnWarning();
  }
  else if (message.action === 'check_content') {
    if (settings.keywordFiltering) {
      analyzePageContent();
    }
    if (settings.imageDetection && nsfwjsModel) {
      scanImages();
    }
    sendResponse({ success: true });
  }
  else if (message.action === 'update_settings') {
    settings = message.settings;
    sendResponse({ success: true });
    
    // Run relevant checks with new settings
    if (settings.keywordFiltering) {
      analyzePageContent();
    }
    if (settings.imageDetection) {
      loadNsfwModel().then(scanImages);
    }
  }
});

// Show VPN detected warning
function showVpnWarning() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'focusshield-vpn-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'white';
  overlay.style.zIndex = '9999999';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '2rem';
  overlay.style.fontFamily = 'Inter, sans-serif';
  
  // Overlay content
  overlay.innerHTML = `
    <div style="max-width: 600px; text-align: center;">
      <div style="width: 96px; height: 96px; border-radius: 50%; background-color: #FEF3C7; 
                  display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
             stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <path d="M12 9v4"/>
          <path d="M12 17h.01"/>
        </svg>
      </div>
      
      <h2 style="font-size: 1.875rem; font-weight: 700; color: #1F2937; margin-bottom: 1rem;">
        VPN Detected
      </h2>
      
      <p style="color: #4B5563; margin-bottom: 1.5rem;">
        We've detected that you're using a VPN or proxy service. This might be an attempt to bypass your content filters.
      </p>
      
      <div style="background-color: #FEF2F2; border: 1px solid #FEE2E2; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-weight: 500; color: #991B1B; margin-bottom: 0.5rem;">This attempt has been logged</h3>
        <p style="color: #B91C1C; font-size: 0.875rem;">
          Your accountability partner will be notified about this activity. Remember, recovery comes from honesty with yourself and others.
        </p>
      </div>
      
      <button id="focusshield-vpn-understand-button" style="padding: 0.75rem 1.5rem; background-color: #2563EB; 
              color: white; border: none; border-radius: 0.375rem; font-weight: 500; cursor: pointer; 
              display: inline-flex; align-items: center; gap: 0.5rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
        I Understand
      </button>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(overlay);
  
  // Add event listener
  document.getElementById('focusshield-vpn-understand-button').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
}

// Initialize when page loads
window.addEventListener('load', function() {
  // Initial content scan
  if (settings.keywordFiltering) {
    analyzePageContent();
  }
  
  // Initial image scan
  if (settings.imageDetection) {
    loadNsfwModel().then(() => {
      scanImages();
      setupMutationObserver();
    });
  }
});
