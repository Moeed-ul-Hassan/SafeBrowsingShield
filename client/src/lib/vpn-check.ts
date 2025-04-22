// Interface for the response from ipapi.co
interface IpapiResponse {
  ip: string;
  version: string;
  city: string;
  region: string;
  country: string;
  country_name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  security: {
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
  };
}

/**
 * Check if the user is using a VPN or proxy
 * Uses ipapi.co API to detect VPN/proxy usage
 * @returns Promise with boolean indicating if VPN/proxy is detected
 */
export async function detectVpn(): Promise<boolean> {
  try {
    // Get the API key from environment variables
    const apiKey = import.meta.env.VITE_IPAPI_KEY || process.env.VITE_IPAPI_KEY || "";
    
    // Make the API request
    const response = await fetch(`https://ipapi.co/json/?key=${apiKey}`);
    
    if (!response.ok) {
      console.error('VPN detection API error:', response.statusText);
      return false;
    }
    
    const data: IpapiResponse = await response.json();
    
    // Check if VPN, proxy, or Tor is detected
    return Boolean(data.security?.vpn || data.security?.proxy || data.security?.tor);
  } catch (error) {
    console.error('Error checking VPN status:', error);
    return false;
  }
}

/**
 * Alternative method to check for VPN by comparing timezone with geolocation
 * This is a simpler fallback if the API is unavailable
 * @returns Promise with boolean indicating if VPN might be in use
 */
export async function detectVpnByTimezone(): Promise<boolean> {
  try {
    // Get browser timezone offset in minutes
    const timezoneOffset = new Date().getTimezoneOffset();
    
    // Get the user's geolocation
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    
    // Use a reverse geocoding service to get the expected timezone for this location
    const { latitude, longitude } = position.coords;
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=YOUR_GEOAPIFY_API_KEY`
    );
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    const locationTimezone = data.features[0]?.properties?.timezone;
    
    if (!locationTimezone) {
      return false;
    }
    
    // Get the expected timezone offset
    const expectedOffset = getTimezoneOffset(locationTimezone);
    
    // If the timezone offsets differ significantly, it might indicate VPN usage
    return Math.abs(timezoneOffset - expectedOffset) > 60; // More than 1 hour difference
  } catch (error) {
    console.error('Error in VPN timezone check:', error);
    return false;
  }
}

/**
 * Get timezone offset in minutes for a given timezone name
 * @param timezone The timezone name
 * @returns The timezone offset in minutes
 */
function getTimezoneOffset(timezone: string): number {
  const date = new Date();
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return (utcDate.getTime() - tzDate.getTime()) / 60000;
}
