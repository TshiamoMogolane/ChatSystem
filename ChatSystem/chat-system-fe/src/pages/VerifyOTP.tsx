import React, { useState, useRef, useEffect, type ClipboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService'; // adjust import path

export default function VerifyOTP() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [resendDisabled, setResendDisabled] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const storedEmail = localStorage.getItem('pendingEmail');
        if (!storedEmail) {
            alert('No pending signup found. Please sign up first.');
            navigate('/signup');
        } else {
            setEmail(storedEmail);
        }
    }, [navigate]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendDisabled(false);
        }
    }, [countdown]);

    const focusNext = (index: number) => {
        if (index < 3 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const focusPrev = (index: number) => {
        if (index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const clearInput = (index: number) => {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
    };

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.slice(-1);
        if (value && !/^\d$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value) focusNext(index);
        setError('');
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '') {
                if (index > 0) {
                    clearInput(index - 1);
                    focusPrev(index);
                }
            } else {
                clearInput(index);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            focusPrev(index);
        } else if (e.key === 'ArrowRight' && index < 3) {
            focusNext(index);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        const digits = pastedData.slice(0, 4).split('').filter(char => /^\d$/.test(char));
        
        if (digits.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < digits.length && i < 4; i++) {
                newOtp[i] = digits[i];
            }
            setOtp(newOtp);
            setError('');
            
            const lastFilledIndex = Math.min(digits.length - 1, 3);
            if (lastFilledIndex < 3) {
                inputRefs.current[lastFilledIndex + 1]?.focus();
            } else {
                inputRefs.current[3]?.focus();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 4) {
            setError('Please enter all 4 digits');
            return;
        }
        if (!email) {
            setError('Email not found. Please sign up again.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // ✅ using VerifyRequest object
            await authService.verifyOtp({ email, otp: otpValue });
            localStorage.removeItem('pendingEmail');
            alert('Email verified successfully! Please log in.');
            navigate('/');
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 404) {
                setError('OTP expired. Please sign up again.');
                localStorage.removeItem('pendingEmail');
                setTimeout(() => navigate('/'), 2000);
            } else if (status === 409) {
                setError('Invalid OTP. Please try again.');
                setOtp(['', '', '', '']);
                inputRefs.current[0]?.focus();
            } else {
                setError('Verification failed. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendDisabled) return;
        setResendDisabled(true);
        setError('');
        try {
            // ✅ using authService.resendOtp
            await authService.resendOtp({ email });
            setCountdown(60);
            alert('A new verification code has been sent to your email.');
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 404) {
                setError('No pending signup found. Please sign up again.');
                localStorage.removeItem('pendingEmail');
                setTimeout(() => navigate('/signup'), 2000);
            } else {
                setError('Failed to resend code. Please try again later.');
            }
            setResendDisabled(false);
        }
    };

    return (
        <div>
            <div className="logo-wrapper text-center mr-8 mt-50">
                <img src="/logo.png" alt="Chat System Logo" height="100" className="text-right" />
            </div>
            <div className="auth-container">
                <h4 className="text-left mb-2">Verify OTP</h4>
                <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '1rem' }}>
                    A 4-digit code was sent to <strong>{email}</strong>
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div 
                        className="otp-input-container"
                        style={{
                            display: 'flex',
                            gap: '5px',
                            justifyContent: 'center',
                            marginBottom: '1px',
                            marginTop: '1px'
                        }}
                        onPaste={handlePaste}
                    >
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                aria-label={`OTP digit ${index + 1}`}
                                style={{
                                    width: '55px',
                                    height: '55px',
                                    textAlign: 'center',
                                    fontSize: '24px',
                                    fontWeight: '500',
                                    border: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                                    borderRadius: '10px',
                                    backgroundColor: '#ffffff',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = error ? '#ef4444' : '#e2e8f0';
                                    e.target.style.boxShadow = 'none';
                                }}
                                disabled={loading}
                            />
                        ))}
                    </div>
                    
                    {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>}
                    
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'background-color 0.2s ease',
                            marginTop: '1rem'
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563eb')}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#3b82f6')}
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>

                    <div style={{ textAlign: 'left', marginTop: '12px' }}>
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={resendDisabled}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: resendDisabled ? '#9ca3af' : '#3b82f6',
                                fontSize: '0.9rem',
                                cursor: resendDisabled ? 'not-allowed' : 'pointer',
                                textDecoration: 'underline',
                                padding: '1px 1px'
                            }}
                        >
                            {resendDisabled ? `Resend code in ${countdown}s` : 'Resend Code'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}