import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProblemPage from './pages/ProblemPage'; // public problem page
import AdminProblemPage from './pages/admin/ProblemPage'; // admin problem page
import ProblemSetPage from './pages/ProblemSetPage';
import AuthInitializer from './components/AuthInitializer';
import TestCasePage from './pages/admin/TestCasePage';
import DashboardPage from './pages/admin/DashboardPage';

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
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/problems" element={<AdminProblemPage />} />
          <Route path="/admin/testcases" element={<TestCasePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
