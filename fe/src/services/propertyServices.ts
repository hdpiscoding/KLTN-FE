import {instance} from "@/config/axiosConfig.ts";
import type {PropertyListing} from "@/types/property-listing";

interface FilterParams {
    key: string;
    operator: string;
    value: string;
}

interface SortParams {
    key: string;
    type: string;
}

export const searchProperties = async (query: {
    filters?: FilterParams[],
    sorts?: SortParams[],
    rpp: number,
    page: number
}) => {
    const response = await instance.post("properties/search", {
        filters: query.filters,
        sorts: query.sorts,
        rpp: query.rpp,
        page: query.page
    });
    return response.data;
}

export const getPropertiesWithinViewPort = async (minLat: number, minLng: number, maxLat: number, maxLng: number) => {
    const response = await instance.get(`properties/search/map?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`);
    return response.data;
}

export const getPropertyDetails = async (id: string) => {
    const response = await instance.get(`properties/${id}`);
    return response.data;
}

export const createPropertyListing = async (data: PropertyListing) => {
    const response = await instance.post("properties", data);
    return response.data;
}

export const updatePropertyListing = async (id: number, data: PropertyListing) => {
    const response = await instance.put(`properties/${id}`, data);
    return response.data;
}

export const deletePropertyListing = async (id: number) => {
    const response = await instance.delete(`properties/${id}`);
    return response.data;
}

export const predictPropertyPrice = async (data: {
    latitude: number,
    longitude: number,
    address_district: string,
    area: number,
    property_type: string,
    num_bedrooms?: number,
    num_bathrooms?: number,
    num_floors?: number,
    facade_width_m?: number,
    road_width_m?: number,
    legal_status?: string,
    house_direction?: string,
    balcony_direction?: string,
    furniture_status?: string,
})=> {
    const response = await instance.post("recommendation/prediction/property/price", data);
    return response.data;
}

export const getRecommendedProperties = async (lat: number, lng: number, limit: number = 8, radius_km: number = 20, user_id?: number) => {
    let response;
    if (user_id) {
        response = await instance.get(`recommendation/home?lat=${lat}&lng=${lng}&limit=${limit}&radius_km=${radius_km}&user_id=${user_id}`);
    }
    else {
        response = await instance.get(`recommendation/home?lat=${lat}&lng=${lng}&limit=${limit}&radius_km=${radius_km}`);
    };
    return response.data;
}

export const getLivabilityScore = async (data: {propertyIds: number[]}) => {
    const response = await instance.post("recommendation/livability/scores/batch", data);
    return response.data;
}