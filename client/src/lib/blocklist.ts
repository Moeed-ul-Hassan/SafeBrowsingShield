// A comprehensive list of adult domain keywords to block
// This is a partial list for demonstration purposes
export const adultDomainKeywords = [
  'porn',
  'xxx',
  'adult',
  'sex',
  'nude',
  'naked',
  'cam',
  'hot',
  'sexy',
  'escorts',
  'playboy',
  'playmate',
  'hustler',
  'penthouse',
  'adultfriendfinder',
  'amateur',
  'boobs',
  'nsfw',
  'xvideos',
  'pornhub',
  'xhamster',
  'xnxx',
  'redtube',
  'youporn',
  'brazzers',
  'onlyfans'
];

// Known adult domains to block
// This is a partial list for demonstration purposes
export const adultDomains = [
  'pornhub.com',
  'xvideos.com',
  'xnxx.com',
  'xhamster.com',
  'redtube.com',
  'youporn.com',
  'brazzers.com',
  'onlyfans.com',
  'adultfriendfinder.com',
  'livejasmin.com',
  'stripchat.com',
  'chaturbate.com',
  'cam4.com',
  'myfreecams.com',
  'bongacams.com'
];

/**
 * Check if a URL contains adult content based on keywords and known domains
 * @param url The URL to check
 * @returns Boolean indicating if the URL should be blocked
 */
export function shouldBlockUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    // Check if the domain is in our list of known adult domains
    if (adultDomains.some(adultDomain => domain === adultDomain || domain.endsWith(`.${adultDomain}`))) {
      return true;
    }
    
    // Check if the domain contains any of our keywords
    if (adultDomainKeywords.some(keyword => domain.includes(keyword))) {
      return true;
    }
    
    // Check if the path contains any of our keywords
    if (adultDomainKeywords.some(keyword => urlObj.pathname.toLowerCase().includes(keyword))) {
      return true;
    }
    
    return false;
  } catch (error) {
    // If URL parsing fails, check the raw string for keywords
    return adultDomainKeywords.some(keyword => url.toLowerCase().includes(keyword));
  }
}

/**
 * Check if text content contains adult keywords
 * @param text The text content to analyze
 * @returns Boolean indicating if the content should be blocked
 */
export function containsAdultContent(text: string): boolean {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  
  // Check for adult keywords in the text
  return adultDomainKeywords.some(keyword => lowerText.includes(keyword));
}
