import { useState, useEffect, useRef } from "react";
import { registerPlugin } from "@capacitor/core";
import type { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { sendLocationToBackend } from "../services/trackingApi";
import { Capacitor } from "@capacitor/core";
import { toast } from "react-toastify"; // Giả sử bạn dùng toastify để thông báo

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  "BackgroundGeolocation"
);

export const useBackgroundLocation = () => {
  const [isTracking, setIsTracking] = useState(false);
  const watcherId = useRef<string | null>(null);

  // Hàm bắt đầu theo dõi
  const startTracking = async () => {
    // Chỉ chạy trên Mobile App (Native)
    if (!Capacitor.isNativePlatform()) {
      toast.warning("Tính năng này chỉ hoạt động trên Mobile App!");
      return;
    }

    try {
      // 1. Xin quyền (quan trọng trên Android 10+)
      // Lưu ý: Android có thể yêu cầu người dùng chọn "Allow all the time" trong settings thủ công
      // để chạy nền ổn định.

      // 2. Thêm Watcher
      watcherId.current = await BackgroundGeolocation.addWatcher(
        {
          // Cấu hình hiển thị Notification (bắt buộc để chạy nền không bị kill)
          backgroundMessage: "Đang tìm kiếm BĐS phù hợp gần bạn...",
          backgroundTitle: "Real Estate Tracker",
          requestPermissions: true,

          // Cấu hình tối ưu pin và dữ liệu
          stale: false,
          distanceFilter: 50, // Chỉ gửi khi di chuyển > 50m
        },
        (location, error) => {
          if (error) {
            if (error.code === "NOT_AUTHORIZED") {
              toast.error(
                "Vui lòng cấp quyền vị trí 'Luôn cho phép' để sử dụng."
              );
            }
            return;
          }

          if (location) {
            console.log(
              "📍 New Location:",
              location.latitude,
              location.longitude
            );
            // Gửi về Golang Backend
            sendLocationToBackend(location.latitude, location.longitude);
          }
        }
      );

      setIsTracking(true);
      toast.success("Đã bật theo dõi vị trí nền!");
    } catch (err) {
      console.error("Tracking Error:", err);
      toast.error("Không thể khởi động theo dõi vị trí.");
    }
  };

  // Hàm dừng theo dõi
  const stopTracking = async () => {
    if (watcherId.current) {
      await BackgroundGeolocation.removeWatcher({
        id: watcherId.current,
      });
      watcherId.current = null;
      setIsTracking(false);
      toast.info("Đã tắt theo dõi.");
    }
  };

  // Cleanup khi unmount component
  useEffect(() => {
    return () => {
      if (watcherId.current) {
        BackgroundGeolocation.removeWatcher({ id: watcherId.current });
      }
    };
  }, []);

  return { isTracking, startTracking, stopTracking };
};
