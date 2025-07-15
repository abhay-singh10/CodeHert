import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProblemPage from './pages/ProblemPage'; 
import AdminProblemPage from './pages/admin/ProblemPage'; 
import ProblemSetPage from './pages/ProblemSetPage';
import AuthInitializer from './components/AuthInitializer';
import TestCasePage from './pages/admin/TestCasePage';
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector } from 'react-redux';
import SubmissionsPage from './pages/SubmissionsPage';
import AboutPage from './pages/AboutPage';

function App() {
  const loading = useSelector(state => state.auth.loading);

  return (
    <Router>
      <AuthInitializer />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/problems" element={<ProblemSetPage />} />
            <Route path="/problems/:problemCode" element={<ProblemPage />} />
            <Route path="/problems/:problemCode/all-submissions" element={<SubmissionsPage />} />
            <Route path="/problems/:problemCode/my-submissions" element={<SubmissionsPage />} />
            <Route path="/submissions/user/:username" element={<SubmissionsPage />} />
            <Route path="/admin/problems" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminProblemPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/testcases" element={
              <ProtectedRoute requireAdmin={true}>
                <TestCasePage />
              </ProtectedRoute>
            } />
            <Route path="/admin/testcases/:problemCode" element={
              <ProtectedRoute requireAdmin={true}>
                <TestCasePage />
              </ProtectedRoute>
            } />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App;
