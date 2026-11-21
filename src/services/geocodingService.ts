import { PlaceRecommendation, PlaceCategory } from '../types/map';

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
}

/**
 * Validates that latitude and longitude are valid finite numbers within geographical bounds
 */
export function isValidCoordinate(lat: unknown, lng: unknown): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

// Destination coordinates lookup with fallback
const KNOWN_DESTINATIONS: Record<string, { lat: number; lng: number }> = {
  'goa': { lat: 15.2993, lng: 74.1240 },
  'goa, india': { lat: 15.2993, lng: 74.1240 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'paris, france': { lat: 48.8566, lng: 2.3522 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'tokyo, japan': { lat: 35.6762, lng: 139.6503 },
  'manali': { lat: 32.2396, lng: 77.1887 },
  'manali, india': { lat: 32.2396, lng: 77.1887 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'london, uk': { lat: 51.5074, lng: -0.1278 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'new york, usa': { lat: 40.7128, lng: -74.0060 },
  'bali': { lat: -8.3405, lng: 115.0920 },
  'bali, indonesia': { lat: -8.3405, lng: 115.0920 },
  'rome': { lat: 41.9028, lng: 12.4964 },
  'rome, italy': { lat: 41.9028, lng: 12.4964 },
  'barcelona': { lat: 41.3879, lng: 2.1699 },
  'barcelona, spain': { lat: 41.3879, lng: 2.1699 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'amsterdam': { lat: 52.3676, lng: 4.9041 },
  'bangkok': { lat: 13.7563, lng: 100.5018 },
  'singapore': { lat: 1.3521, lng: 103.8198 },
};

/**
 * Resolves free-form destination strings into geographic coordinates (latitude, longitude).
 * 
 * Pipeline:
 * 1. O(1) instantaneous lookup against common pre-indexed world destinations.
 * 2. Asynchronous forward geocoding against OpenStreetMap Nominatim with an AbortController
 *    5000ms safety deadline to prevent hung requests on slow connections.
 * 3. Graceful offline fallback to default coordinates if unresolvable.
 *
 * @param query - City, region, or landmark query string
 * @returns GeocodingResult containing coordinates and canonical display name
 */
export async function geocodeDestination(query: string): Promise<GeocodingResult> {
  const normalized = (query || '').trim().toLowerCase();

  // Instant match for common spots
  for (const [key, coords] of Object.entries(KNOWN_DESTINATIONS)) {
    if (normalized.includes(key)) {
      return {
        lat: coords.lat,
        lng: coords.lng,
        displayName: query,
      };
    }
  }

  if (normalized.length >= 2) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        {
          headers: { 'User-Agent': 'Contrey-TravelApp/1.0' },
          signal: controller.signal,
        }
      );
      if (!res.ok) throw new Error(`Geocoding HTTP error: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const parsedLat = parseFloat(data[0].lat);
        const parsedLng = parseFloat(data[0].lon);

        if (isValidCoordinate(parsedLat, parsedLng)) {
          return {
            lat: parsedLat,
            lng: parsedLng,
            displayName: data[0].display_name || query,
          };
        }
      }
    } catch (err: unknown) {
      const isAbort = err instanceof Error && err.name === 'AbortError';
      if (isAbort) {
        console.warn('Nominatim geocoding timed out after 5000ms. Falling back.');
      } else {
        console.warn('Nominatim geocoding failed, using destination fallback', err);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Resilient fallback (Goa coords default)
  return {
    lat: 15.2993,
    lng: 74.1240,
    displayName: query || 'Goa, India',
  };
}

/**
 * Calculate distance in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2)) {
    return 0;
  }
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

/**
 * Curated realistic recommendations for travel destinations worldwide
 */
export function getCuratedRecommendations(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  destinationName: string
): PlaceRecommendation[] {
  const safeLat = isValidCoordinate(centerLat, centerLng) ? centerLat : 15.2993;
  const safeLng = isValidCoordinate(centerLat, centerLng) ? centerLng : 74.1240;
  const safeRadius = Math.max(0.5, Math.min(50, radiusKm || 2));

  const destLower = (destinationName || '').toLowerCase();
  const isParis = destLower.includes('paris');
  const isManali = destLower.includes('manali');
  const isTokyo = destLower.includes('tokyo');
  const isLondon = destLower.includes('london');
  const isBali = destLower.includes('bali');
  const isNewYork = destLower.includes('new york') || destLower.includes('nyc');

  let baseList: Array<{
    name: string;
    category: PlaceCategory;
    offsetLat: number;
    offsetLng: number;
    rating: number;
    priceLevel: 1 | 2 | 3 | 4;
    estimatedPriceEUR: number;
    reviewSnippet: string;
  }> = [];

  if (isParis) {
    baseList = [
      { name: 'Hotel Louvre Montana', category: 'hotel', offsetLat: 0.003, offsetLng: 0.002, rating: 4.7, priceLevel: 3, estimatedPriceEUR: 160, reviewSnippet: 'Prime location near Tuileries Garden, boutique Parisian decor' },
      { name: 'Le Petit Châtelet Bistro', category: 'restaurant', offsetLat: -0.002, offsetLng: 0.003, rating: 4.8, priceLevel: 2, estimatedPriceEUR: 28, reviewSnippet: 'Delicious duck confit, warm fireplace ambience, outstanding value' },
      { name: 'Galeries Lafayette Boulevard', category: 'shopping', offsetLat: 0.006, offsetLng: 0.002, rating: 4.6, priceLevel: 3, estimatedPriceEUR: 55, reviewSnippet: 'Stunning glass dome architecture and luxury fashion boutiques' },
      { name: 'Sainte-Chapelle Stained Glass', category: 'attraction', offsetLat: -0.002, offsetLng: -0.002, rating: 4.9, priceLevel: 1, estimatedPriceEUR: 13, reviewSnippet: 'Breathtaking 13th-century gothic stained glass windows' },
      { name: 'Café Saint-Régis Île Saint-Louis', category: 'restaurant', offsetLat: -0.003, offsetLng: 0.005, rating: 4.5, priceLevel: 2, estimatedPriceEUR: 22, reviewSnippet: 'Classic croissants and café crème overlooking the Seine river' },
      { name: 'Shakespeare and Company Bookstore', category: 'shopping', offsetLat: -0.004, offsetLng: 0.002, rating: 4.8, priceLevel: 1, estimatedPriceEUR: 15, reviewSnippet: 'Iconic literary landmark with vintage books and historic charm' },
    ];
  } else if (isTokyo) {
    baseList = [
      { name: 'Shibuya Stream Hotel & Lounge', category: 'hotel', offsetLat: 0.003, offsetLng: 0.002, rating: 4.8, priceLevel: 3, estimatedPriceEUR: 145, reviewSnippet: 'Direct sky bridge to Shibuya Station, ultra-modern minimalist suites' },
      { name: 'Ramen Nagi Golden Gai', category: 'restaurant', offsetLat: -0.002, offsetLng: 0.003, rating: 4.9, priceLevel: 1, estimatedPriceEUR: 10, reviewSnippet: 'Legendary rich niboshi sardine broth with hand-pulled noodles' },
      { name: 'Ginza Six Flagship Boutiques', category: 'shopping', offsetLat: 0.005, offsetLng: -0.003, rating: 4.7, priceLevel: 3, estimatedPriceEUR: 65, reviewSnippet: 'Architectural masterpiece rooftop garden and traditional tea salons' },
      { name: 'Meiji Jingu Forest Shrine', category: 'attraction', offsetLat: 0.004, offsetLng: -0.004, rating: 4.8, priceLevel: 1, estimatedPriceEUR: 0, reviewSnippet: 'Serene tranquil wooden torii gates surrounded by 100,000 evergreen trees' },
      { name: 'Tsukiji Outer Market Seafood Stalls', category: 'restaurant', offsetLat: -0.004, offsetLng: 0.004, rating: 4.7, priceLevel: 2, estimatedPriceEUR: 22, reviewSnippet: 'Fresh melt-in-mouth otoro tuna sashimi and grilled scallop skewers' },
      { name: 'Akihabara Electric Town', category: 'shopping', offsetLat: 0.006, offsetLng: 0.005, rating: 4.6, priceLevel: 2, estimatedPriceEUR: 30, reviewSnippet: 'Vibrant neon electronic shops, vintage collectibles, and game cafes' },
    ];
  } else if (isLondon) {
    baseList = [
      { name: 'The Hoxton Holborn Suites', category: 'hotel', offsetLat: 0.003, offsetLng: 0.002, rating: 4.7, priceLevel: 3, estimatedPriceEUR: 150, reviewSnippet: 'Trendy industrial brick interior, craft coffee lobby, vibrant Covent Garden vibe' },
      { name: 'Dishoom Covent Garden', category: 'restaurant', offsetLat: -0.002, offsetLng: 0.003, rating: 4.9, priceLevel: 2, estimatedPriceEUR: 25, reviewSnippet: 'Irresistible house black daal, spiced chai, and Bombay cafe atmosphere' },
      { name: 'Borough Market Artisan Food Stalls', category: 'shopping', offsetLat: -0.004, offsetLng: 0.004, rating: 4.8, priceLevel: 2, estimatedPriceEUR: 18, reviewSnippet: 'Gourmet cheeses, hot truffled toasties, and fresh baked pastries' },
      { name: 'Sky Garden 360 Observation Walk', category: 'attraction', offsetLat: 0.003, offsetLng: 0.005, rating: 4.8, priceLevel: 1, estimatedPriceEUR: 0, reviewSnippet: 'Stunning free panoramic London skyline views through lush glass conservatory' },
      { name: 'Neal’s Yard Colourful Courtyard Café', category: 'restaurant', offsetLat: -0.002, offsetLng: -0.002, rating: 4.6, priceLevel: 2, estimatedPriceEUR: 16, reviewSnippet: 'Hidden colourful alley with organic salads and artisanal woodfired sourdough' },
      { name: 'Camden Lock Vintage Market', category: 'shopping', offsetLat: 0.007, offsetLng: -0.003, rating: 4.5, priceLevel: 1, estimatedPriceEUR: 20, reviewSnippet: 'Eclectic canal-side stalls with bohemian apparel and street street food' },
    ];
  } else if (isBali) {
    baseList = [
      { name: 'Ubud Hanging Rainforest Villas', category: 'hotel', offsetLat: 0.003, offsetLng: 0.003, rating: 4.9, priceLevel: 3, estimatedPriceEUR: 130, reviewSnippet: 'Private infinity plunge pool cantilevered over lush tropical jungle valley' },
      { name: 'Warung Babi Guling Ibu Oka', category: 'restaurant', offsetLat: -0.002, offsetLng: 0.002, rating: 4.7, priceLevel: 1, estimatedPriceEUR: 8, reviewSnippet: 'World-famous authentic Balinese roasted suckling pork with spiced crackling' },
      { name: 'Ubud Traditional Art Market', category: 'shopping', offsetLat: -0.002, offsetLng: -0.003, rating: 4.5, priceLevel: 1, estimatedPriceEUR: 12, reviewSnippet: 'Handwoven rattan bags, silk sarongs, and handcrafted wooden carvings' },
      { name: 'Tegallalang Stepped Rice Terraces', category: 'attraction', offsetLat: 0.006, offsetLng: 0.002, rating: 4.8, priceLevel: 1, estimatedPriceEUR: 3, reviewSnippet: 'Emerald green UNESCO subak irrigation terraces with epic canyon swings' },
      { name: 'Clear Cafe Organic Lotus Garden', category: 'restaurant', offsetLat: -0.003, offsetLng: 0.004, rating: 4.8, priceLevel: 2, estimatedPriceEUR: 14, reviewSnippet: 'Whimsical spiraling bamboo entrance, koi ponds, and dragonfruit smoothie bowls' },
      { name: 'Campuhan Sacred Ridge Walk', category: 'attraction', offsetLat: 0.005, offsetLng: -0.004, rating: 4.8, priceLevel: 1, estimatedPriceEUR: 0, reviewSnippet: 'Gentle panoramic hillcrest trek overlooking sweeping river ravines' },
    ];
  } else if (isNewYork) {
    baseList = [
      { name: 'The Standard High Line', category: 'hotel', offsetLat: 0.003, offsetLng: 0.002, rating: 4.7, priceLevel: 4, estimatedPriceEUR: 220, reviewSnippet: 'Floor-to-ceiling Hudson River views straddling the iconic elevated park' },
      { name: 'Katz’s Delicatessen', category: 'restaurant', offsetLat: -0.003, offsetLng: 0.003, rating: 4.8, priceLevel: 2, estimatedPriceEUR: 24, reviewSnippet: 'Legendary towering pastrami on rye sandwich and nostalgic Lower East Side vibe' },
      { name: 'Chelsea Market Food Hall & Artisan Stalls', category: 'shopping', offsetLat: 0.002, offsetLng: -0.003, rating: 4.7, priceLevel: 2, estimatedPriceEUR: 30, reviewSnippet: 'Concourse of gourmet eateries, artisanal chocolate makers, and indie vendors' },
      { name: 'The High Line Public Park Walk', category: 'attraction', offsetLat: 0.005, offsetLng: -0.002, rating: 4.8, priceLevel: 1, estimatedPriceEUR: 0, reviewSnippet: 'Beautiful elevated railway transformed into scenic greenway with art installations' },
      { name: 'Joe’s Pizza Greenwich Village', category: 'restaurant', offsetLat: -0.002, offsetLng: -0.002, rating: 4.9, priceLevel: 1, estimatedPriceEUR: 8, reviewSnippet: 'Quintessential thin-crust New York slice with sweet tomato sauce and crisp base' },
      { name: 'SoHo Cast Iron Boutiques', category: 'shopping', offsetLat: -0.005, offsetLng: 0.004, rating: 4.6, priceLevel: 3, estimatedPriceEUR: 60, reviewSnippet: 'Cobblestone streets with designer flagships and loft-style fashion galleries' },
    ];
  } else if (isManali) {
    baseList = [
      { name: 'Solang Valley Alpine Resort', category: 'hotel', offsetLat: 0.004, offsetLng: 0.003, rating: 4.6, priceLevel: 2, estimatedPriceEUR: 65, reviewSnippet: 'Panoramic snow mountain views, cozy cedar wood cottages' },
      { name: 'The Lazy Dog Lounge Old Manali', category: 'restaurant', offsetLat: -0.002, offsetLng: 0.003, rating: 4.7, priceLevel: 1, estimatedPriceEUR: 14, reviewSnippet: 'Riverside wooden terrace, trout specialities, live acoustic music' },
      { name: 'Mall Road Tibetan Handicrafts', category: 'shopping', offsetLat: 0.002, offsetLng: -0.003, rating: 4.4, priceLevel: 1, estimatedPriceEUR: 20, reviewSnippet: 'Authentic hand-woven Kullu shawls, wooden artifacts, and dry fruits' },
      { name: 'Hadimba Ancient Cedar Temple', category: 'attraction', offsetLat: 0.004, offsetLng: -0.004, rating: 4.8, priceLevel: 1, estimatedPriceEUR: 4, reviewSnippet: 'Historic pagoda-style wooden temple surrounded by giant deodar forests' },
      { name: 'Drifters’ Café & Bakery', category: 'restaurant', offsetLat: 0.002, offsetLng: 0.005, rating: 4.8, priceLevel: 1, estimatedPriceEUR: 9, reviewSnippet: 'Best apple crumble and woodfired artisan pizzas in Old Manali' },
      { name: 'Jogini Waterfall Trek', category: 'attraction', offsetLat: 0.007, offsetLng: 0.002, rating: 4.9, priceLevel: 1, estimatedPriceEUR: 0, reviewSnippet: 'Spectacular mountain cascade hike passing pine glades and streams' },
    ];
  } else if (destLower.includes('goa')) {
    baseList = [
      { name: 'Heritage Taj Beach Resort & Spa', category: 'hotel', offsetLat: 0.004, offsetLng: 0.003, rating: 4.8, priceLevel: 3, estimatedPriceEUR: 140, reviewSnippet: 'Direct private beach access, infinity pool, luxury villa architecture' },
      { name: 'Curlies Sunset Beach Shack', category: 'restaurant', offsetLat: -0.003, offsetLng: -0.003, rating: 4.6, priceLevel: 2, estimatedPriceEUR: 18, reviewSnippet: 'Famous Goan fish curry, chill trance beats, stunning sunset views' },
      { name: 'Anjuna Wednesday Flea Market', category: 'shopping', offsetLat: 0.004, offsetLng: -0.002, rating: 4.5, priceLevel: 1, estimatedPriceEUR: 25, reviewSnippet: 'Vibrant beach market with boho clothing, handmade leather, and jewelry' },
      { name: 'Chapora Portuguese Hilltop Fort', category: 'attraction', offsetLat: 0.006, offsetLng: 0.002, rating: 4.7, priceLevel: 1, estimatedPriceEUR: 2, reviewSnippet: 'Dramatic cliffside ocean panoramas and historical Portuguese ramparts' },
      { name: 'Gunpowder South Indian Kitchen', category: 'restaurant', offsetLat: 0.002, offsetLng: 0.004, rating: 4.9, priceLevel: 2, estimatedPriceEUR: 20, reviewSnippet: 'Sensational Kerala beef fry, flaky appams, charming courtyard dining' },
      { name: 'Baga Water Sports & Parasailing Bay', category: 'attraction', offsetLat: -0.004, offsetLng: 0.003, rating: 4.5, priceLevel: 2, estimatedPriceEUR: 30, reviewSnippet: 'Jet ski, bumper rides, and high-altitude parasailing with safety gears' },
      { name: 'Artjuna Garden Café & Lifestyle Shop', category: 'shopping', offsetLat: 0.002, offsetLng: -0.004, rating: 4.8, priceLevel: 2, estimatedPriceEUR: 15, reviewSnippet: 'Organic Mediterranean breakfasts, artisan clothing, and open-air library' },
      { name: 'Agonda Eco Palm Bungalows', category: 'hotel', offsetLat: -0.006, offsetLng: 0.005, rating: 4.7, priceLevel: 2, estimatedPriceEUR: 55, reviewSnippet: 'Seaside wooden huts, peaceful uncrowded sand, and ocean breezes' },
    ];
  } else {
    // Dynamic city generator for any global city searched
    const cleanName = destinationName.split(',')[0].trim() || 'Destination';
    baseList = [
      { name: `${cleanName} Grand Heritage Hotel & Suites`, category: 'hotel', offsetLat: 0.003, offsetLng: 0.002, rating: 4.8, priceLevel: 3, estimatedPriceEUR: 135, reviewSnippet: 'Central luxury accommodation with panoramic city rooftop terrace' },
      { name: `Old Town ${cleanName} Artisan Bistro`, category: 'restaurant', offsetLat: -0.002, offsetLng: 0.003, rating: 4.9, priceLevel: 2, estimatedPriceEUR: 24, reviewSnippet: 'Locally sourced regional delicacies with curated sommelier pairings' },
      { name: `${cleanName} Central Market & Fashion Boutiques`, category: 'shopping', offsetLat: 0.004, offsetLng: -0.003, rating: 4.6, priceLevel: 2, estimatedPriceEUR: 35, reviewSnippet: 'Historic market hall packed with authentic handicrafts, spices, and clothing' },
      { name: `${cleanName} Historic Observation Lookout`, category: 'attraction', offsetLat: -0.003, offsetLng: -0.003, rating: 4.8, priceLevel: 1, estimatedPriceEUR: 8, reviewSnippet: 'Unrivaled 360-degree scenic skyline vistas and architectural heritage' },
      { name: `Riverside Promenade Café at ${cleanName}`, category: 'restaurant', offsetLat: 0.002, offsetLng: 0.005, rating: 4.7, priceLevel: 2, estimatedPriceEUR: 18, reviewSnippet: 'Fresh roasted coffee, outdoor patio seating, and artisan breakfast pastries' },
      { name: `${cleanName} Cultural Museum & Sculpture Park`, category: 'attraction', offsetLat: 0.006, offsetLng: 0.002, rating: 4.8, priceLevel: 1, estimatedPriceEUR: 12, reviewSnippet: 'World-renowned art exhibitions and tranquil outdoor botanical gardens' },
      { name: `The Artisan Quarter & Vintage Alley`, category: 'shopping', offsetLat: -0.004, offsetLng: 0.004, rating: 4.7, priceLevel: 1, estimatedPriceEUR: 22, reviewSnippet: 'Charming cobblestone alley lined with independent makers and jewelers' },
      { name: `${cleanName} Boutique Eco Haven`, category: 'hotel', offsetLat: -0.005, offsetLng: -0.004, rating: 4.7, priceLevel: 2, estimatedPriceEUR: 75, reviewSnippet: 'Peaceful garden courtyard, organic dining, and modern sustainable comfort' },
    ];
  }

  // Generate recommendation items with calculated distance
  const places: PlaceRecommendation[] = baseList.map((item, idx) => {
    const lat = safeLat + item.offsetLat;
    const lng = safeLng + item.offsetLng;
    const distanceKm = calculateDistanceKm(safeLat, safeLng, lat, lng);
    const isBestValue = item.rating >= 4.7 && item.priceLevel <= 2;

    return {
      id: `poi_${idx}_${item.category}`,
      name: item.name,
      category: item.category,
      lat,
      lng,
      rating: item.rating,
      priceLevel: item.priceLevel,
      estimatedPrice: item.estimatedPriceEUR,
      distanceKm,
      reviewSnippet: item.reviewSnippet,
      isBestValue,
    };
  });

  return places.filter((p) => p.distanceKm <= safeRadius);
}
