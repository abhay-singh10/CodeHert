import React from 'react';
import { Link }  from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            {/* Logo and Title */}
            <div className="text-center mb-5">
              <div className="mb-4">
                <i className="fas fa-code display-1 text-primary"></i>
              </div>
              <h1 className="h2 fw-bold mb-2">Welcome Back</h1>
              <p className="text-muted">Sign in to continue your coding journey</p>
            </div>
            <LoginForm />
            {/* Back to Home */}
            <div className="text-center mt-4">
              <Link to="/" className="text-muted text-decoration-none">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 