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