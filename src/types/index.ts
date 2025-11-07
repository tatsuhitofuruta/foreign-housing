// Property Types
export type PropertyType = 'apartment' | 'house' | 'condo' | 'studio';

export interface Property {
  id: string;
  title: string;
  title_ja: string;
  description: string;
  description_ja: string;
  price: number;
  currency: string;
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  year_built: number;
  address: string;
  latitude: number;
  longitude: number;
  prefecture: string;
  city: string;
  ward: string;
  station_nearest: string;
  station_walk_minutes: number;
  images: string[];
  amenities: string[];
  created_at: string;
  updated_at: string;
  average_rating?: number;
  review_count?: number;
}

// Review Types
export interface Review {
  id: string;
  property_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating_overall: number;
  rating_location: number;
  rating_facilities: number;
  rating_management: number;
  rating_value: number;
  title: string;
  comment: string;
  images: string[];
  helpful_count: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewFormData {
  rating_overall: number;
  rating_location: number;
  rating_facilities: number;
  rating_management: number;
  rating_value: number;
  title: string;
  comment: string;
  images?: File[];
}

// User Types
export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  locale: string;
  created_at: string;
}

// Favorite Types
export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

// Search & Filter Types
export interface SearchFilters {
  query?: string;
  property_type?: PropertyType[];
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  min_area?: number;
  max_area?: number;
  prefecture?: string;
  city?: string;
  station?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

export interface SearchResult {
  properties: Property[];
  total: number;
  page: number;
  page_size: number;
}

// UI Component Types
export interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
}

export interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  isHelpful?: boolean;
}
