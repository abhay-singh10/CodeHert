import React from 'react';

const Stats = () => {
  const stats = [
    { number: '10K+', label: 'Active Users', color: 'primary' },
    { number: '500+', label: 'Problems', color: 'success' },
    { number: '50K+', label: 'Submissions', color: 'warning' },
    { number: '100+', label: 'Contests', color: 'info' }
  ];

  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row text-center">
          {stats.map((stat, index) => (
            <div key={index} className="col-md-3 mb-3">
              <div className={`h2 fw-bold text-${stat.color} mb-1`}>
                {stat.number}
              </div>
              <div className="text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats; 