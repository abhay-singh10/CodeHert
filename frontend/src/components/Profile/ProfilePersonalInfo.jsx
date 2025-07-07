import React from 'react';

const ProfilePersonalInfo = ({
  profile,
  loading,
  error
}) => (
  <div className="card border-0 shadow-sm mb-4">
    <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
      <h5 className="mb-0">
        <i className="fas fa-user me-2 text-primary"></i>
        Personal Information
      </h5>
    </div>
    <div className="card-body">
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
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
        </div>
      )}
    </div>
  </div>
);

export default ProfilePersonalInfo; 