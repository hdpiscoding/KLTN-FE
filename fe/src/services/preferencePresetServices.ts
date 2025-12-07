import {instance} from "@/config/axiosConfig.ts";

export const getAllPreferencePresets = async () => {
    const response = await instance.get("user/preference-presets");
    return response.data;
}
