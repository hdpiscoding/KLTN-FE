import { useUserStore } from "@/store/userStore";
import axios from "axios";

const API_URL = "https://kltn-api-staging.sonata.io.vn/api/v1/location/ping";

export const sendLocationToBackend = async (lat: number, lon: number) => {
  try {
    const token = useUserStore.getState().token;

    if (!token) {
      console.warn("⚠️ No access token found. Cannot send location.");
      return;
    }

    // 2. Gửi request
    const response = await axios.post(
      API_URL,
      {
        latitude: lat,
        longitude: lon,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Location sent successfully:", response.data);
  } catch (error) {
    console.error("❌ Failed to send location:", error);
  }
};
