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
                  </Route>

              </Routes>
          </Router>
      </>
  )
}

export default App
