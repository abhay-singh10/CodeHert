import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="bg-primary text-white py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-4">
              Master Your Coding Skills
            </h1>
            <p className="lead mb-4">
              Join thousands of developers solving algorithmic challenges, 
              improving their problem-solving skills, and competing with peers 
              in our comprehensive online judge platform.
            </p>
            <div className="d-flex gap-3">
              <Link to="/register" className="btn btn-light btn-lg px-4">
                Start Solving
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                Learn More
              </Link>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="bg-white bg-opacity-10 rounded p-4">
              <i className="fas fa-laptop-code display-1"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 