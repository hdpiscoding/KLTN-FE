import {instance} from "@/config/axiosConfig.ts";

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

export const createPropertyListing = async () => {}