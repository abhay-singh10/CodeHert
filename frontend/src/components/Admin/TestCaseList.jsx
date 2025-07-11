import React from 'react';

const TestCaseList = ({ testCases, onEdit, onDelete }) => {
  if (!testCases || testCases.length === 0) {
    return <div className="alert alert-info">No test cases found for this problem.</div>;
  }

  return (
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
              <td><pre className="mb-0" style={{whiteSpace: 'pre-wrap', background: 'transparent', border: 'none', color: '#fff'}}>{tc.input}</pre></td>
              <td><pre className="mb-0" style={{whiteSpace: 'pre-wrap', background: 'transparent', border: 'none', color: '#fff'}}>{tc.expected_output}</pre></td>
              <td style={{color: '#fff'}}>{tc.points}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(tc)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(tc)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestCaseList; 