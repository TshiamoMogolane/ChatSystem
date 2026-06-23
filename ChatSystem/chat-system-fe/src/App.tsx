import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';

// Placeholder for future pages (e.g., Dashboard)
const Dashboard = () => <h1>Dashboard (after login)</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root path shows the auth toggle page */}
        <Route path="/" element={<AuthPage />} />

        {/* Example protected route – you can add later */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;