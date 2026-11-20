export type PlaceCategory = 'hotel' | 'restaurant' | 'shopping' | 'attraction';

export interface PlaceRecommendation {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  rating: number;
  priceLevel: 1 | 2 | 3 | 4;
  estimatedPrice: number; // In EUR as base
  distanceKm: number;
  reviewSnippet: string;
  isBestValue?: boolean;
  address?: string;
}
