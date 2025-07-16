import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProblemList from '../../components/Admin/Problem/ProblemList';
import ProblemEditor from '../../components/Admin/Problem/ProblemEditor';
import { fetchAllProblems, removeProblem, updateProblem, createProblem } from '../../slices/admin/adminProblemsSlice';
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
      {/* Admin page wrapper with gradient background */}
      <div className="admin-problems-wrapper">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              {/* Main admin card with glassmorphism */}
              <div className="admin-problems-card">
                {/* Header with gradient and admin-specific styling */}
                <div className="admin-problems-header">
                  <div className="header-content">
                    <h1 className="admin-problems-title">
                      <span className="title-icon">⚙️</span>
                      Admin Problem Management
                    </h1>
                    <p className="admin-problems-subtitle">Create, edit, and manage coding problems</p>
                  </div>
                  <div className="header-actions">
                    <button className="admin-add-btn" onClick={handleAdd}>
                      <span className="btn-icon">+</span>
                      Create Problem
                    </button>
                    <div className="admin-stats">
                      <div className="stat-item">
                        <span className="stat-number">{problems.length}</span>
                        <span className="stat-label">Problems</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content area */}
                <div className="admin-problems-content">
                  {loading && (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading problems...</p>
                    </div>
                  )}
                  
                  {error && (
                    <div className="error-container">
                      <div className="error-icon">⚠️</div>
                      <p>{typeof error === 'string' ? error : error.message || JSON.stringify(error)}</p>
                    </div>
                  )}
                  
                  {!loading && !error && (
                    <ProblemList problems={problems} onEdit={handleEdit} onDelete={handleDelete} />
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
                {editingProblem ? 'Edit Problem' : 'Create New Problem'}
              </h3>
              <button className="admin-modal-close" onClick={handleEditorCancel}>
                <span>×</span>
              </button>
            </div>
            <div className="admin-modal-body">
              <ProblemEditor
                initialData={editingProblem}
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

export default ProblemPage; 