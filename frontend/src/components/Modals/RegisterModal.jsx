import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../features/auth/authSlice';
import { closeModal, openModal } from '../../features/ui/uiSlice';

const RegisterModal = () => {
  const dispatch = useDispatch();
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(registerUser(formData)).unwrap();
      dispatch(closeModal('registerModal'));
      setFormData({ first_name: '', last_name: '', username: '', email: '', password: '' });
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleLoginClick = () => {
    dispatch(closeModal('registerModal'));
    dispatch(openModal('loginModal'));
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              <i className="fas fa-user-plus me-2 text-primary"></i>
              Join CodeDojo
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(closeModal('registerModal'))}
            ></button>
          </div>
          <div className="modal-body pt-0">
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
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
                    placeholder="Create a password"
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
              
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 mb-3"
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
                    Create Account
                  </>
                )}
              </button>
            </form>
            
            <div className="text-center">
              <p className="text-muted mb-2">Already have an account?</p>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleLoginClick}
              >
                <i className="fas fa-sign-in-alt me-2"></i>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal; 