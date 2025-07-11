import React, { useState, useEffect } from 'react';

const exitCodeMap = {
  3221225477: "Segmentation fault (access violation)",
  3221225725: "Stack overflow",
  3221225781: "Division by zero",
  3221225620: "Division by zero",
  3221226356: "Invalid memory reference",
  // Add more as needed
};

// Custom style for deep red in verdict
const deepRedStyle = {
  backgroundColor: '#b3001b',
  borderColor: '#b3001b',
};

const IOVerdictBox = ({ input, onInputChange, runResult, submissionResult, forceTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState('input');

  useEffect(() => {
    if (forceTab && ['input', 'output', 'verdict'].includes(forceTab)) {
      setActiveTab(forceTab);
      if (onTabChange) onTabChange();
    }
  }, [forceTab, onTabChange]);

  // Unwrap nested error objects
  let errorObj = runResult?.error;
  while (errorObj && errorObj.error) {
    errorObj = errorObj.error;
  }

  let output = '';
  let errorDetails = null;
  if (runResult) {
    if (runResult.output) {
      output = runResult.output;
    } else if (errorObj) {
      if (errorObj.type === 'compilation') {
        output = `Compilation Error: ${errorObj.message}`;
      } else if (errorObj.type === 'runtime') {
        output = 'Runtime Error';
      } else {
        output = errorObj.message || 'Error';
      }
      if (errorObj.details) {
        errorDetails = errorObj.details;
      }
    }
  }

  // Map exit codes to friendly messages
  let mappedDetails = errorDetails;
  if (
    errorDetails &&
    typeof errorDetails === 'string' &&
    errorDetails.startsWith('Process exited with code ')
  ) {
    const code = parseInt(errorDetails.replace('Process exited with code ', '').trim());
    if (exitCodeMap[code]) {
      mappedDetails = `${errorDetails}\n\n${exitCodeMap[code]}`;
    }
  }

  let verdict = '';
  if (submissionResult) {
    console.log('DEBUG submissionResult:', submissionResult); // Debug log
    verdict = submissionResult.result || submissionResult.error || '';
  }

  return (
    <div className="card mt-3 shadow-sm">
      <div className="card-header d-flex gap-2">
        <button
          className={`btn btn-sm ${activeTab === 'input' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveTab('input')}
        >
          Input
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'output' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveTab('output')}
        >
          Output
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'verdict' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveTab('verdict')}
        >
          Verdict
        </button>
      </div>
      <div className="card-body" style={{ minHeight: 120 }}>
        {activeTab === 'input' && (
          <textarea
            className="form-control"
            rows={4}
            value={input}
            onChange={e => onInputChange(e.target.value)}
            placeholder="Enter custom input here..."
          />
        )}
        {activeTab === 'output' && (
          <>
            <pre className="bg-dark text-white p-2 rounded mb-0">{output || 'No output yet.'}</pre>
            {mappedDetails && (
              <pre className="bg-dark text-danger p-2 rounded mt-2" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95em' }}>{mappedDetails}</pre>
            )}
          </>
        )}
        {activeTab === 'verdict' && (
          <div>
            {verdict ? (
              <>
                <span
                  className={`badge text-white fs-5 px-4 py-2 mb-3${verdict === 'Accepted' ? ' bg-success border-success' : ''}`}
                  style={{ borderRadius: '1em', fontWeight: 700, letterSpacing: '0.5px', display: 'inline-block', ...(verdict !== 'Accepted' ? deepRedStyle : {}) }}
                >
                  {verdict}
                </span>
                {/* Show compilation error details if present */}
                {verdict.includes('Compilation Error') && submissionResult?.error && (
                  <pre className="bg-dark text-danger p-2 rounded mt-2" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95em' }}>{submissionResult.error.details || submissionResult.error.message || submissionResult.error}</pre>
                )}
                {/* Show testcase blocks if not Accepted and testcaseResults exist */}
                {verdict !== 'Accepted' && submissionResult?.testcaseResults && (
                  <div className="mt-3 d-flex gap-3 flex-wrap">
                    {submissionResult.testcaseResults.map((tc, idx) => {
                      const isPassed = tc.status === 'pass';
                      // Stop rendering after the first failed testcase
                      if (!isPassed) {
                        return (
                          <div
                            key={tc.index}
                            className="px-3 py-2 rounded text-white mb-2 d-inline-block border"
                            style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '0.2px', ...deepRedStyle }}
                          >
                            Test case {tc.index}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={tc.index}
                          className="px-3 py-2 rounded text-white mb-2 d-inline-block bg-success border border-success"
                          style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '0.2px' }}
                        >
                          Test case {tc.index}
                        </div>
                      );
                    }).slice(0, submissionResult.testcaseResults.findIndex(tc => tc.status !== 'pass') + 1)}
                  </div>
                )}
              </>
            ) : (
              <span className="text-muted">No verdict yet.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IOVerdictBox; 