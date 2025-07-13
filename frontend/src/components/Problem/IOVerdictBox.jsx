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

const IOVerdictBox = ({ input, onInputChange, runResult, submissionResult, forceTab, onTabChange, aiReview }) => {
  const [activeTab, setActiveTab] = useState('input');

  useEffect(() => {
    if (forceTab && ['input', 'output', 'verdict', 'review'].includes(forceTab)) {
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
    <div className="io-verdict-card">
      <div className="io-verdict-header">
        <button
          className={`io-verdict-tab ${activeTab === 'input' ? 'active' : ''}`}
          onClick={() => setActiveTab('input')}
        >
          Input
        </button>
        <button
          className={`io-verdict-tab ${activeTab === 'output' ? 'active' : ''}`}
          onClick={() => setActiveTab('output')}
        >
          Output
        </button>
        <button
          className={`io-verdict-tab ${activeTab === 'verdict' ? 'active' : ''}`}
          onClick={() => setActiveTab('verdict')}
        >
          Verdict
        </button>
        <button
          className={`io-verdict-tab ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
        >
          Review
        </button>
      </div>
      <div className="io-verdict-body">
        {activeTab === 'input' && (
          <textarea
            className="io-verdict-input"
            rows={4}
            value={input}
            onChange={e => onInputChange(e.target.value)}
            placeholder="Enter custom input here..."
          />
        )}
        {activeTab === 'output' && (
          <>
            <pre className="io-verdict-output">{output || 'No output yet.'}</pre>
            {mappedDetails && (
              <pre className="io-verdict-error">{mappedDetails}</pre>
            )}
          </>
        )}
        {activeTab === 'verdict' && (
          <div>
            {verdict ? (
              <>
                <span
                  className={`io-verdict-badge ${verdict !== 'Accepted' ? 'error' : ''}`}
                >
                  {verdict}
                </span>
                {/* Show compilation error details if present */}
                {verdict.includes('Compilation Error') && submissionResult?.error && (
                  <pre className="io-verdict-error">{submissionResult.error.details || submissionResult.error.message || submissionResult.error}</pre>
                )}
                {/* Show testcase blocks if not Accepted and testcaseResults exist */}
                {verdict !== 'Accepted' && submissionResult?.testcaseResults && (
                  <div className="io-verdict-testcases">
                    {submissionResult.testcaseResults.map((tc, idx) => {
                      const isPassed = tc.status === 'pass';
                      // Stop rendering after the first failed testcase
                      if (!isPassed) {
                        return (
                          <div
                            key={tc.index}
                            className="io-testcase failed"
                          >
                            Test case {tc.index}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={tc.index}
                          className="io-testcase passed"
                        >
                          Test case {tc.index}
                        </div>
                      );
                    }).slice(0, submissionResult.testcaseResults.findIndex(tc => tc.status !== 'pass') + 1)}
                  </div>
                )}
              </>
            ) : (
              <span className="io-verdict-empty">No verdict yet.</span>
            )}
          </div>
        )}
        {activeTab === 'review' && aiReview && (
          <div className="ai-review-form ai-review-card" style={{ marginTop: '1.5em' }}>
            <div className="ai-review-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5em', marginBottom: '0.5em', color: '#3b82f6', fontWeight: 600, fontSize: '1.1em' }}>
              <span role="img" aria-label="robot">🤖</span> AI Code Review
            </div>
            <pre className="ai-review-output">{aiReview}</pre>
          </div>
        )}
        {activeTab === 'review' && !aiReview && (
          <div className="ai-review-form ai-review-card" style={{ marginTop: '1.5em', textAlign: 'center', color: '#888' }}>
            No AI review yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default IOVerdictBox; 