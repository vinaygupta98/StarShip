import { Starship } from '../types';

const CREDITS_TO_AED_RATE = 10000;

/**
 * Convert credits to AED
 * 1 AED = 10,000 credits
 */
export const creditsToAED = (credits: string): number => {
  // Handle "unknown" or invalid cost values
  if (!credits || credits === 'unknown' || credits.trim() === '') {
    return 0;
  }
  const creditsNum = parseFloat(credits);
  if (isNaN(creditsNum) || creditsNum <= 0) {
    return 0;
  }
  return creditsNum / CREDITS_TO_AED_RATE;
};

/**
 * Format price in AED with 2 decimal places
 */
export const formatPrice = (credits: string): string => {
  const aed = creditsToAED(credits);
  return `${aed.toFixed(2)} AED`;
};

/**
 * Generate random image URL for starship
 */
export const getStarshipImageUrl = (starshipUrl: string): string => {
  // Extract ID from URL (e.g., "https://swapi.info/api/starships/9/" -> "9")
  const match = starshipUrl.match(/\/(\d+)\/?$/);
  const id = match ? match[1] : Math.random().toString(36).substring(7);
  return `https://picsum.photos/200/200?random=${id}`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Add image URL to starship if not present
 */
export const enrichStarship = (starship: Starship): Starship => {
  return {
    ...starship,
    image: starship.image || getStarshipImageUrl(starship.url),
  };
};
