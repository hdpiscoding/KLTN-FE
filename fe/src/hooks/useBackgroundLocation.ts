import { useState, useEffect, useRef } from "react";
import { registerPlugin } from "@capacitor/core";
import type { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { sendLocationToBackend } from "../services/trackingApi";
import { Capacitor } from "@capacitor/core";
import { toast } from "react-toastify";

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  "BackgroundGeolocation"
);
const STORAGE_KEY = "is_location_tracking_enabled";

export const useBackgroundLocation = () => {
  // Khởi tạo state dựa trên localStorage
  const [isTracking, setIsTracking] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const watcherId = useRef<string | null>(null);

  // Hàm khởi tạo watcher (được tách ra để tái sử dụng)
  const initializeWatcher = async () => {
    try {
      const id = await BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: "Đang tìm kiếm BĐS phù hợp gần bạn...",
          backgroundTitle: "Real Estate Tracker",
          requestPermissions: true,
          stale: false,
          distanceFilter: 2, // Set 2 for debug purposes => set to 50 for production
        },
        (location, error) => {
          if (error) {
            if (error.code === "NOT_AUTHORIZED") {
              // Silent fail or toast once
              console.error("Location permission missing");
            }
            return;
          }
          if (location) {
            console.log(
              "📍 Location update:",
              location.latitude,
              location.longitude
            );
            sendLocationToBackend(location.latitude, location.longitude);
          }
        }
      );
      watcherId.current = id;
      return true;
    } catch (e) {
      console.error("Failed to add watcher:", e);
      return false;
    }
  };

  const startTracking = async () => {
    if (!Capacitor.isNativePlatform()) {
      toast.warning("Tính năng này chỉ hoạt động trên Mobile App!");
      return;
    }

    // Nếu đã có watcher rồi thì không tạo thêm
    if (watcherId.current) return;

    const success = await initializeWatcher();
    if (success) {
      setIsTracking(true);
      localStorage.setItem(STORAGE_KEY, "true"); // Lưu trạng thái
      toast.success("Đã bật theo dõi vị trí nền!");
    } else {
      toast.error("Không thể khởi động theo dõi vị trí.");
    }
  };

  const stopTracking = async () => {
    if (watcherId.current) {
      await BackgroundGeolocation.removeWatcher({
        id: watcherId.current,
      });
      watcherId.current = null;
    }
    // Dù remove watcher thành công hay không cũng reset state để UI đồng bộ
    setIsTracking(false);
    localStorage.removeItem(STORAGE_KEY); // Xóa trạng thái
    toast.info("Đã tắt theo dõi.");
  };

  // Effect: Tự động khôi phục watcher khi reload app hoặc mount lại component
  // nếu trước đó user đã bật
  useEffect(() => {
    const shouldBeTracking = localStorage.getItem(STORAGE_KEY) === "true";

    if (
      shouldBeTracking &&
      Capacitor.isNativePlatform() &&
      !watcherId.current
    ) {
      console.log("🔄 Restoring background tracking from storage...");
      initializeWatcher().then((success) => {
        if (success) {
          setIsTracking(true);
        } else {
          // Nếu khôi phục thất bại thì tắt luôn trong storage
          setIsTracking(false);
          localStorage.removeItem(STORAGE_KEY);
        }
      });
    }

    // Cleanup khi component unmount:
    // QUAN TRỌNG: Không remove watcher ở đây!
    // Nếu remove ở đây thì chuyển trang sẽ mất tracking.
    // Chúng ta muốn tracking chạy global cho đến khi user bấm tắt.
    return () => {
      // Do nothing on unmount
    };
  }, []);

  return { isTracking, startTracking, stopTracking };
};
