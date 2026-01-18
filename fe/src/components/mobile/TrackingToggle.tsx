import { useBackgroundLocation } from "../../hooks/useBackgroundLocation";
import { Capacitor } from "@capacitor/core";
import { MapPin, MapPinOff } from "lucide-react"; // Icon từ lucide-react

export const TrackingToggle = () => {
  const { isTracking, startTracking, stopTracking } = useBackgroundLocation();

  // Ẩn component nếu đang chạy trên trình duyệt web thường
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <button
        onClick={isTracking ? stopTracking : startTracking}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isTracking
            ? "bg-red-500 hover:bg-red-600 animate-pulse" // Hiệu ứng nhấp nháy khi đang chạy
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isTracking ? (
          <MapPinOff className="w-6 h-6 text-white" />
        ) : (
          <MapPin className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Label nhỏ bên dưới */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
        {isTracking ? "Tracking ON" : "Tracking OFF"}
      </div>
    </div>
  );
};
