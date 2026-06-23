import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService'; // adjust import path

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    // Extract token from URL query param
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError('Invalid or missing reset token.');
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword({ token, newPassword: password });
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to reset password. Please try again.';
            setError(errorMsg);
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {token ? (
                    <form onSubmit={handleSubmit}>
                        <div >

                            <input
                                id="newPassword"
                                type='password'
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                style={{ width: '100%', padding: '0.5rem' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>

                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                                style={{ width: '100%', padding: '0.5rem' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ padding: '0.5rem 1rem', width: '100%' }}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                ) : (
                    <p>No token provided. Please use the link from your email.</p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;