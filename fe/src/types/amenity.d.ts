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

