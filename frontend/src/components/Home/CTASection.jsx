import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CTASection = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <section className="home-cta">
      <div className="cta-background">
        <div className="cta-particles"></div>
      </div>
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-subtitle">
            Join our community of problem solvers and take your coding skills to the next level.
          </p>
          <div className="cta-button-container">
            {isAuthenticated ? (
              <Link to="/problems" className="btn-cta-primary">
                <i className="fas fa-rocket me-2"></i>
                Get Started Now
              </Link>
            ) : (
              <Link to="/register" className="btn-cta-primary">
                <i className="fas fa-user-plus me-2"></i>
                Get Started Now
              </Link>
            )}
          </div>
          <div className="cta-glow"></div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 