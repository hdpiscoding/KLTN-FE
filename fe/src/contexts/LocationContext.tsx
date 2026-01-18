// src/contexts/LocationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { registerPlugin } from "@capacitor/core";
import type { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { Capacitor } from "@capacitor/core";
import { toast } from "react-toastify";
import { sendLocationToBackend } from "@/services/trackingApi"; // Đảm bảo đường dẫn import đúng

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  "BackgroundGeolocation",
);
const STORAGE_KEY = "is_location_tracking_enabled";

interface LocationContextType {
  isTracking: boolean;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isTracking, setIsTracking] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const watcherId = useRef<string | null>(null);

  // Hàm khởi tạo watcher
  const initializeWatcher = async () => {
    try {
      if (watcherId.current) return true; // Đã chạy rồi thì thôi

      const id = await BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: "Đang tìm kiếm BĐS phù hợp gần bạn...",
          backgroundTitle: "Real Estate Tracker",
          requestPermissions: true,
          stale: false,
          distanceFilter: 2, // Gửi vị trí mỗi khi di chuyển 50m
        },
        (location, error) => {
          if (error) {
            if (error.code === "NOT_AUTHORIZED") {
              console.error("Location permission missing");
            }
            return;
          }
          if (location) {
            console.log(
              "📍 Global Location update:",
              location.latitude,
              location.longitude,
            );
            // Gửi API kể cả khi App đang thu nhỏ
            sendLocationToBackend(location.latitude, location.longitude);
          }
        },
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

    const success = await initializeWatcher();
    if (success) {
      setIsTracking(true);
      localStorage.setItem(STORAGE_KEY, "true");
      toast.success("Đã bật theo dõi vị trí nền!");
    }
  };

  const stopTracking = async () => {
    if (watcherId.current) {
      await BackgroundGeolocation.removeWatcher({ id: watcherId.current });
      watcherId.current = null;
    }
    setIsTracking(false);
    localStorage.removeItem(STORAGE_KEY);
    toast.info("Đã tắt theo dõi.");
  };

  // Tự động khôi phục watcher ngay khi App khởi động
  useEffect(() => {
    const shouldBeTracking = localStorage.getItem(STORAGE_KEY) === "true";
    if (shouldBeTracking && Capacitor.isNativePlatform()) {
      console.log("🔄 App Init: Restoring background tracking...");
      initializeWatcher().then((success) => {
        if (success) setIsTracking(true);
        else {
          setIsTracking(false);
          localStorage.removeItem(STORAGE_KEY);
        }
      });
    }

    // Khi unmount Provider (tắt hẳn app), nhớ clean up để tránh memory leak
    return () => {
      if (watcherId.current) {
        BackgroundGeolocation.removeWatcher({ id: watcherId.current });
      }
    };
  }, []);

  return (
    <LocationContext.Provider
      value={{ isTracking, startTracking, stopTracking }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationTracking = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useLocationTracking must be used within a LocationProvider",
    );
  }
  return context;
};
