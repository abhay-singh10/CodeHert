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
      <div className="container mt-4">
        <h1 className="mb-4">Admin Test Case Management</h1>
        <button className="btn btn-primary mb-3" onClick={handleAdd}>
          + Add Test Case
        </button>
        {loading && <div>Loading...</div>}
        {error && <div className="alert alert-danger">{typeof error === 'string' ? error : error.message || JSON.stringify(error)}</div>}
        <TestCaseList
          testCases={testCases}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {showEditor && (
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingTestCase ? 'Edit Test Case' : 'Add Test Case'}</h5>
                  <button type="button" className="btn-close" onClick={handleEditorCancel}></button>
                </div>
                <div className="modal-body">
                  <TestCaseEditor
                    initialData={editingTestCase}
                    onSubmit={handleEditorSubmit}
                    onCancel={handleEditorCancel}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TestCasePage; 