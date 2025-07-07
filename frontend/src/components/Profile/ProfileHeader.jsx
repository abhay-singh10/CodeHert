import React from 'react';
import { Link } from 'react-router-dom';

const ProfileHeader = ({ profile, username }) => (
  <div className="col-12 mb-4">
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="h2 fw-bold">
        <i className="fas fa-user-circle me-3 text-primary"></i>
        {profile ? `${profile.first_name || ''} ${profile.last_name || ''}` : username}'s Profile
      </h1>
      <Link to="/" className="btn btn-outline-primary">
        <i className="fas fa-home me-2"></i>
        Back to Home
      </Link>
    </div>
  </div>
);

export default ProfileHeader; 