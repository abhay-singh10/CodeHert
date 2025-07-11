import React from 'react';
import { Link } from 'react-router-dom';

const ProblemList = ({ problems, onEdit, onDelete }) => {
  if (!problems.length) return <div className="text-muted">No problems found.</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-dark">
          <tr>
            <th style={{ minWidth: 100 }}>Code</th>
            <th>Name</th>
            <th style={{ minWidth: 120 }}>Difficulty</th>
            <th style={{ minWidth: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map(problem => (
            <tr key={problem._id || problem.code}>
              <td>
                <Link to={`/problems/${problem.code}`} className="text-decoration-none fw-semibold">
                  {problem.code}
                </Link>
              </td>
              <td>
                <Link to={`/problems/${problem.code}`} className="text-decoration-none">
                  {problem.title || problem.name}
                </Link>
              </td>
              <td>
                <span className={`badge ${getDifficultyClass(problem.difficulty)} px-3 py-2 fs-6`}>
                  {problem.difficulty}
                </span>
              </td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(problem)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger me-2" onClick={() => onDelete(problem)}>
                  Delete
                </button>
                <Link to={`/admin/testcases/${problem.code}`} className="btn btn-sm btn-info">
                  Manage Test Cases
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function getDifficultyClass(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'bg-success';
    case 'medium': return 'bg-warning text-dark';
    case 'hard': return 'bg-danger';
    default: return 'bg-secondary';
  }
}

export default ProblemList; 