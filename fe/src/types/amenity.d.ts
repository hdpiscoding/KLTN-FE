/**
 * Amenity/POI types and interfaces
 */

export type AmenityCategory =
  | "healthcare"
  | "education"
  | "transportation"
  | "environment"
  | "public_safety"
  | "shopping"
  | "entertainment";

export interface Amenity {
  id: number;
  name: string | null;
  category: AmenityCategory;
  amenity_type: string | null;
  latitude: number;
  longitude: number;
  vicinity: string;
  google_rating: number | null;
  google_user_ratings_total: number | null;
  google_types: string;
  google_place_id: string;
  district: string;
  all_tags: string | null;
}

export interface AmenityFilterState {
  healthcare: boolean;
  education: boolean;
  transportation: boolean;
  environment: boolean;
  public_safety: boolean;
  shopping: boolean;
  entertainment: boolean;
}

export type SpecialIndicatorType = "flood" | "accident" | "project" | null;

export interface NewsArticle {
  id: number;
  title: string;
  url: string;
  summary: string;
  topic: "FLOOD" | "ACCIDENT" | "PROJECT";
  impact_score: number;
  sentiment: string;
  published_date: string;
}

export interface DistrictStats {
  flood_score: number;
  accident_score: number;
  project_score: number;
  total_news: number;
}

export interface DistrictNewsData {
  district_id: number;
  district_name: string;
  boundary_wkt: string | null; // Well-Known Text format for polygon
  stats: DistrictStats;
  articles: NewsArticle[];
}
