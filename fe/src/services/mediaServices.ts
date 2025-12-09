import {instance} from "@/config/axiosConfig.ts";

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post("media/upload-image", formData);
    return response.data;
}