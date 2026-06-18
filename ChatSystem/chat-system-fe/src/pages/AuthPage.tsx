import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignUp from '../components/auth/SignUp';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>

      <div className="logo-wrapper text-center mr-8 mt-50">
        <img
          src="../public/logo.png"           // put your logo image in the public folder
          alt="Chat System Logo"
          height="100"               // adjust size
          className="text-right"
        />
      </div>
      <div className="auth-container">
        <div className="toggle-buttons">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        {isLogin ? <LoginForm /> : <SignUp />}
      </div>
    </div>
  );
}