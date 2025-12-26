import axios from "axios";

export const login = async (email: string, password: string) => {
    const response = await axios.post("https://kltn-api-staging.sonata.io.vn/api/v1/user/login", {email, password});
    return response.data;
}

export const register = async (data: {email: string, password: string, fullName: string, phoneNumber: string}) => {
    const response = await axios.post("https://kltn-api-staging.sonata.io.vn/api/v1/user/register", data);
    return response.data;
}

export const verifyEmail = async (email: string, otp: string) => {
    const response = await axios.post("https://kltn-api-staging.sonata.io.vn/api/v1/user/register/verify-email", {email, otp});
    return response.data;
}

export const forgotPassword = async (email: string) => {
    const response = await axios.post(`https://kltn-api-staging.sonata.io.vn/api/v1/user/forgot-password/${email}`);
    return response.data;
}

export const resetPassword = async (data: {otp: string, newPassword: string, email: string}) => {
    const response = await axios.post(`https://kltn-api-staging.sonata.io.vn/api/v1/user/forgot-password/verify`, data);
    return response.data;
}