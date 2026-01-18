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
    if (!Capacitor.isNativePlatform()) return;

    // 1. Định nghĩa Listener riêng biệt
    const addListeners = async () => {
      // XÓA DÒNG removeAllListeners() ĐI NHÉ! NÓ LÀ THỦ PHẠM.

      // Lắng nghe sự kiện CLICK vào thông báo
      await FirebaseMessaging.addListener(
        "notificationActionPerformed",
        (event) => {
          console.log("🔔 User clicked push notification:", event);
          const data = event.notification.data;

          // Kiểm tra kỹ data trước khi điều hướng
          if (data && (data as unknown as any).property_id) {
            console.log(
              "🚀 Navigating to property:",
              (data as unknown as any).property_id,
            );
            // Dùng setTimeout để đảm bảo Router đã sẵn sàng
            setTimeout(() => {
              navigate(`/bat-dong-san/${(data as unknown as any).property_id}`);
            }, 500);
          }
        },
      );

      // Lắng nghe thông báo khi App đang mở
      await FirebaseMessaging.addListener("notificationReceived", (event) => {
        console.log("🔔 Push received foreground:", event);
        toast.info(`🔔 ${event.notification.title}`);
      });

      // Lắng nghe Token thay đổi
      await FirebaseMessaging.addListener("tokenReceived", async (event) => {
        await saveFCMTokenToBackend(event.token);
      });
    };

    // 2. Hàm khởi tạo quyền và token
    const initFCM = async () => {
      try {
        await addListeners(); // Đăng ký lắng nghe NGAY LẬP TỨC

        const result = await FirebaseMessaging.requestPermissions();
        if (result.receive === "granted") {
          const { token } = await FirebaseMessaging.getToken();
          if (token) await saveFCMTokenToBackend(token);
        }
      } catch (error) {
        console.error("FCM Init Error:", error);
      }
    };

    initFCM();

    // Cleanup: Chỉ remove khi component unmount hẳn (ví dụ tắt app)
    return () => {
      FirebaseMessaging.removeAllListeners();
    };
  }, [navigate]);
};
