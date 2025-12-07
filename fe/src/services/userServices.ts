import {instance} from "@/config/axiosConfig.ts";

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