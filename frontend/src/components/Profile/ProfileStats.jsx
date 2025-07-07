import React from 'react';

const ProfileStats = ({ profile, loading, error }) => (
  <div className="card border-0 shadow-sm mb-4">
    <div className="card-header bg-transparent border-0">
      <h5 className="mb-0">
        <i className="fas fa-chart-bar me-2 text-primary"></i>
        Statistics
      </h5>
    </div>
    <div className="card-body">
      {loading || error ? (
        <div className="text-center py-4 text-muted">No data</div>
      ) : (
        <div className="row text-center">
          <div className="col-6 mb-3">
            <div className="h3 fw-bold text-success mb-1">{profile.problemsSolved || 0}</div>
            <div className="text-muted small">Solved</div>
          </div>
          <div className="col-6 mb-3">
            <div className="h3 fw-bold text-warning mb-1">{profile.problemsAttempted || 0}</div>
            <div className="text-muted small">Attempted</div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default ProfileStats; 