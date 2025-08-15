import { Routes, Route } from "react-router-dom";
import { WelcomePage } from "./pages/WelcomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CheckEmailPage } from "./pages/CheckEmailPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { CompleteProfilePage } from "./pages/CompleteProfilePage";
import { HomePage } from "./pages/HomePage";
import { SearchUserPage } from "./pages/SearchUser";


function App() {

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/home" element={<HomePage />}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/check-email" element={<CheckEmailPage />}/>
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/complete-profile" element={<CompleteProfilePage />} />
      <Route path="/search-user" element={<SearchUserPage />} />
    </Routes>
  )
}

export default App
