import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="modern-footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-icon">
            <i className="fas fa-code"></i>
          </div>
          <div className="footer-text">
            <span className="footer-title">CodeDojo</span>
          </div>
        </div>
        
        <div className="footer-links">
          <Link to="/problems" className="footer-link">Problems</Link>
          <a href="#about" className="footer-link">About</a>
          <a href="#contact" className="footer-link">Contact</a>
        </div>
        
        <div className="footer-copyright">
          <span>© 2025 CodeDojo. All rights reserved.</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 