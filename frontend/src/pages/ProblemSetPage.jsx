import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProblems } from '../features/problems/problemsSlice';
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
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-dark text-white rounded-top-4">
                <h2 className="fw-bold mb-0">Problems</h2>
              </div>
              <div className="card-body">
                <ProblemTable problems={problems} loading={loading} error={error} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemsPage; 