import axios from "axios";


const instance = axios.create({
    baseURL: "https://api-emobeat.sonata.io.vn/api/v1/",
    timeout: 100000
});

// const getAccessToken = () => {
//     //
// }

instance.interceptors.request.use(
    (config) => {
        // config.headers["Authorization"] = getAccessToken();
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