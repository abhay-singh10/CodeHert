import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../../components/Admin/AdminDashboard';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  return <AdminDashboard />;
};

export default DashboardPage; 