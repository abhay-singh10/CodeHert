import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const AboutPage = () => (
  <>
    <Navbar />
    <section className="home-hero" style={{ minHeight: '60vh' }}>
      <div className="hero-background">
        <div className="hero-particles"></div>
      </div>
      <div className="container">
        <div className="hero-content" style={{ display: 'block', paddingTop: '3rem' }}>
          <div className="hero-text" style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 className="hero-title mb-4">About CodeHeart</h2>
            <p>
              This Online Judge platform was created by a single developer as a personal project. It allows users to practice coding problems, submit solutions, and receive instant feedback.
            </p>
            <h4 className="mt-4"><strong>Features</strong></h4>
            <ul>
              <li><strong>Solve Algorithmic Problems:</strong> Practice problems of varying difficulty.</li>
              <li><strong>Multi-language Support:</strong> Submit code in C++, Java, or Python.</li>
              <li><strong>Instant Feedback:</strong> Get real-time results on your submissions.</li>
              <li><strong>AI Code Review:</strong> Receive AI-powered feedback and suggestions on your code submissions.</li>
            </ul>
            <h4 className="mt-4"><strong>Admin Access</strong></h4>
            <p>
              If you want to become an admin, please email me at the address below.
            </p>
            <h4 className="mt-4"><strong>Contact</strong></h4>
            <p>
              For feedback, suggestions, or admin requests, please reach out at <a href="mailto:abhaysingh10032004@gmail.com">abhaysingh10032004@gmail.com</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </>
);

export default AboutPage; 