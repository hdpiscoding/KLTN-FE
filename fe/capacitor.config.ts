import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.uit.timnha",
  appName: "timnha",
  webDir: "dist",
  server: {
    androidScheme: "https", // Giúp tránh lỗi CORS khi gọi API
  },
  plugins: {
    StatusBar: {
      // Cho phép nội dung tràn lên status bar (để dùng được padding CSS ở trên)
      overlaysWebView: true,
      // Kiểu chữ: 'dark' (chữ đen) hoặc 'light' (chữ trắng)
      style: "dark",
      // Màu nền trong suốt (cho Android)
      backgroundColor: "#00000000",
    },
  },
};

export default config;
