import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated || (requireAdmin && (!user || user.role !== 'admin'))) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, requireAdmin, navigate]);

  if (!isAuthenticated || (requireAdmin && (!user || user.role !== 'admin'))) {
    return null;
  }
  return children;
};

export default ProtectedRoute; 