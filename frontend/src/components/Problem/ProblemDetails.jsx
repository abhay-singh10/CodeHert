import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProblemByCode } from '../../features/problems/problemsSlice';
import ReactMarkdown from 'react-markdown';


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
  if (error) return <div className="error-message">{error}</div>;
  if (!currentProblem) return <div>No problem found.</div>;

  return (
    <div>
      <h2 className="problem-title">{currentProblem.name}</h2>
      {currentProblem.difficulty && (
        <div className="problem-difficulty">
          <span className={`problem-difficulty-badge ${currentProblem.difficulty.toLowerCase()}`}>
            {currentProblem.difficulty}
          </span>
        </div>
      )}
      <div className="problem-section">
        <span className="problem-section-title">Statement:</span>
        <div className="problem-section-content">
          <ReactMarkdown>{currentProblem.statement || ''}</ReactMarkdown>
        </div>
      </div>
      <div className="problem-section">
        <span className="problem-section-title">Input:</span>
        <div className="problem-section-content">
          <ReactMarkdown>{currentProblem.inputSection || ''}</ReactMarkdown>
        </div>
      </div>
      <div className="problem-section">
        <span className="problem-section-title">Output:</span>
        <div className="problem-section-content">
          <ReactMarkdown>{currentProblem.outputSection || ''}</ReactMarkdown>
        </div>
      </div>
      {currentProblem.examples && currentProblem.examples.length > 0 && (
        <div className="problem-section">
          <h5 className="problem-section-title">Examples</h5>
          {currentProblem.examples.map((ex, idx) => (
            <div key={ex._id || idx} className="problem-example">
              <div><strong>Input:</strong> <div className="problem-example-content">{ex.input}</div></div>
              <div><strong>Output:</strong> <div className="problem-example-content">{ex.output}</div></div>
              {ex.explanation && <div><strong>Explanation:</strong> <span className="problem-example-content">{ex.explanation}</span></div>}
            </div>
          ))}
        </div>
      )}
      {currentProblem.tags && currentProblem.tags.length > 0 && (
        <div className="problem-tags-section">
          <h5 className="problem-section-title">Tags</h5>
          <button
            className="problem-tags-button"
            onClick={() => setShowTags((prev) => !prev)}
          >
            {showTags ? 'Hide Tags' : 'Show Tags'}
          </button>
          {showTags && (
            <div className="problem-tags-container">
              {currentProblem.tags.map((tag, idx) => (
                <span key={idx} className="problem-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
      {currentProblem.hints && currentProblem.hints.length > 0 && (
        <div className="problem-hints-section">
          <h5 className="problem-section-title">Hints</h5>
          <button
            className="problem-hints-button"
            onClick={() => setShowHints((prev) => !prev)}
          >
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>
          {showHints && (
            <div>
              {currentProblem.hints.map((hint, idx) => (
                <div key={idx} className="problem-hint-item">
                  <button
                    className="problem-hint-toggle"
                    onClick={() => setHintVisibility(prev => prev.map((v, i) => i === idx ? !v : v))}
                  >
                    {hintVisibility[idx] ? `Hide Hint ${idx + 1}` : `Show Hint ${idx + 1}`}
                  </button>
                  {hintVisibility[idx] && (
                    <div className="problem-hint-content">
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