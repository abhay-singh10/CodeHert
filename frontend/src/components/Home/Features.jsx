import React from 'react';

const Features = () => {
  const features = [
    {
      icon: 'fas fa-puzzle-piece',
      title: 'Quality Problems',
      description: 'Carefully curated, high-quality problems covering all major algorithms and data structures.',
      color: 'cyan'
    },
    {
      icon: 'fas fa-rocket',
      title: 'Instant Feedback',
      description: 'Get immediate results with our fast and accurate code execution system.',
      color: 'magenta'
    },
    {
      icon: 'fas fa-robot',
      title: 'AI Code Review',
      description: 'Get instant, concise feedback on your code from our integrated AI reviewer. Improve your code quality and learn best practices!',
      color: 'cyan'
    }
  ];

  return (
    <section className="home-features" id="features">
      <div className="features-background">
        <div className="features-particles"></div>
      </div>
      <div className="container">
        <div className="features-header">
          <h2 className="features-title">Why Choose CodeHert?</h2>
          <p className="features-subtitle">
            Everything you need to become a better programmer
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-container">
                <i className={`${feature.icon} feature-icon ${feature.color}`}></i>
                <div className={`feature-glow ${feature.color}`}></div>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 