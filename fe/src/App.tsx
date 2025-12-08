import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Login} from "@/pages/Login.tsx";
import {Register} from "@/pages/Register.tsx";
import {RegisterInfo} from "@/pages/RegisterInfo.tsx";
import {OTP} from "@/pages/OTP.tsx";
import {ForgotEmail} from "@/pages/ForgotEmail.tsx";
import {Forgot} from "@/pages/Forgot.tsx";
import {MainLayout} from "@/layouts/MainLayout.tsx";
import {Home} from "@/pages/Home.tsx";
import AboutUs from "@/pages/AboutUs.tsx";
import ScrollToTop from "@/components/scroll-to-top.tsx";
import {FAQ} from "@/pages/FAQ.tsx";
import TermsOfUse from "@/pages/TermOfUse.tsx";
import OperatingRegulations from "@/pages/OperatingRegulations.tsx";
import PrivacyPolicy from "@/pages/PrivacyPolicy.tsx";
import PostingRegulations from "@/pages/PostingRegulations.tsx";
import {BuyProperty} from "@/pages/BuyProperty.tsx";
import {EstimatePropertyAddress} from "@/pages/EstimatePropertyAddress.tsx";
import {EstimatePropertyMap} from "@/pages/EstimatePropertyMap.tsx";
import {EstimatePropertyPrice} from "@/pages/EstimatePropertyPrice.tsx";
import {UserLayout} from "@/layouts/UserLayout.tsx";
import {MyPosts} from "@/pages/MyPosts.tsx";
import {CreatePost} from "@/pages/CreatePost.tsx";
import {FavoritePosts} from "@/pages/FavoritePosts.tsx";
import {UserProfile} from "@/pages/UserProfile.tsx";
import {ChangePassword} from "@/pages/ChangePassword.tsx";
import {PropertyDetail} from "@/pages/PropertyDetail.tsx";
import {EditPost} from "@/pages/EditPost.tsx";
import '@goongmaps/goong-js/dist/goong-js.css';
import {RentProperty} from "@/pages/RentProperty.tsx";
import {PrivateRoute} from "@/components/private-route.tsx";

function App() {

  return (
      <>
          <Router>
              <ScrollToTop/>
              <Routes>
                  <Route path="/dang-nhap" element={<Login/>}/>
                  <Route path="/dang-ky" element={<Register/>}>
                      <Route index element={<RegisterInfo/>}/>
                      <Route path="otp" element={<OTP from={"register"}/>}/>
                  </Route>

                  <Route path="/quen-mat-khau" element={<Forgot/>}>
                      <Route index element={<ForgotEmail/>}/>
                      <Route path="otp" element={<OTP from={"forgot"}/>}/>
                  </Route>

                  <Route path="/" element={<MainLayout/>}>
                      <Route index element={<Home/>}/>
                      <Route path="/ve-chung-toi" element={<AboutUs/>}/>
                      <Route path="/cau-hoi-thuong-gap" element={<FAQ/>}/>
                      <Route path="/dieu-khoan-su-dung" element={<TermsOfUse/>}/>
                      <Route path="/quy-che-hoat-dong" element={<OperatingRegulations/>}/>
                      <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy/>}/>
                      <Route path="/quy-dinh-dang-tin" element={<PostingRegulations/>}/>
                      <Route path="/mua-nha" element={<BuyProperty/>}/>
                      <Route path="/thue-nha" element={<RentProperty/>}/>
                      <Route path="/bat-dong-san/:id" element={<PropertyDetail/>}/>
                      <Route path="/dinh-gia-nha/dia-chi" element={<EstimatePropertyAddress/>}/>
                      <Route path="/dinh-gia-nha/ban-do" element={<EstimatePropertyMap/>}/>
                      <Route path="/dinh-gia-nha/ket-qua" element={<EstimatePropertyPrice/>}/>
                  </Route>

                  <Route path="/" element={
                      <PrivateRoute>
                          <UserLayout/>
                      </PrivateRoute>
                  }>
                      <Route path="/tin-dang" element={<MyPosts/>}/>
                      <Route path="/dang-tin" element={<CreatePost/>}/>
                      <Route path="/bat-dong-san/:id/chinh-sua" element={<EditPost/>}/>
                      <Route path="/tin-yeu-thich" element={<FavoritePosts/>}/>
                      <Route path="/thong-tin-ca-nhan" element={<UserProfile/>}/>
                      <Route path="/doi-mat-khau" element={<ChangePassword/>}/>
                  </Route>

              </Routes>
          </Router>
      </>
  )
}

export default App
