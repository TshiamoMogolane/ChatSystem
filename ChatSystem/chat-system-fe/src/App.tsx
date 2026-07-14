import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Main app routes */}
        <Route path="/chat" element={<Dashboard />} />
        <Route path="/friends" element={<Dashboard />} />
        <Route path="/friends/home" element={<Dashboard />} />
        <Route path="/friends/all-friends" element={<Dashboard />} />
        <Route path="/friends/requests" element={<Dashboard />} />
        <Route path="/friends/suggestions" element={<Dashboard />} />

        {/* Redirect old /dashboard to /chat */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;