import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            {/* Logo and Title */}
            <div className="text-center mb-5">
              <div className="mb-4">
                <i className="fas fa-user-plus display-1 text-primary"></i>
              </div>
              <h1 className="h2 fw-bold mb-2">Join CodeDojo</h1>
              <p className="text-muted">Start your coding journey today</p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 