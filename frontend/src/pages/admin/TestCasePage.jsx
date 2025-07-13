import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import TestCaseList from '../../components/Admin/TestCaseList';
import TestCaseEditor from '../../components/Admin/TestCaseEditor';
import Navbar from '../../components/Navbar/Navbar';
import { fetchTestCases, createTestCase, updateTestCase, deleteTestCase } from '../../features/admin/adminTestCasesSlice';

const TestCasePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { problemCode } = useParams();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { testCases, loading, error } = useSelector(state => state.adminTestCases);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    if (problemCode) {
      dispatch(fetchTestCases(problemCode));
    }
  }, [isAuthenticated, user, navigate, dispatch, problemCode]);

  const handleAdd = () => {
    setEditingTestCase(null);
    setShowEditor(true);
  };

  const handleEdit = (testCase) => {
    setEditingTestCase(testCase);
    setShowEditor(true);
  };

  const handleDelete = (testCase) => {
    if (window.confirm('Delete this test case?')) {
      dispatch(deleteTestCase(testCase._id));
    }
  };

  const handleEditorSubmit = (data) => {
    if (editingTestCase) {
      dispatch(updateTestCase({ testcaseId: editingTestCase._id, data })).then(() => {
        setShowEditor(false);
        setEditingTestCase(null);
      });
    } else {
      dispatch(createTestCase({ ...data, problemCode })).then(() => {
        setShowEditor(false);
        setEditingTestCase(null);
      });
    }
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
    setEditingTestCase(null);
  };

  return (
    <>
      <Navbar />
      {/* Test Cases page wrapper with gradient background */}
      <div className="admin-testcases-wrapper">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              {/* Main test cases card with glassmorphism */}
              <div className="admin-testcases-card">
                {/* Header with gradient and test case specific styling */}
                <div className="admin-testcases-header">
                  <div className="header-content">
                    <h1 className="admin-testcases-title">
                      <span className="title-icon">🧪</span>
                      Test Case Management
                    </h1>
                    <p className="admin-testcases-subtitle">
                      Manage test cases for problem: <span className="problem-code">{problemCode}</span>
                    </p>
                  </div>
                  <div className="header-actions">
                    <button className="admin-add-btn" onClick={handleAdd}>
                      <span className="btn-icon">+</span>
                      Add Test Case
                    </button>
                    <div className="admin-stats">
                      <div className="stat-item">
                        <span className="stat-number">{testCases.length}</span>
                        <span className="stat-label">Test Cases</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content area */}
                <div className="admin-testcases-content">
                  {loading && (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading test cases...</p>
                    </div>
                  )}
                  
                  {error && (
                    <div className="error-container">
                      <div className="error-icon">⚠️</div>
                      <p>{typeof error === 'string' ? error : error.message || JSON.stringify(error)}</p>
                    </div>
                  )}
                  
                  {!loading && !error && (
                    <TestCaseList
                      testCases={testCases}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced modal styling */}
      {showEditor && (
        <div className="admin-modal-overlay" onClick={handleEditorCancel}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingTestCase ? 'Edit Test Case' : 'Add New Test Case'}
              </h3>
              <button className="admin-modal-close" onClick={handleEditorCancel}>
                <span>×</span>
              </button>
            </div>
            <div className="admin-modal-body">
              <TestCaseEditor
                initialData={editingTestCase}
                onSubmit={handleEditorSubmit}
                onCancel={handleEditorCancel}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestCasePage; 