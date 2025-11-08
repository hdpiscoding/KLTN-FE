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
import ScrollToTop from "@/components/scroll-to-top.ts";
import {FAQ} from "@/pages/FAQ.tsx";
import TermsOfUse from "@/pages/TermOfUse.tsx";

function App() {

  return (
      <>
          <Router>
              <ScrollToTop/>
              <Routes>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/register" element={<Register/>}>
                      <Route index element={<RegisterInfo/>}/>
                      <Route path="otp" element={<OTP from={"register"}/>}/>
                  </Route>

                  <Route path="/forgot" element={<Forgot/>}>
                      <Route index element={<ForgotEmail/>}/>
                      <Route path="otp" element={<OTP from={"forgot"}/>}/>
                  </Route>

                  <Route path="/" element={<MainLayout/>}>
                      <Route index element={<Home/>}/>
                      <Route path="/about-us" element={<AboutUs/>}/>
                      <Route path="/faq" element={<FAQ/>}/>
                      <Route path="/term-of-use" element={<TermsOfUse/>}/>
                  </Route>

              </Routes>
          </Router>
      </>
  )
}

export default App
