export interface PreferencePreset {
    id: string;
    name: string;
    image: string;
    description: string;
    preferenceSafety: number;
    preferenceHealthcare: number;
    preferenceEducation: number;
    preferenceShopping: number;
    preferenceTransportation: number;
    preferenceEnvironment: number;
    preferenceEntertainment: number;
}