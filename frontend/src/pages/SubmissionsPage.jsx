import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSubmissionsByUser, fetchSubmissionsByProblem } from '../features/submissions/submissionsSlice';
import SubmissionsTable from '../components/Submission/SubmissionsTable';
import Navbar from '../components/Navbar/Navbar';

const SubmissionsPage = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const { submissions, loading, error } = useSelector(state => state.submissions);

  useEffect(() => {
    if (username) {
      dispatch(fetchSubmissionsByUser(username));
    } else {
      dispatch(fetchSubmissionsByProblem('ALL'));
    }
  }, [dispatch, username]);

  return (
    <>
      <Navbar />
      <div className="problems-page-wrapper">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              <div className="problems-card">
                <div className="problems-header">
                  <div className="header-content">
                    <h1 className="problems-title">
                      <span className="title-icon">📄</span>
                      Submissions
                    </h1>
                    <p className="problems-subtitle">
                      {username ? `All submissions by @${username}` : 'See all recent submissions'}
                    </p>
                  </div>
                  <div className="header-stats">
                    <div className="stat-item">
                      <span className="stat-number">{submissions.length}</span>
                      <span className="stat-label">Submissions</span>
                    </div>
                  </div>
                </div>
                <div className="problems-content">
                  <SubmissionsTable submissions={submissions} loading={loading} error={error} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmissionsPage; 