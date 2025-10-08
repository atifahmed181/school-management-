import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../services/api';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
        email: formData.email,
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h3>School Management Login</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">👤</span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">🔒</span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div className="d-grid">
                  <button 
                    className="btn btn-primary py-2"
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Don't have an account? <a href="/register">Register here</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;