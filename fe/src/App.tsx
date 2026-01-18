/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Login } from "@/pages/authentication/Login.tsx";
import { Register } from "@/pages/authentication/Register.tsx";
import { RegisterInfo } from "@/pages/authentication/RegisterInfo.tsx";
import { OTP } from "@/pages/authentication/OTP.tsx";
import { ForgotEmail } from "@/pages/authentication/ForgotEmail.tsx";
import { Forgot } from "@/pages/authentication/Forgot.tsx";
import { MainLayout } from "@/layouts/MainLayout.tsx";
import { Home } from "@/pages/general/Home.tsx";
import AboutUs from "@/pages/general/AboutUs.tsx";
import ScrollToTop from "@/components/general/scroll-to-top.tsx";
import { FAQ } from "@/pages/general/FAQ.tsx";
import TermsOfUse from "@/pages/general/TermOfUse.tsx";
import OperatingRegulations from "@/pages/general/OperatingRegulations.tsx";
import PrivacyPolicy from "@/pages/general/PrivacyPolicy.tsx";
import PostingRegulations from "@/pages/general/PostingRegulations.tsx";
import { BuyProperty } from "@/pages/property/BuyProperty.tsx";
import { EstimatePropertyAddress } from "@/pages/estimation/EstimatePropertyAddress.tsx";
import { EstimatePropertyMap } from "@/pages/estimation/EstimatePropertyMap.tsx";
import { EstimatePropertyPrice } from "@/pages/estimation/EstimatePropertyPrice.tsx";
import EstimationHistory from "@/pages/estimation/EstimationHistory.tsx";
import EstimationDetail from "@/pages/estimation/EstimationDetail.tsx";
import { UserLayout } from "@/layouts/UserLayout.tsx";
import { MyPosts } from "@/pages/listing/MyPosts.tsx";
import { CreatePost } from "@/pages/listing/CreatePost.tsx";
import { FavoritePosts } from "@/pages/listing/FavoritePosts.tsx";
import { UserProfile } from "@/pages/profile/UserProfile.tsx";
import { ChangePassword } from "@/pages/profile/ChangePassword.tsx";
import { PropertyDetail } from "@/pages/property/PropertyDetail.tsx";
import { EditPost } from "@/pages/listing/EditPost.tsx";
import "@goongmaps/goong-js/dist/goong-js.css";
import { RentProperty } from "@/pages/property/RentProperty.tsx";
import { PrivateRoute } from "@/components/general/private-route.tsx";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { LocationProvider } from "@/contexts/LocationContext";
import { PushNotifications } from "@capacitor/push-notifications";

const createNotificationChannel = async () => {
  if (Capacitor.getPlatform() === "android") {
    await PushNotifications.createChannel({
      id: "real_estate_alerts", // KHỚP VỚI BACKEND
      name: "Thông báo BĐS",
      description: "Nhận thông báo khi có nhà phù hợp",
      importance: 5, // 5 = High (Hiện popup trôi xuống), 4 = Default
      visibility: 1,
      sound: "default",
      vibration: true,
    });
  }
};

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  // Kích hoạt lắng nghe thông báo
  usePushNotifications();

  createNotificationChannel();

  // Xử lý nút Back trên Android
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const handleBackButton = async () => {
        // eslint-disable-next-line no-empty-pattern
        await CapacitorApp.addListener("backButton", ({}) => {
          // Các route được coi là "Root" của App -> Bấm back sẽ thoát app
          const rootRoutes = ["/", "/dang-nhap"];

          if (rootRoutes.includes(location.pathname)) {
            CapacitorApp.exitApp();
          } else {
            // Các trang khác -> Quay lại trang trước
            navigate(-1);
          }
        });
      };

      handleBackButton();

      // Cleanup listener khi unmount hoặc location thay đổi để tránh duplicate
      return () => {
        CapacitorApp.removeAllListeners();
      };
    }
  }, [navigate, location.pathname]);

  return (
    <LocationProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />}>
          <Route index element={<RegisterInfo />} />
          <Route path="otp" element={<OTP from={"register"} />} />
        </Route>

        <Route path="/quen-mat-khau" element={<Forgot />}>
          <Route index element={<ForgotEmail />} />
          <Route path="otp" element={<OTP from={"forgot"} />} />
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/ve-chung-toi" element={<AboutUs />} />
          <Route path="/cau-hoi-thuong-gap" element={<FAQ />} />
          <Route path="/dieu-khoan-su-dung" element={<TermsOfUse />} />
          <Route path="/quy-che-hoat-dong" element={<OperatingRegulations />} />
          <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />
          <Route path="/quy-dinh-dang-tin" element={<PostingRegulations />} />
          <Route path="/mua-nha" element={<BuyProperty />} />
          <Route path="/thue-nha" element={<RentProperty />} />
          <Route path="/bat-dong-san/:id" element={<PropertyDetail />} />
          <Route
            path="/dinh-gia-nha/dia-chi"
            element={<EstimatePropertyAddress />}
          />
          <Route
            path="/dinh-gia-nha/ban-do"
            element={<EstimatePropertyMap />}
          />
          <Route
            path="/dinh-gia-nha/ket-qua"
            element={<EstimatePropertyPrice />}
          />
        </Route>

        <Route
          path="/"
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route path="/tin-dang" element={<MyPosts />} />
          <Route path="/dang-tin" element={<CreatePost />} />
          <Route path="/bat-dong-san/:id/chinh-sua" element={<EditPost />} />
          <Route path="/tin-yeu-thich" element={<FavoritePosts />} />
          <Route path="/thong-tin-ca-nhan" element={<UserProfile />} />
          <Route path="/doi-mat-khau" element={<ChangePassword />} />
          <Route path="/dinh-gia-nha/lich-su" element={<EstimationHistory />} />
          <Route
            path="/dinh-gia-nha/ket-qua/:id"
            element={<EstimationDetail />}
          />
        </Route>
      </Routes>
    </LocationProvider>
  );
}

function App() {
  useEffect(() => {
    // Chỉ chạy trên Mobile
    if (Capacitor.isNativePlatform()) {
      const configStatusBar = async () => {
        try {
          // Làm status bar trong suốt
          await StatusBar.setOverlaysWebView({ overlay: true });
          // Chữ đen (dùng 'Dark' nếu nền app sáng, 'Light' nếu nền app tối)
          await StatusBar.setStyle({ style: Style.Light });
        } catch (e) {
          console.error("StatusBar error:", e);
        }
      };
      configStatusBar();
    }
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
