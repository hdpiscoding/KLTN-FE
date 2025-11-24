import axios from 'axios';
import {HCMC_RADIUS, HCMC_LAT, HCMC_LNG} from "@/constants/mapConstants.ts";

export const placeAutocomplete = async (input: string, limit: number) => {
    const response = await axios.get(`https://rsapi.goong.io/Place/AutoComplete?api_key=${import.meta.env.VITE_GOONG_API_KEY}&input=${encodeURIComponent(input)}&location=${HCMC_LAT},${HCMC_LNG}&radius=${HCMC_RADIUS}&more_compound=true&limit=${limit}&more_compound=true`);
    return response.data;
}

export const getPlaceDetails = async (placeId: string) => {
    const response = await axios.get(`https://rsapi.goong.io/Place/Detail?api_key=${import.meta.env.VITE_GOONG_API_KEY}&place_id=${placeId}`);
    return response.data;
}