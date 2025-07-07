import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Stats from '../components/Home/Stats';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      
      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-6 fw-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="lead text-muted mb-4">
                Join our community of problem solvers and take your coding skills to the next level.
              </p>
              <Link to="/register" className="btn btn-primary btn-lg px-5">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="mb-3">CodeDojo</h5>
              <p className="text-muted">
                The ultimate platform for algorithmic problem solving and competitive programming.
              </p>
            </div>
            <div className="col-md-3">
              <h6 className="mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li><a href="#problems" className="text-muted text-decoration-none">Problems</a></li>
                <li><a href="#leaderboard" className="text-muted text-decoration-none">Leaderboard</a></li>
                <li><a href="#contests" className="text-muted text-decoration-none">Contests</a></li>
                <li><a href="#about" className="text-muted text-decoration-none">About</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="mb-3">Support</h6>
              <ul className="list-unstyled">
                <li><a href="#help" className="text-muted text-decoration-none">Help Center</a></li>
                <li><a href="#contact" className="text-muted text-decoration-none">Contact Us</a></li>
                <li><a href="#privacy" className="text-muted text-decoration-none">Privacy Policy</a></li>
                <li><a href="#terms" className="text-muted text-decoration-none">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-muted mb-0">
                © 2025 CodeDojo. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex gap-3 justify-content-md-end">
                <a href="#" className="text-muted"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-muted"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-muted"><i className="fab fa-github"></i></a>
                <a href="#" className="text-muted"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage; 