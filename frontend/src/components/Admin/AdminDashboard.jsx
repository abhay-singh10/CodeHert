import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Admin Dashboard</h1>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">Manage Problems</h5>
                <p className="card-text">Create, edit, and delete coding problems for users. You can also manage test cases for each problem from the problem list.</p>
                <Link to="/admin/problems" className="btn btn-primary mt-auto">Go to Problems</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 