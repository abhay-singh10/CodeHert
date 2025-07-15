import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';

const ProfilePersonalInfo = ({
  profile,
  loading,
  error,
  isOwnProfile
}) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: loggedInUser } = useSelector((state) => state.auth);

  // Update form fields if profile or loggedInUser changes
  useEffect(() => {
    if (isOwnProfile && loggedInUser) {
      setFormData({
        first_name: loggedInUser.first_name || '',
        last_name: loggedInUser.last_name || '',
        email: loggedInUser.email || '',
      });
    } else {
      setFormData({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        email: profile?.email || '',
      });
    }
  }, [profile, isOwnProfile, loggedInUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setSuccessMsg(null);
    try {
      // Use the username from the profile prop
      await axios.put(`/user/${profile.username}`, formData);
      setSuccessMsg('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setUpdateError(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      await axios.delete(`/user/${profile.username}`);
      // Clear auth state and tokens
      dispatch(logoutUser());
      localStorage.removeItem('token');
      alert('Your account has been deleted.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="profile-card">
        <div className="profile-card-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-card">
        <div className="profile-card-content">
          <div className="error-container">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <p>{typeof error === 'string' ? error : error?.message || JSON.stringify(error)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-card">
        <div className="profile-card-content">
          <div className="error-container">
            <div className="error-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <p>Profile not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-card-title">
          <i className="fas fa-user"></i>
          <span>Personal Information</span>
        </div>
        {isOwnProfile && !editMode && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-edit-profile" onClick={() => setEditMode(true)}>
              <i className="fas fa-edit"></i>
              Edit
            </button>
            <button className="btn-cancel" style={{ color: 'red', borderColor: 'red' }} onClick={handleDelete}>
              <i className="fas fa-trash"></i>
              Delete Account
            </button>
          </div>
        )}
      </div>
      <div className="profile-card-content">
        {editMode ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {updateError && (
              <div className="alert-message error">
                <i className="fas fa-exclamation-triangle"></i>
                {updateError}
              </div>
            )}
            {successMsg && (
              <div className="alert-message success">
                <i className="fas fa-check-circle"></i>
                {successMsg}
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={updateLoading}>
                {updateLoading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" className="btn-cancel" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info-grid">
            <div className="info-item">
              <label>First Name</label>
              <span>{profile.first_name}</span>
            </div>
            <div className="info-item">
              <label>Last Name</label>
              <span>{profile.last_name}</span>
            </div>
            <div className="info-item">
              <label>Username</label>
              <span>@{profile.username}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePersonalInfo; 