import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser } from '../features/auth/authSlice';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // If not authenticated and we haven't checked auth yet, try to fetch current user
    if (!isAuthenticated && !hasCheckedAuth) {
      dispatch(fetchCurrentUser()).finally(() => {
        setHasCheckedAuth(true);
      });
      return;
    }

    // Only redirect after we've checked auth and loading is complete
    if (hasCheckedAuth && !loading) {
      // Redirect if not authenticated
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      // Redirect if admin required but user is not admin
      if (requireAdmin && (!user || user.role !== 'admin')) {
        navigate('/');
        return;
      }
    }
  }, [isAuthenticated, user, loading, hasCheckedAuth, requireAdmin, navigate, dispatch]);

  // Show loading while checking authentication
  if (loading || !hasCheckedAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not admin
  if (!isAuthenticated || (requireAdmin && (!user || user.role !== 'admin'))) {
    return null;
  }

  return children;
};

export default ProtectedRoute; 