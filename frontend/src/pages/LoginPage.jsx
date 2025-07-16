import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import Navbar from '../components/Navbar/Navbar';

const LoginPage = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user && user.username) {
      navigate(`/user/${user.username}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <>
      <Navbar />
      <div className="auth-page-wrapper">
        <div className="auth-background">
          <div className="auth-particles"></div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5 col-xl-4">
              {/* Logo and Title */}
              <div className="text-center mb-5">
                <div className="mb-4">
                  <div className="auth-icon-container">
                    <i className="fas fa-code auth-icon"></i>
                    <div className="auth-glow"></div>
                  </div>
                </div>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to continue your coding journey</p>
              </div>
              <LoginForm />
              {/* Back to Home */}
              <div className="text-center mt-4">
                <Link to="/" className="btn-back-home">
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage; 