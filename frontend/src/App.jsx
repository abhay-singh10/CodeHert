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
import DashboardPage from './pages/admin/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthInitializer />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/problems" element={<ProblemSetPage />} />
          <Route path="/problems/:problemCode" element={<ProblemPage />} />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardPage />
            </ProtectedRoute>
          } />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
