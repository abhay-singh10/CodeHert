import React from 'react';

const ProfileStats = ({ profile, loading, error }) => {
  if (loading) {
    return (
      <div className="profile-card">
        <div className="profile-card-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading statistics...</p>
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

  const totalSolved = easy + medium + hard;

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-card-title">
          <i className="fas fa-chart-bar"></i>
          <span>Statistics</span>
        </div>
      </div>
      <div className="profile-card-content">
        <div className="stats-overview">
          <div className="total-solved">
            <div className="total-number">{totalSolved}</div>
            <div className="total-label">Problems Solved</div>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-item easy">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number">{easy}</div>
              <div className="stat-label">Easy</div>
            </div>
          </div>
          <div className="stat-item medium">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number">{medium}</div>
              <div className="stat-label">Medium</div>
            </div>
          </div>
          <div className="stat-item hard">
            <div className="stat-icon">
              <i className="fas fa-fire"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number">{hard}</div>
              <div className="stat-label">Hard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats; 