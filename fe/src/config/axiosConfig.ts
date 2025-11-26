import axios from "axios";
import {useUserStore} from "@/store/userStore.ts";


const instance = axios.create({
    baseURL: "https://kltn-api-staging.sonata.io.vn/api/v1/",
    timeout: 100000
});

const getAccessToken = () => {
    const token = useUserStore.getState().token;
    return token ? `Bearer ${token}` : "";
}

instance.interceptors.request.use(
    (config) => {
        config.headers["Authorization"] = getAccessToken();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.log("API error", error);
        return Promise.reject(error);
    }
);
export {instance};