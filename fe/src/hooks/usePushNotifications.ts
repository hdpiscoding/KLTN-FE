/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { saveFCMTokenToBackend } from "../services/notificationApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const usePushNotifications = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Chỉ chạy trên thiết bị thật (Android/iOS)
    if (!Capacitor.isNativePlatform()) return;

    const initFCM = async () => {
      try {
        // 1. Xin quyền thông báo
        const result = await FirebaseMessaging.requestPermissions();

        if (result.receive === "granted") {
          // 2. Lấy FCM Token hiện tại
          const { token } = await FirebaseMessaging.getToken();
          if (token) {
            // Gửi lên server
            await saveFCMTokenToBackend(token);
          }
        } else {
          console.warn("User từ chối quyền nhận thông báo");
        }

        // 3. Lắng nghe sự kiện Token thay đổi (refresh)
        await FirebaseMessaging.removeAllListeners();

        await FirebaseMessaging.addListener("tokenReceived", async (event) => {
          console.log("New FCM Token received");
          await saveFCMTokenToBackend(event.token);
        });

        // 4. Lắng nghe thông báo khi App đang mở (Foreground)
        await FirebaseMessaging.addListener("notificationReceived", (event) => {
          console.log("Push received:", event);
          // Hiển thị Toast hoặc Popup nhỏ
          toast.info(
            `🔔 ${event.notification.title}: ${event.notification.body}`
          );
        });

        // 5. Lắng nghe khi user BẤM vào thông báo (Background/Terminated)
        await FirebaseMessaging.addListener(
          "notificationActionPerformed",
          (event) => {
            console.log("Push action:", event);
            const data = event.notification.data;

            // Logic điều hướng dựa trên data gửi từ Backend Golang
            // Backend gửi: "type": "NEARBY_ALERT", "property_id": "123"
            if (data && (data as unknown as any).property_id) {
              // Điều hướng đến trang chi tiết BĐS
              navigate(`/bat-dong-san/${(data as unknown as any).property_id}`);
            }
          }
        );
      } catch (error) {
        console.error("FCM Init Error:", error);
      }
    };

    initFCM();
  }, [navigate]); // Thêm dependencies nếu cần
};
