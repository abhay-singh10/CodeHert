import React, { useState } from 'react';

const TestCaseList = ({ testCases, onEdit, onDelete }) => {
  const [viewingTestCase, setViewingTestCase] = useState(null);

  if (!testCases || testCases.length === 0) {
    return <div className="alert alert-info">No test cases found for this problem.</div>;
  }

  const handleView = (testCase) => {
    setViewingTestCase(testCase);
  };

  const handleCloseView = () => {
    setViewingTestCase(null);
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Input</th>
              <th scope="col">Expected Output</th>
              <th scope="col">Points</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((tc, idx) => (
              <tr key={tc._id}>
                <td style={{color: '#fff'}}>{tc.index}</td>
                <td>
                  <div className="testcase-preview">
                    <pre className="mb-0" style={{whiteSpace: 'pre-wrap', background: 'transparent', border: 'none', color: '#fff'}}>
                      {truncateText(tc.input, 80)}
                    </pre>
                    {tc.input.length > 80 && (
                      <button 
                        className="btn btn-sm btn-outline-info mt-1" 
                        onClick={() => handleView(tc)}
                        style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}
                      >
                        View Full
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  <div className="testcase-preview">
                    <pre className="mb-0" style={{whiteSpace: 'pre-wrap', background: 'transparent', border: 'none', color: '#fff'}}>
                      {truncateText(tc.expected_output, 80)}
                    </pre>
                    {tc.expected_output.length > 80 && (
                      <button 
                        className="btn btn-sm btn-outline-info mt-1" 
                        onClick={() => handleView(tc)}
                        style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}
                      >
                        View Full
                      </button>
                    )}
                  </div>
                </td>
                <td style={{color: '#fff'}}>{tc.points}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-info me-2" onClick={() => handleView(tc)}>
                      <i className="fas fa-eye"></i> View
                    </button>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(tc)}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(tc)}>
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Test Case Modal */}
      {viewingTestCase && (
        <div className="testcase-view-modal-overlay" onClick={handleCloseView}>
          <div className="testcase-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="testcase-view-modal-header">
              <h3 className="testcase-view-modal-title">
                <span className="title-icon">🧪</span>
                Test Case #{viewingTestCase.index}
              </h3>
              <button className="testcase-view-modal-close" onClick={handleCloseView}>
                <span>×</span>
              </button>
            </div>
            <div className="testcase-view-modal-body">
              <div className="testcase-content-grid">
                <div className="testcase-section">
                  <h4 className="section-title">
                    <span className="section-icon">📥</span>
                    Input
                  </h4>
                  <div className="code-block">
                    <pre className="code-content">{viewingTestCase.input}</pre>
                  </div>
                </div>
                
                <div className="testcase-section">
                  <h4 className="section-title">
                    <span className="section-icon">📤</span>
                    Expected Output
                  </h4>
                  <div className="code-block">
                    <pre className="code-content">{viewingTestCase.expected_output}</pre>
                  </div>
                </div>
                
                <div className="testcase-section">
                  <h4 className="section-title">
                    <span className="section-icon">⭐</span>
                    Points
                  </h4>
                  <div className="points-display">
                    <span className="points-value">{viewingTestCase.points}</span>
                    <span className="points-label">points</span>
                  </div>
                </div>
              </div>
              
              <div className="testcase-actions">
                <button className="btn btn-warning me-2" onClick={() => onEdit(viewingTestCase)}>
                  <i className="fas fa-edit"></i> Edit Test Case
                </button>
                <button className="btn btn-secondary" onClick={handleCloseView}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestCaseList; 