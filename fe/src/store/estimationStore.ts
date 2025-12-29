import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EstimationState {
    latitude: number;
    longitude: number;
    area: number;
    propertyType: string;
    address_district: string;
    legal_status?: string;
    house_direction?: string;
    balcony_direction?: string;
    furniture_status?: string;
    num_bedrooms?: number;
    num_bathrooms?: number;
    num_floors?: number;
    facade_width_m?: number;
    road_width_m?: number;
    fullAddress?: string;
    setEstimationData: (data: Partial<EstimationState>) => void;
    clearEstimationData: () => void;
}

export const useEstimationStore = create<EstimationState>()(
    persist(
        (set) => ({
            latitude: 0,
            longitude: 0,
            area: 0,
            propertyType: "",
            address_district: "",
            fullAddress: "",
            setEstimationData: (data) => set((state) => ({ ...state, ...data })),
            clearEstimationData: () => set({
                latitude: 0,
                longitude: 0,
                area: 0,
                propertyType: "",
                address_district: "",
                fullAddress: "",
                legal_status: undefined,
                house_direction: undefined,
                balcony_direction: undefined,
                furniture_status: undefined,
                num_bedrooms: undefined,
                num_bathrooms: undefined,
                num_floors: undefined,
                facade_width_m: undefined,
                road_width_m: undefined,
            }),
        }),
        {
            name: "estimation-store",
        }
    )
);
