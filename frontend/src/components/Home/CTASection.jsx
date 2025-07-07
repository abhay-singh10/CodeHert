import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CTASection = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/problems');
    } else {
      navigate('/register');
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="display-6 fw-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="lead text-muted mb-4">
              Join our community of problem solvers and take your coding skills to the next level.
            </p>
            <button className="btn btn-primary btn-lg px-5" onClick={handleClick}>
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 