import axios from "axios";
import { useUserStore } from "@/store/userStore";

// Thay đổi IP này thành IP máy tính của bạn (giống bên trackingApi)
const API_URL =
  "https://kltn-api-staging.sonata.io.vn/api/v1/location/user/fcm";

export const saveFCMTokenToBackend = async (fcmToken: string) => {
  try {
    const token = useUserStore.getState().token;

    if (!token) {
      console.warn("⚠️ Chưa đăng nhập, không thể lưu FCM Token.");
      return;
    }

    console.log(
      "🔄 Đang gửi FCM Token lên server...",
      fcmToken.substring(0, 10) + "..."
    );

    const response = await axios.post(
      API_URL,
      {
        token: fcmToken,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Đã lưu FCM Token thành công:", response.data);
  } catch (error) {
    console.error("❌ Lỗi khi lưu FCM Token:", error);
  }
};
