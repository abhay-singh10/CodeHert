import React from 'react';

const Features = () => {
  const features = [
    {
      icon: 'fas fa-puzzle-piece',
      title: '500+ Problems',
      description: 'From easy to hard, covering all major algorithms and data structures.',
      color: 'primary'
    },
    {
      icon: 'fas fa-rocket',
      title: 'Instant Feedback',
      description: 'Get immediate results with our fast and accurate code execution system.',
      color: 'success'
    },
    {
      icon: 'fas fa-trophy',
      title: 'Competitions',
      description: 'Participate in weekly contests and climb the leaderboard.',
      color: 'warning'
    }
  ];

  return (
    <section className="py-5">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col-lg-8 mx-auto">
            <h2 className="display-5 fw-bold mb-3">Why Choose CodeDojo?</h2>
            <p className="lead text-muted">
              Everything you need to become a better programmer
            </p>
          </div>
        </div>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className={`bg-${feature.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} style={{width: '60px', height: '60px'}}>
                    <i className={`${feature.icon} text-${feature.color} fs-3`}></i>
                  </div>
                  <h5 className="card-title">{feature.title}</h5>
                  <p className="card-text text-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 