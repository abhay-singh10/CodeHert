import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProblemPage from './pages/ProblemPage';
import ProblemSetPage from './pages/ProblemSetPage';
import AuthInitializer from './components/AuthInitializer';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
