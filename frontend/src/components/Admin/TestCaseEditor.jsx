import React, { useState, useEffect } from 'react';

const TestCaseEditor = ({ initialData, onSubmit, onCancel }) => {
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [points, setPoints] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setInput(initialData.input || '');
      setExpectedOutput(initialData.expected_output || '');
      setPoints(initialData.points || 1);
    } else {
      setInput('');
      setExpectedOutput('');
      setPoints(1);
    }
    setError(null);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || !expectedOutput.trim()) {
      setError('Input and expected output are required.');
      return;
    }
    onSubmit({ input, expected_output: expectedOutput, points });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Input</label>
        <textarea
          className="form-control"
          rows={3}
          value={input}
          onChange={e => setInput(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Expected Output</label>
        <textarea
          className="form-control"
          rows={3}
          value={expectedOutput}
          onChange={e => setExpectedOutput(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Points</label>
        <input
          type="number"
          className="form-control"
          min={1}
          value={points}
          onChange={e => setPoints(Number(e.target.value))}
          required
        />
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-success">{initialData ? 'Update' : 'Add'} Test Case</button>
      </div>
    </form>
  );
};

export default TestCaseEditor; 