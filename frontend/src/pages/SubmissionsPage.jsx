import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSubmissionsByUser, fetchSubmissionsByProblem, fetchSubmissionsByProblemAndUser } from '../slices/submissions/submissionsSlice';
import SubmissionsTable from '../components/Submission/SubmissionsTable';
import Navbar from '../components/Navbar/Navbar';
import MonacoEditor from '@monaco-editor/react';

const SubmissionsPage = () => {
  const dispatch = useDispatch();
  const { username: paramUsername, problemCode } = useParams();
  const { submissions, loading, error } = useSelector(state => state.submissions);
  const authUser = useSelector(state => state.auth.user);
  const [viewingSubmission, setViewingSubmission] = useState(null);

  useEffect(() => {
    const username = paramUsername || authUser?.username;
    if (username && problemCode) {
      dispatch(fetchSubmissionsByProblemAndUser({ problemCode, username }));
    } else if (username) {
      dispatch(fetchSubmissionsByUser(username));
    } else if (problemCode) {
      dispatch(fetchSubmissionsByProblem(problemCode));
    } else {
      dispatch(fetchSubmissionsByProblem('ALL'));
    }
  }, [dispatch, paramUsername, problemCode, authUser]);

  const handleVerdictClick = (submission) => {
    setViewingSubmission(submission);
    document.body.style.overflow = 'hidden';
  };
  const handleCloseModal = () => {
    setViewingSubmission(null);
    document.body.style.overflow = '';
  };

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
                      {paramUsername ? `All submissions by @${paramUsername}` : 'See all recent submissions'}
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
                  <SubmissionsTable submissions={submissions} loading={loading} error={error} onVerdictClick={handleVerdictClick} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for viewing submitted code */}
      {viewingSubmission && (
        <div className="testcase-view-modal-overlay" onClick={handleCloseModal}>
          <div className="testcase-view-modal" onClick={e => e.stopPropagation()}>
            <div className="testcase-view-modal-header">
              <h3 className="testcase-view-modal-title">
                <span className="title-icon">💻</span>
                Submitted Code
              </h3>
              <button className="testcase-view-modal-close" onClick={handleCloseModal}>
                <span>×</span>
              </button>
            </div>
            <div className="testcase-view-modal-body">
              <div style={{ height: '400px', minHeight: 200 }}>
                <MonacoEditor
                  height="100%"
                  defaultLanguage={viewingSubmission.language || 'cpp'}
                  value={viewingSubmission.code}
                  options={{
                    readOnly: true,
                    fontSize: 16,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    theme: 'vs-dark'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmissionsPage; 