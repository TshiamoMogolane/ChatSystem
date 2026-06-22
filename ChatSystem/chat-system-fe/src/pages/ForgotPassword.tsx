import { useState } from 'react';
import { authService } from '../../src/services/authService';

export default function ForgotPassword() {
  // State management
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // ✅ FIXED: Pass the EmailRequest object, not just the string
      await authService.forgotPassword({ email: email });
      
      setMessage('If an account exists with this email, a password reset link has been sent.');
      setIsSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('If an account exists with this email, a password reset link has been sent.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="logo-wrapper text-center mr-8 mt-50">
        <img
          src="/logo.png"
          alt="Chat System Logo"
          height="100"
          className="text-right"
        />
      </div>

      <div className="auth-container">
        <h4 className="text-left mb-2">Reset Password</h4>
        
        {message && (
          <div className={`alert ${isSuccess ? 'alert-success' : 'alert-info'} mb-3`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}