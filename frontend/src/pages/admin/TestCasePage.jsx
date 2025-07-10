import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TestCaseList from '../../components/Admin/TestCaseList';
import TestCaseEditor from '../../components/Admin/TestCaseEditor';
import Navbar from '../../components/Navbar/Navbar';

const TestCasePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Admin Test Case Management</h1>
        <p>Test case management functionality will be implemented here.</p>
        <TestCaseList />
        <TestCaseEditor />
      </div>
    </>
  );
};

export default TestCasePage; 