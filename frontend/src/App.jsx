import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ModalContainer from './components/Modals/ModalContainer';
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
        </Routes>
        {/* Modal Container for popup modals */}
        <ModalContainer />
      </div>
    </Router>
  );
}

export default App;
