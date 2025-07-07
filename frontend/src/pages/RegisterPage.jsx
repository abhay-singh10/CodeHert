import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../features/auth/authSlice';
import RegisterForm from '../components/Auth/RegisterForm';

const RegisterPage = () => {
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
      // Only redirect if registration is successful (no error)
      if (!error) {
        navigate('/login');
      }
    } catch (error) {
      // Error is handled by Redux, do not redirect
    }
  };

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