import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="home-hero">
      <div className="hero-background">
        <div className="hero-particles"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Master Your Coding Skills
            </h1>
            <p className="hero-subtitle">
              Join thousands of developers solving algorithmic challenges, 
              improving their problem-solving skills, and competing with peers 
              in our comprehensive online judge platform.
            </p>
            <div className="hero-buttons">
              <Link to="/problems" className="btn-hero-primary">
                <i className="fas fa-rocket me-2"></i>
                Start Solving
              </Link>
              <a href="#features" className="btn-hero-secondary">
                <i className="fas fa-info-circle me-2"></i>
                Learn More
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-icon-container">
              <i className="fas fa-laptop-code hero-icon"></i>
              <div className="hero-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 