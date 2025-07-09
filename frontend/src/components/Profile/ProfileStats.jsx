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

  // Count solved problems by difficulty
  let easy = 0, medium = 0, hard = 0;
  if (Array.isArray(profile.problemsSolved)) {
    profile.problemsSolved.forEach(p => {
      if (!p.difficulty) return;
      if (p.difficulty.toLowerCase() === 'easy') easy++;
      else if (p.difficulty.toLowerCase() === 'medium') medium++;
      else if (p.difficulty.toLowerCase() === 'hard') hard++;
    });
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
          <div className="col-4 mb-3">
            <div className="h4 fw-bold text-success mb-1">{easy}</div>
            <div className="text-muted small">Easy</div>
          </div>
          <div className="col-4 mb-3">
            <div className="h4 fw-bold text-warning mb-1">{medium}</div>
            <div className="text-muted small">Medium</div>
          </div>
          <div className="col-4 mb-3">
            <div className="h4 fw-bold text-danger mb-1">{hard}</div>
            <div className="text-muted small">Hard</div>
          </div>
          <div className="col-6 mb-3">
            {/* Rating removed, now shown in personal info */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats; 