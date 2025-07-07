import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../features/auth/authSlice';
import { closeModal, openModal } from '../../features/ui/uiSlice';

const LoginModal = () => {
  const dispatch = useDispatch();
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
      await dispatch(loginUser(formData)).unwrap();
      dispatch(closeModal('loginModal'));
      setFormData({ loginInput: '', password: '' });
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleRegisterClick = () => {
    dispatch(closeModal('loginModal'));
    dispatch(openModal('registerModal'));
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              <i className="fas fa-sign-in-alt me-2 text-primary"></i>
              Welcome Back to CodeDojo
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(closeModal('loginModal'))}
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
              <div className="mb-3">
                <label htmlFor="loginInput" className="form-label fw-semibold">
                  <i className="fas fa-user me-2 text-muted"></i>
                  Username or Email
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="loginInput"
                  name="loginInput"
                  value={formData.loginInput}
                  onChange={handleChange}
                  placeholder="Enter your username or email"
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
                    placeholder="Enter your password"
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
            
            <div className="text-center">
              <p className="text-muted mb-2">Don't have an account?</p>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleRegisterClick}
              >
                <i className="fas fa-user-plus me-2"></i>
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 