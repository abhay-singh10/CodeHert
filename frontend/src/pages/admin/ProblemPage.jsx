import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProblemList from '../../components/Admin/Problem/ProblemList';
import ProblemEditor from '../../components/Admin/Problem/ProblemEditor';
import { fetchAllProblems, removeProblem, updateProblem, createProblem } from '../../features/admin/adminProblemsSlice';
import Navbar from '../../components/Navbar/Navbar';

const ProblemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { problems, loading, error } = useSelector(state => state.adminProblems);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    dispatch(fetchAllProblems());
  }, [dispatch, isAuthenticated, user, navigate]);

  const handleAdd = () => {
    setEditingProblem(null);
    setShowEditor(true);
  };

  const handleEdit = (problem) => {
    setEditingProblem(problem);
    setShowEditor(true);
  };

  const handleDelete = (problem) => {
    if (window.confirm(`Delete problem "${problem.title}"?`)) {
      dispatch(removeProblem(problem.code));
    }
  };

  const handleEditorSubmit = (data) => {
    if (editingProblem) {
      // Update existing problem
      dispatch(updateProblem({ code: editingProblem.code, data })).then(() => {
        setShowEditor(false);
        setEditingProblem(null);
      });
    } else {
      // Create new problem
      dispatch(createProblem(data)).then(() => {
        setShowEditor(false);
        setEditingProblem(null);
      });
    }
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
    setEditingProblem(null);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Admin Problem Management</h1>
        <button className="btn btn-primary mb-3" onClick={handleAdd}>
          + Create New Problem
        </button>
        {loading && <div>Loading...</div>}
        {error && <div className="alert alert-danger">{typeof error === 'string' ? error : error.message || JSON.stringify(error)}</div>}
        <ProblemList problems={problems} onEdit={handleEdit} onDelete={handleDelete} />
        {showEditor && (
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingProblem ? 'Edit Problem' : 'Create Problem'}</h5>
                  <button type="button" className="btn-close" onClick={handleEditorCancel}></button>
                </div>
                <div className="modal-body">
                  <ProblemEditor
                    initialData={editingProblem}
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

export default ProblemPage; 