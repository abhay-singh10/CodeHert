import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../features/auth/authSlice';

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
    <div className="card border-0 shadow-lg">
      <div className="card-body p-5">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
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
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="first_name" className="form-label fw-semibold">
                <i className="fas fa-user me-2 text-muted"></i>
                First Name
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="last_name" className="form-label fw-semibold">
                <i className="fas fa-user me-2 text-muted"></i>
                Last Name
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              <i className="fas fa-at me-2 text-muted"></i>
              Username
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              <i className="fas fa-envelope me-2 text-muted"></i>
              Email
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">
              <i className="fas fa-lock me-2 text-muted"></i>
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          <div className="mb-4">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="agreeTerms" required />
              <label className="form-check-label" htmlFor="agreeTerms">
                I agree to the{' '}
                <Link to="/terms" className="text-primary text-decoration-none">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary text-decoration-none">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 mb-4"
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
        <div className="text-center">
          <p className="text-muted mb-3">
            Already have an account?{' '}
            <Link to="/login" className="text-primary text-decoration-none fw-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 