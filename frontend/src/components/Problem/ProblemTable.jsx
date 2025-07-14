import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const ProblemTable = ({ problems = [], loading, error }) => {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [tag, setTag] = useState('All');

  // Get all unique tags from problems
  const allTags = useMemo(() => {
    const tagSet = new Set();
    problems.forEach(p => (p.tags || []).forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [problems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{typeof error === 'string' ? error : JSON.stringify(error)}</div>;
  if (!problems.length) return <div className="text-muted">No problems found.</div>;

  // Filter problems by name, difficulty, and tag
  const filteredProblems = problems.filter(problem => {
    const searchLower = search.toLowerCase();
    const matchesName = (problem.name || '').toLowerCase().includes(searchLower);
    const matchesDifficulty = difficulty === 'All' || (problem.difficulty || '').toLowerCase() === difficulty.toLowerCase();
    const matchesTag = tag === 'All' || (problem.tags || []).includes(tag);
    return matchesName && matchesDifficulty && matchesTag;
  });

  return (
    <>
      <div className="d-flex flex-wrap gap-2 justify-content-end align-items-center mb-4" style={{ maxWidth: 800, marginLeft: 'auto' }}>
        {/* Search by name */}
        <div className="input-group rounded shadow-sm border me-2" style={{ background: '#23272f', maxWidth: 300 }}>
          <span className="input-group-text bg-transparent border-0" id="search-addon">
            <i className="fas fa-search text-secondary"></i>
          </span>
          <input
            type="text"
            className="form-control border-0 rounded-end"
            style={{ boxShadow: 'none', fontSize: '1rem', background: '#fff', color: '#23272f' }}
            placeholder="Search by problem name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search by problem name"
            aria-describedby="search-addon"
          />
        </div>
        {/* Filter by difficulty */}
        <select
          className="form-select shadow-sm border me-2"
          style={{ maxWidth: 160, background: '#fff', color: '#23272f' }}
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        {/* Filter by tag */}
        <select
          className="form-select shadow-sm border"
          style={{ maxWidth: 180, background: '#fff', color: '#23272f' }}
          value={tag}
          onChange={e => setTag(e.target.value)}
        >
          <option value="All">All Tags</option>
          {allTags.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
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
            {filteredProblems.map(problem => (
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
    </>
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