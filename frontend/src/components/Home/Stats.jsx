import React from 'react';

const Stats = () => {
  const stats = [
    { number: '10K+', label: 'Active Users', color: 'cyan' },
    { number: '500+', label: 'Problems', color: 'magenta' },
    { number: '50K+', label: 'Submissions', color: 'cyan' },
    { number: '100+', label: 'Contests', color: 'magenta' }
  ];

  return (
    <section className="home-stats">
      <div className="stats-background">
        <div className="stats-particles"></div>
      </div>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className={`stat-number ${stat.color}`}>
                {stat.number}
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-glow ${stat.color}`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats; 