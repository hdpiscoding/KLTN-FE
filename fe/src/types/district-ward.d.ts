export type Ward = { id: string; name: string };

export interface DistrictWard {
    id: string;
    name: string;
    ward: Ward[];
}