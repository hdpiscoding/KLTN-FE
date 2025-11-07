import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Login} from "@/pages/Login.tsx";
import {Register} from "@/pages/Register.tsx";
import {RegisterInfo} from "@/pages/RegisterInfo.tsx";
import {OTP} from "@/pages/OTP.tsx";
import {ForgotEmail} from "@/pages/ForgotEmail.tsx";
import {Forgot} from "@/pages/Forgot.tsx";
import {MainLayout} from "@/layouts/MainLayout.tsx";
import {Home} from "@/pages/Home.tsx";

function App() {

  return (
      <>
          <Router>
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
                  </Route>

              </Routes>
          </Router>
      </>
  )
}

export default App
