import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../slices/auth/authSlice';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      return false;
    }
    if (!formData.email.includes('@')) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await dispatch(registerUser(formData)).unwrap();
      navigate('/login');
    } catch (error) {
      // Error is handled by Redux, do not redirect
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-content">
        {error && (
          <div className="alert-message error">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {typeof error === 'string'
              ? error
              : error?.error || error?.message || 'An error occurred'}
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(clearError())}
            ></button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name" className="form-label">
                <i className="fas fa-user me-2"></i>
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name" className="form-label">
                <i className="fas fa-user me-2"></i>
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <i className="fas fa-at me-2"></i>
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <i className="fas fa-envelope me-2"></i>
              Email
            </label>
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
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <i className="fas fa-lock me-2"></i>
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
              />
              <button
                className="btn-password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          <div className="form-group">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="agreeTerms" required />
              <label className="form-check-label" htmlFor="agreeTerms">
                I agree to the{' '}
                <Link to="/terms" className="auth-link">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="auth-link">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus me-2"></i>
                Register
              </>
            )}
          </button>
        </form>
        <div className="auth-links">
          <p className="auth-link-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 