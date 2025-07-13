import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../../features/auth/authSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    loginInput: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      navigate(`/profile/${result.user.username}`);
    } catch (error) {
      // Error is handled by Redux
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
          <div className="form-group">
            <label htmlFor="loginInput" className="form-label">
              <i className="fas fa-user me-2"></i>
              Username or Email
            </label>
            <input
              type="text"
              className="form-control"
              id="loginInput"
              name="loginInput"
              value={formData.loginInput}
              onChange={handleChange}
              placeholder="Enter your username or email"
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
                placeholder="Enter your password"
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
          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2"></i>
                Sign In
              </>
            )}
          </button>
        </form>
        <div className="auth-links">
          <p className="auth-link-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create one here
            </Link>
          </p>
          <Link to="/forgot-password" className="auth-link-secondary">
            <i className="fas fa-key me-1"></i>
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 