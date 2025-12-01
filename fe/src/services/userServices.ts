import {instance} from "@/config/axiosConfig.ts";

export const getMyProfile = async () => {
    const response = await instance.get("user/me");
    return response.data;
}

export const updateMyProfile = async (data: {
    fullName?: string;
    avatarUrl?: string;
    liveAddress?: string;
    preferenceSafety?: number;
    preferenceEducation?: number;
    preferenceShopping?: number;
    preferenceTransportation?: number;
    preferenceEnvironment?: number;
    preferenceEntertainment?: number;
    preferenceHealthcare?: number;
}) => {
    const response = await instance.put("user/update/me", {
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
        liveAddress: data.liveAddress,
        preferenceSafety: data.preferenceSafety,
        preferenceEducation: data.preferenceEducation,
        preferenceShopping: data.preferenceShopping,
        preferenceTransportation: data.preferenceTransportation,
        preferenceEnvironment: data.preferenceEnvironment,
        preferenceEntertainment: data.preferenceEntertainment,
        preferenceHealthcare: data.preferenceHealthcare
    });
    return response.data;
}

export const requestBecomeSeller = async () => {
    const response = await instance.post("user/request-seller-role");
    return response.data;
}