import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.uit.timnha",
  appName: "timnha",
  webDir: "dist",
  server: {
    androidScheme: "https", // Giúp tránh lỗi CORS khi gọi API
  },
};

export default config;
