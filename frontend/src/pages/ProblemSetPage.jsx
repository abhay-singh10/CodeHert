import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProblems } from '../slices/problems/problemsSlice';
import ProblemTable from '../components/Problem/ProblemTable';
import Navbar from '../components/Navbar/Navbar';

const ProblemsPage = () => {
  const dispatch = useDispatch();
  const { problems, loading, error } = useSelector(state => state.problems);

  useEffect(() => {
    dispatch(fetchProblems());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="problems-page-wrapper">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              <div className="problems-card">
                <div className="problems-header">
                  <div className="header-content">
                    <h1 className="problems-title">
                      <span className="title-icon">💻</span>
                      Coding Problems
                    </h1>
                    <p className="problems-subtitle">Master algorithms and data structures</p>
                  </div>
                  <div className="header-stats">
                    <div className="stat-item">
                      <span className="stat-number">{problems.length}</span>
                      <span className="stat-label">Problems</span>
                    </div>
                  </div>
                </div>
                
                
                <div className="problems-content">
                  <ProblemTable problems={problems} loading={loading} error={error} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemsPage; 