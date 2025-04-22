import * as tf from '@tensorflow/tfjs';
import * as nsfwjs from 'nsfwjs';

let model: nsfwjs.NSFWJS | null = null;

// Configuration options
const NSFW_THRESHOLD = 0.7; // Confidence threshold for detecting NSFW content
const MIN_IMAGE_SIZE = 40; // Minimum image size to analyze

/**
 * Initialize the NSFW.js model
 */
export async function initNsfwModel(): Promise<void> {
  try {
    // Load the model
    model = await nsfwjs.load(
      'https://tfhub.dev/google/tfjs-model/nsfwjs/1/default/1',
      { size: 299 }
    );
    
    console.log('NSFW model loaded successfully');
  } catch (error) {
    console.error('Error loading NSFW model:', error);
    model = null;
  }
}

/**
 * Check if an image is NSFW (Not Safe For Work)
 * @param imageElement The image element to classify
 * @returns Promise with boolean indicating if the image is NSFW
 */
export async function isImageNsfw(imageElement: HTMLImageElement): Promise<boolean> {
  if (!model) {
    console.warn('NSFW model not loaded');
    return false;
  }
  
  // Skip small images
  if (imageElement.width < MIN_IMAGE_SIZE || imageElement.height < MIN_IMAGE_SIZE) {
    return false;
  }
  
  try {
    // Predict the content of the image
    const predictions = await model.classify(imageElement);
    
    // Check if any NSFW categories exceed our threshold
    const nsfwCategories = predictions.filter(
      prediction => 
        (prediction.className === 'Porn' || prediction.className === 'Sexy') && 
        prediction.probability > NSFW_THRESHOLD
    );
    
    return nsfwCategories.length > 0;
  } catch (error) {
    console.error('Error classifying image:', error);
    return false;
  }
}

/**
 * Apply a blur filter to an image
 * @param imageElement The image element to blur
 */
export function blurNsfwImage(imageElement: HTMLImageElement): void {
  // Add blur class to image
  imageElement.classList.add('blur-overlay');
  
  // Create and add warning overlay
  const overlay = document.createElement('div');
  overlay.className = 'nsfw-warning';
  overlay.textContent = 'Potentially explicit content blurred';
  
  // Style the overlay
  overlay.style.position = 'absolute';
  overlay.style.top = '50%';
  overlay.style.left = '50%';
  overlay.style.transform = 'translate(-50%, -50%)';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.color = 'white';
  overlay.style.padding = '4px 8px';
  overlay.style.borderRadius = '4px';
  overlay.style.fontSize = '12px';
  overlay.style.pointerEvents = 'none';
  
  // Create a positioned wrapper if the image isn't already in one
  const parent = imageElement.parentElement;
  if (parent) {
    if (window.getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    parent.appendChild(overlay);
  }
}

/**
 * Scan all images on a page and blur any NSFW content
 */
export async function scanAndBlurImages(): Promise<void> {
  // Make sure the model is loaded
  if (!model) {
    await initNsfwModel();
  }
  
  // Get all images on the page
  const images = document.querySelectorAll('img');
  
  // Process each image
  for (const img of images) {
    // Only process images that are loaded and visible
    if (img.complete && img.naturalWidth > 0 && isImageVisible(img)) {
      // Check if the image is NSFW
      const nsfw = await isImageNsfw(img);
      
      // Blur the image if it's NSFW
      if (nsfw) {
        blurNsfwImage(img);
      }
    }
  }
}

/**
 * Check if an image is visible on the page
 * @param img The image element to check
 * @returns Boolean indicating if the image is visible
 */
function isImageVisible(img: HTMLImageElement): boolean {
  const rect = img.getBoundingClientRect();
  return (
    rect.top <= window.innerHeight &&
    rect.bottom >= 0 &&
    rect.left <= window.innerWidth &&
    rect.right >= 0 &&
    window.getComputedStyle(img).display !== 'none'
  );
}

// Initialize the model when the module is loaded
initNsfwModel();
