import React from 'react';

const ProfileStats = ({ profile, loading, error }) => {
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
      <div className="card-header bg-transparent border-0">
        <h5 className="mb-0">
          <i className="fas fa-chart-bar me-2 text-primary"></i>
          Statistics
        </h5>
      </div>
      <div className="card-body">
        <div className="row text-center">
          <div className="col-6 mb-3">
            <div className="h3 fw-bold text-success mb-1">
              {Array.isArray(profile.problemsSolved) ? profile.problemsSolved.length : 0}
            </div>
            <div className="text-muted small">Solved</div>
          </div>
          <div className="col-6 mb-3">
            <div className="h3 fw-bold text-warning mb-1">
              {Array.isArray(profile.problemsAttempted) ? profile.problemsAttempted.length : 0}
            </div>
            <div className="text-muted small">Attempted</div>
          </div>
          <div className="col-6 mb-3">
            <div className="h3 fw-bold text-secondary mb-1">{profile.totalSubmissions ?? 0}</div>
            <div className="text-muted small">Submissions</div>
          </div>
          <div className="col-6 mb-3">
            <div className="h3 fw-bold text-primary mb-1">{profile.points ?? 0}</div>
            <div className="text-muted small">Points</div>
          </div>
          <div className="col-12 mb-3">
            <div className="h3 fw-bold text-info mb-1">#{profile.rank ?? 0}</div>
            <div className="text-muted small">Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats; 