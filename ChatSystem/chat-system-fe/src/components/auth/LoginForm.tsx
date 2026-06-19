import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService'; // Adjust the import path to your file

export default function LoginForm() {
  const navigate = useNavigate();

  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page refresh
    
    // Reset previous errors
    setError('');
    
    // Basic client-side validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      // 1. Call the login API
      const response = await authService.login({ email, password });

      // 2. If successful (status 200 OK), the HttpOnly cookie is now stored in the browser.
      console.log('Login successful:', response.data); // "Login Successful"

      // 3. Redirect the user to the dashboard (or home page)
      navigate('/dashboard'); // Change '/dashboard' to your actual home route

    } catch (err: any) {
      // 4. Handle errors gracefully
      console.error('Login error:', err);

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = err.response.status;
        const message = err.response.data; // Usually a string like "Invalid username or password"

        if (status === 401 || status === 403) {
          setError('Invalid email or password. Please try again.');
        } else if (status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(typeof message === 'string' ? message : 'Login failed. Please try again.');
        }
      } else if (err.request) {
        // The request was made but no response was received (e.g., network down)
        setError('Cannot connect to the server. Please check your network.');
      } else {
        // Something else happened
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h4 className="text-left mb-2">Welcome</h4>
      
      {/* Display error message if present */}
      {error && (
        <div className="error-message" style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {/* Forgot password link */}
        <div className="text-left mt-1.5">
          <Link to="/forgot-password" style={{ fontSize: '0.9rem' }}>
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
}