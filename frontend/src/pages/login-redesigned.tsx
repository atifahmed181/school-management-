import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../services/api';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';

interface FormData {
  username: string;
  password: string;
}

const LoginRedesigned: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Make real API call to backend
      const response = await authAPI.login({
        email: formData.username, // Backend expects email
        password: formData.password
      });
      
      if (response.data && response.data.token) {
        // Store the actual JWT token
        localStorage.setItem('token', response.data.token);
        console.log('Login successful, redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        setError('Invalid response from server');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Failed to login. Please try again.';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Left Section - Branding */}
          <div className="branding-section">
            <div className="logo-container">
              <div className="logo">
                <div className="logo-wreath">
                  <div className="logo-star">★</div>
                  <div className="logo-circle">
                    <div className="logo-text-arc">BEACON ASKARI SCHOOL SYSTEM</div>
                    <div className="logo-emblem">
                      <div className="logo-swords">⚔️</div>
                      <div className="logo-bass">BASS</div>
                      <div className="logo-banner">THE PACE SETTERS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="school-name">
              <h1>Beacon Askari School System</h1>
              <h2>(BASS)</h2>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="login-section">
            <h2 className="login-title">Login</h2>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="forgot-password">
                <a href="#" className="forgot-link">forgot my password</a>
              </div>

              <button 
                type="submit" 
                className={`login-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="register-link">
              <small>
                Don't have an account? <a href="/register">Register here</a>
              </small>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #87CEEB 0%, #98D8E8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-container {
          width: 100%;
          max-width: 1000px;
        }

        .login-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          min-height: 600px;
        }

        /* Left Section - Branding */
        .branding-section {
          flex: 1;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: white;
          position: relative;
        }

        .logo-container {
          margin-bottom: 40px;
        }

        .logo {
          width: 200px;
          height: 200px;
          position: relative;
        }

        .logo-wreath {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-star {
          position: absolute;
          top: -10px;
          font-size: 30px;
          color: #FFD700;
          z-index: 3;
        }

        .logo-circle {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: #1e3a8a;
          border: 8px solid #FFD700;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .logo-text-arc {
          position: absolute;
          top: 20px;
          font-size: 10px;
          font-weight: bold;
          color: white;
          text-align: center;
          transform: rotate(-15deg);
          letter-spacing: 1px;
        }

        .logo-emblem {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .logo-swords {
          font-size: 24px;
          color: #FFD700;
        }

        .logo-bass {
          font-size: 18px;
          font-weight: bold;
          color: white;
        }

        .logo-banner {
          font-size: 8px;
          color: #ff4444;
          background: #FFD700;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: bold;
        }

        .school-name {
          text-align: center;
        }

        .school-name h1 {
          font-size: 28px;
          font-weight: bold;
          margin: 0 0 10px 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .school-name h2 {
          font-size: 20px;
          font-weight: normal;
          margin: 0;
          color: #FFD700;
        }

        /* Right Section - Login Form */
        .login-section {
          flex: 1;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-title {
          font-size: 36px;
          font-weight: 600;
          color: #1e3a8a;
          margin: 0 0 40px 0;
          text-align: center;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .login-form {
          width: 100%;
        }

        .input-group {
          margin-bottom: 25px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          color: #6b7280;
          font-size: 16px;
          z-index: 2;
        }

        .form-input {
          width: 100%;
          padding: 15px 15px 15px 50px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #f9fafb;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 16px;
          padding: 5px;
          z-index: 2;
        }

        .password-toggle:hover {
          color: #3b82f6;
        }

        .forgot-password {
          text-align: right;
          margin-bottom: 30px;
        }

        .forgot-link {
          color: #3b82f6;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .login-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-button.loading {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .register-link {
          text-align: center;
          margin-top: 30px;
          color: #6b7280;
        }

        .register-link a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }

        .register-link a:hover {
          text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-card {
            flex-direction: column;
            min-height: auto;
          }

          .branding-section {
            padding: 30px 20px;
            min-height: 300px;
          }

          .login-section {
            padding: 40px 20px;
          }

          .logo {
            width: 150px;
            height: 150px;
          }

          .logo-circle {
            width: 140px;
            height: 140px;
          }

          .school-name h1 {
            font-size: 24px;
          }

          .school-name h2 {
            font-size: 18px;
          }

          .login-title {
            font-size: 28px;
            margin-bottom: 30px;
          }
        }

        @media (max-width: 480px) {
          .login-page {
            padding: 10px;
          }

          .branding-section {
            padding: 20px;
          }

          .login-section {
            padding: 30px 20px;
          }

          .logo {
            width: 120px;
            height: 120px;
          }

          .logo-circle {
            width: 110px;
            height: 110px;
          }

          .logo-text-arc {
            font-size: 8px;
          }

          .logo-bass {
            font-size: 14px;
          }

          .logo-banner {
            font-size: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginRedesigned;
