import { Routes, Route } from "react-router-dom";
import { WelcomePage } from "./pages/WelcomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CheckEmailPage } from "./pages/CheckEmailPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { CompleteProfilePage } from "./pages/CompleteProfilePage";


function App() {

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/check-email" element={<CheckEmailPage />}/>
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/complete-profile" element={<CompleteProfilePage />} />
    </Routes>
  )
}

export default App
