export interface PreferencePreset {
    id: string;
    name: string;
    image: string;
    description: string;
    preferenceSecurity: number;
    preferenceHealthcare: number;
    preferenceEducation: number;
    preferenceAmenities: number;
    preferenceTransportation: number;
    preferenceEnvironment: number;
    preferenceEntertainment: number;
}