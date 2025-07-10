import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SubmissionsButton = ({ type }) => {
  const navigate = useNavigate();
  const { problemCode } = useParams();
  const label = type === 'all' ? 'All Submissions' : 'My Submissions';
  const path = type === 'all'
    ? `/problems/${problemCode}/all-submissions`
    : `/problems/${problemCode}/my-submissions`;

  return (
    <button
      className="btn btn-outline-primary"
      onClick={() => navigate(path)}
      style={{ fontWeight: 600 }}
    >
      {label}
    </button>
  );
};

export default SubmissionsButton; 