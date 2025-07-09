import React, { useState } from 'react';
import axios from '../../api/axios';
import { useSelector } from 'react-redux';

const ProfilePersonalInfo = ({
  profile,
  loading,
  error,
  isOwnProfile
}) => {
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Update form fields if profile changes
  React.useEffect(() => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
    });
  }, [profile]);

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

  if (loading) {
    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {typeof error === 'string' ? error : error?.message || JSON.stringify(error)}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="alert alert-warning" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            Profile not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="fas fa-user me-2 text-primary"></i>
          Personal Information
        </h5>
        {isOwnProfile && !editMode && (
          <button className="btn btn-sm btn-outline-primary" onClick={() => setEditMode(true)}>
            Edit
          </button>
        )}
      </div>
      <div className="card-body">
        {editMode ? (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {updateError && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {updateError}
              </div>
            )}
            {successMsg && (
              <div className="alert alert-success" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                {successMsg}
              </div>
            )}
            <button type="submit" className="btn btn-primary me-2" disabled={updateLoading}>
              {updateLoading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">First Name</label>
              <p className="text-muted mb-0">{profile.first_name}</p>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Last Name</label>
              <p className="text-muted mb-0">{profile.last_name}</p>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Username</label>
              <p className="text-muted mb-0">@{profile.username}</p>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Rating</label>
              <p className="text-muted mb-0">{profile.rating ?? 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePersonalInfo; 