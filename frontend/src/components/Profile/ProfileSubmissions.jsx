import React from 'react';

const ProfileSubmissions = ({ submissions, subLoading, subError }) => (
  <div className="card border-0 shadow-sm mb-4">
    <div className="card-header bg-transparent border-0">
      <h5 className="mb-0">
        <i className="fas fa-list-ul me-2 text-primary"></i>
        Recent Submissions
      </h5>
    </div>
    <div className="card-body">
      {subLoading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : subError ? (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {typeof subError === 'string' ? subError : subError?.message || JSON.stringify(subError)}
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center text-muted">No submissions found.</div>
      ) : (
        <ul className="list-group list-group-flush">
          {submissions.map((submission) => (
            <li key={submission._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <strong>{submission.problem}</strong> - {submission.status}
                </span>
                <span className="text-muted small">
                  {new Date(submission.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default ProfileSubmissions; 