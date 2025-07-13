import React, { useState } from 'react';

const ProblemEditor = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'Easy');
  const [statement, setStatement] = useState(initialData?.statement || '');
  const [hints, setHints] = useState(
    Array.isArray(initialData?.hints)
      ? initialData.hints.join(', ')
      : initialData?.hints || ''
  );
  const [inputSection, setInputSection] = useState(initialData?.inputSection || '');
  const [outputSection, setOutputSection] = useState(initialData?.outputSection || '');
  const [tags, setTags] = useState(
    Array.isArray(initialData?.tags)
      ? initialData.tags.join(', ')
      : initialData?.tags || ''
  );
  const [examples, setExamples] = useState(
    Array.isArray(initialData?.examples)
      ? initialData.examples.map(e => ({ input: e.input || '', output: e.output || '', explanation: e.explanation || '' }))
      : []
  );

  const isEditing = !!initialData;

  const handleExampleChange = (idx, field, value) => {
    setExamples(exs => exs.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  };

  const handleAddExample = () => {
    setExamples(exs => [...exs, { input: '', output: '', explanation: '' }]);
  };

  const handleRemoveExample = (idx) => {
    setExamples(exs => exs.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      difficulty,
      statement,
      hints: hints.split(',').map(t => t.trim()).filter(Boolean),
      inputSection,
      outputSection,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      examples: examples.filter(ex => ex.input && ex.output),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      {isEditing && (
        <div className="mb-3">
          <label className="form-label">Code</label>
          <input
            type="text"
            className="form-control"
            value={initialData?.code || ''}
            disabled
            style={{
              color: '#000',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              opacity: 0.8
            }}
          />
        </div>
      )}
      <div className="mb-3">
        <label className="form-label">Difficulty</label>
        <select
          className="form-select"
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Tags (comma separated)</label>
        <input
          type="text"
          className="form-control"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Statement</label>
        <textarea
          className="form-control"
          rows={3}
          value={statement}
          onChange={e => setStatement(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Input Section</label>
        <textarea
          className="form-control"
          rows={2}
          value={inputSection}
          onChange={e => setInputSection(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Output Section</label>
        <textarea
          className="form-control"
          rows={2}
          value={outputSection}
          onChange={e => setOutputSection(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Hints (comma separated)</label>
        <input
          type="text"
          className="form-control"
          value={hints}
          onChange={e => setHints(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Example Testcases</label>
        <div className="border rounded p-2 bg-light">
          {examples.map((ex, idx) => (
            <div key={idx} className="mb-3 p-2 border rounded bg-white position-relative">
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute end-0 top-0 m-2"
                onClick={() => handleRemoveExample(idx)}
                style={{ zIndex: 2 }}
                title="Remove example"
              >
                ×
              </button>
              <div className="mb-2">
                <label
                  className="form-label"
                  style={{
                    color: '#000',
                    WebkitTextFillColor: '#000',
                    textShadow: '0 0 0 #000',
                    fontWeight: 'bold',
                    opacity: 1,
                    filter: 'none',
                    zIndex: 10,
                    position: 'relative',
                  }}
                >
                  Input
                </label>
                <textarea
                  className="form-control text-dark"
                  style={{ color: 'black', backgroundColor: 'white' }}
                  rows={2}
                  value={ex.input}
                  onChange={e => handleExampleChange(idx, 'input', e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  className="form-label"
                  style={{
                    color: '#000',
                    WebkitTextFillColor: '#000',
                    textShadow: '0 0 0 #000',
                    fontWeight: 'bold',
                    opacity: 1,
                    filter: 'none',
                    zIndex: 10,
                    position: 'relative',
                  }}
                >
                  Output
                </label>
                <textarea
                  className="form-control text-dark"
                  style={{ color: 'black', backgroundColor: 'white' }}
                  rows={2}
                  value={ex.output}
                  onChange={e => handleExampleChange(idx, 'output', e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  className="form-label"
                  style={{
                    color: '#000',
                    WebkitTextFillColor: '#000',
                    textShadow: '0 0 0 #000',
                    fontWeight: 'bold',
                    opacity: 1,
                    filter: 'none',
                    zIndex: 10,
                    position: 'relative',
                  }}
                >
                  Explanation (optional)
                </label>
                <textarea
                  className="form-control text-dark"
                  style={{ color: 'black', backgroundColor: 'white' }}
                  rows={2}
                  value={ex.explanation}
                  onChange={e => handleExampleChange(idx, 'explanation', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary w-100" onClick={handleAddExample}>
            + Add Example
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
};

export default ProblemEditor; 