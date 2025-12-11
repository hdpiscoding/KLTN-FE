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

export const getMyProfile = async () => {
    const response = await instance.get("user/me");
    return response.data;
}

export const updateMyProfile = async (data: {
    fullName?: string;
    avatarUrl?: string;
    liveAddress?: string;
    preferencePresetId?: number | null;
    preferenceSafety?: number;
    preferenceEducation?: number;
    preferenceShopping?: number;
    preferenceTransportation?: number;
    preferenceEnvironment?: number;
    preferenceEntertainment?: number;
    preferenceHealthcare?: number;
}) => {
    const response = await instance.put("user/update/me", data);
    return response.data;
}

export const requestBecomeSeller = async () => {
    const response = await instance.post("user/request-seller-role");
    return response.data;
}

export const likeProperty = async (id: number) => {
    const response = await instance.post(`properties/favorites/${id}`);
    return response.data;
}

export const unlikeProperty = async (id: number) => {
    const response = await instance.delete(`properties/favorites/${id}`);
    return response.data;
}

export const checkLikeProperty = async (id: number) => {
    const response = await instance.get(`properties/favorites/${id}/check`);
    return response.data;
}

export const searchFavoriteProperties = async (data: {
    filters?: FilterParams[],
    sorts?: SortParams[],
    rpp: number,
    page: number
}) => {
    const response = await instance.post("properties/favorites/search", data);
    return response.data;
}