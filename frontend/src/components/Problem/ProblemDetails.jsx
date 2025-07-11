import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProblemByCode } from '../../features/problems/problemsSlice';

const getDifficultyStyle = (difficulty) => {
  switch ((difficulty || '').toLowerCase()) {
    case 'easy':
      return { color: '#00bfae', background: 'rgba(0,191,174,0.1)', fontWeight: 600, padding: '2px 10px', borderRadius: 8, display: 'inline-block' };
    case 'medium':
      return { color: '#ffb86c', background: 'rgba(255,184,108,0.1)', fontWeight: 600, padding: '2px 10px', borderRadius: 8, display: 'inline-block' };
    case 'hard':
      return { color: '#ff5c8d', background: 'rgba(255,92,141,0.1)', fontWeight: 600, padding: '2px 10px', borderRadius: 8, display: 'inline-block' };
    default:
      return { fontWeight: 600, padding: '2px 10px', borderRadius: 8, display: 'inline-block' };
  }
};

const ProblemDetails = () => {
  const { problemCode } = useParams();
  const dispatch = useDispatch();
  const { currentProblem, loading, error } = useSelector(state => state.problems);
  const [showTags, setShowTags] = useState(false);
  // Track which hints are revealed
  const [hintVisibility, setHintVisibility] = useState([]);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (problemCode) {
      dispatch(fetchProblemByCode(problemCode));
    }
  }, [problemCode, dispatch]);

  useEffect(() => {
    setHintVisibility(Array(currentProblem?.hints?.length || 0).fill(false));
  }, [currentProblem?._id, currentProblem?.hints?.length]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!currentProblem) return <div>No problem found.</div>;

  return (
    <div>
      <h2 className="fw-bold mb-3">{currentProblem.name}</h2>
      {currentProblem.difficulty && (
        <div className="mb-3">
          <span style={getDifficultyStyle(currentProblem.difficulty)}>
            {currentProblem.difficulty}
          </span>
        </div>
      )}
      <div className="mb-3">
        <strong>Statement:</strong>
        <div>{currentProblem.statement}</div>
      </div>
      <div className="mb-3">
        <strong>Input:</strong>
        <pre className="bg-light p-2 rounded">{currentProblem.inputSection || ''}</pre>
      </div>
      <div className="mb-3">
        <strong>Output:</strong>
        <pre className="bg-light p-2 rounded">{currentProblem.outputSection || ''}</pre>
      </div>
      {currentProblem.examples && currentProblem.examples.length > 0 && (
        <div className="mb-3">
          <h5>Examples</h5>
          {currentProblem.examples.map((ex, idx) => (
            <div key={ex._id || idx} className="mb-2">
              <div className="bg-dark text-white p-3 rounded">
                <div><strong>Input:</strong> <pre className="d-inline text-white" style={{fontFamily: 'monospace', whiteSpace: 'pre-wrap'}}>{ex.input}</pre></div>
                <div><strong>Output:</strong> <pre className="d-inline text-white" style={{fontFamily: 'monospace', whiteSpace: 'pre-wrap'}}>{ex.output}</pre></div>
                {ex.explanation && <div><strong>Explanation:</strong> <span className="text-white">{ex.explanation}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}
      {currentProblem.tags && currentProblem.tags.length > 0 && (
        <div className="mt-3">
          <h5>Tags</h5>
          <button
            className="btn btn-sm btn-outline-secondary mb-2"
            onClick={() => setShowTags((prev) => !prev)}
            style={{ cursor: 'pointer' }}
          >
            {showTags ? 'Hide Tags' : 'Show Tags'}
          </button>
          {showTags && (
            <div className="bg-dark text-white p-3 rounded d-flex flex-wrap gap-2">
              {currentProblem.tags.map((tag, idx) => (
                <span key={idx} className="badge bg-secondary fs-6">{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
      {currentProblem.hints && currentProblem.hints.length > 0 && (
        <div className="mt-3">
          <h5>Hints</h5>
          <button
            className="btn btn-sm btn-outline-info mb-2"
            onClick={() => setShowHints((prev) => !prev)}
            style={{ cursor: 'pointer' }}
          >
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>
          {showHints && (
            <div>
              {currentProblem.hints.map((hint, idx) => (
                <div key={idx} className="mb-2">
                  <button
                    className="btn btn-outline-info btn-sm mb-2"
                    onClick={() => setHintVisibility(prev => prev.map((v, i) => i === idx ? !v : v))}
                  >
                    {hintVisibility[idx] ? `Hide Hint ${idx + 1}` : `Show Hint ${idx + 1}`}
                  </button>
                  {hintVisibility[idx] && (
                    <div className="bg-dark text-white p-3 rounded mt-1">
                      <strong>Hint {idx + 1}:</strong> {hint}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemDetails; 