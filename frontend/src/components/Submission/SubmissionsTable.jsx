import React from 'react';
import { Link } from 'react-router-dom';

const SubmissionsTable = ({ submissions = [], loading, error, onVerdictClick }) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{typeof error === 'string' ? error : JSON.stringify(error)}</div>;
  if (!submissions.length) return <div className="text-muted">No submissions found.</div>;

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th style={{ minWidth: 120 }}>Username</th>
              <th style={{ minWidth: 120 }}>Problem Code</th>
              <th style={{ minWidth: 120 }}>Verdict</th>
              <th style={{ minWidth: 180 }}>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, idx) => (
              <tr key={idx}>
                <td>
                  <Link to={`/user/${sub.username}`} className="text-decoration-none fw-semibold">
                    {sub.username}
                  </Link>
                </td>
                <td>
                  <Link to={`/problems/${sub.problem_code}`} className="text-decoration-none fw-semibold">
                    {sub.problem_code}
                  </Link>
                </td>
                <td>
                  <span
                    className={`badge ${getVerdictClass(sub.result)} px-3 py-2 fs-6`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onVerdictClick && onVerdictClick(sub)}
                  >
                    {sub.result}
                  </span>
                </td>
                <td>
                  {formatDateTime(sub.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

function getVerdictClass(verdict) {
  if (!verdict) return 'bg-secondary';
  if (verdict.toLowerCase().includes('accepted')) return 'bg-success';
  if (
    verdict.toLowerCase().includes('wrong') ||
    verdict.toLowerCase().includes('compilation') ||
    verdict.toLowerCase().includes('runtime') ||
    verdict.toLowerCase().includes('time limit')
  ) return 'bg-danger';
  return 'bg-secondary';
}

function formatDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export default SubmissionsTable; 