import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProblemTable = ({ problems = [], loading, error }) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{typeof error === 'string' ? error : JSON.stringify(error)}</div>;
  if (!problems.length) return <div className="text-muted">No problems found.</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-dark">
          <tr>
            <th style={{ minWidth: 100 }}>Code</th>
            <th>Name</th>
            <th style={{ minWidth: 120 }}>Difficulty</th>
            <th style={{ minWidth: 150 }}>Tags</th>
          </tr>
        </thead>
        <tbody>
          {problems.map(problem => (
            <tr key={problem._id}>
              <td>
                <Link to={`/problems/${problem.code}`} className="text-decoration-none fw-semibold">
                  {problem.code}
                </Link>
              </td>
              <td>
                <Link to={`/problems/${problem.code}`} className="text-decoration-none">
                  {problem.name}
                </Link>
              </td>
              <td>
                <span className={`badge ${getDifficultyClass(problem.difficulty)} px-3 py-2 fs-6`}>
                  {problem.difficulty}
                </span>
              </td>
              <td>
                <TagDisplay tags={problem.tags} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TagDisplay = ({ tags }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!tags || tags.length === 0) {
    return <span className="text-muted small">No tags</span>;
  }

  const maxVisibleTags = 3;
  const hasMoreTags = tags.length > maxVisibleTags;
  const visibleTags = showAll ? tags : tags.slice(0, maxVisibleTags);
  const remainingCount = tags.length - maxVisibleTags;

  return (
    <div className="d-flex flex-wrap gap-1 align-items-center">
      {visibleTags.map((tag, index) => (
        <span key={index} className={`badge ${getTagClass(tag)} px-2 py-1 fs-7`}>
          {tag}
        </span>
      ))}
      {hasMoreTags && !showAll && (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary fs-7 px-2 py-1"
          onClick={() => setShowAll(true)}
          style={{ border: '1px solid #6c757d', fontSize: '0.75rem' }}
        >
          +{remainingCount} more
        </button>
      )}
      {showAll && hasMoreTags && (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary fs-7 px-2 py-1"
          onClick={() => setShowAll(false)}
          style={{ border: '1px solid #6c757d', fontSize: '0.75rem' }}
        >
          Show less
        </button>
      )}
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

function getTagClass(tag) {
  const tagLower = tag.toLowerCase();
  
  // Algorithm categories
  if (tagLower.includes('array') || tagLower.includes('list')) return 'bg-primary';
  if (tagLower.includes('string')) return 'bg-info text-dark';
  if (tagLower.includes('tree') || tagLower.includes('binary')) return 'bg-success';
  if (tagLower.includes('graph') || tagLower.includes('dfs') || tagLower.includes('bfs')) return 'bg-warning text-dark';
  if (tagLower.includes('dp') || tagLower.includes('dynamic')) return 'bg-danger';
  if (tagLower.includes('greedy')) return 'bg-secondary';
  if (tagLower.includes('sort') || tagLower.includes('search')) return 'bg-dark';
  
  // Data structures
  if (tagLower.includes('stack') || tagLower.includes('queue')) return 'bg-primary';
  if (tagLower.includes('hash') || tagLower.includes('map')) return 'bg-info text-dark';
  if (tagLower.includes('heap') || tagLower.includes('priority')) return 'bg-success';
  
  // Default
  return 'bg-secondary';
}

export default ProblemTable; 