import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import ProblemDetails from '../components/Problem/ProblemDetails';
import CodeEditor from '../components/Problem/CodeEditor';
import IOVerdictBox from '../components/Problem/IOVerdictBox';
import SubmissionsButton from '../components/Submission/SubmissionsButton';
import { runCode, submitSolution } from '../features/submissions/submissionsSlice';


const ProblemPage = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const problemCode = useSelector(state => state.problems.currentProblem?.code);
  const runResult = useSelector(state => state.submissions.runResult);
  const submissionResult = useSelector(state => state.submissions.submissionResult);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [customInput, setCustomInput] = useState('');
  const [forceTab, setForceTab] = useState();

  const handleTabChange = () => {
    setForceTab(undefined);
  };

  useEffect(() => {
    if (runResult && typeof runResult.output === 'string') {
      // setOutput(runResult.output); // This line is removed as per the edit hint
    } else if (runResult && runResult.error) {
      // setOutput(runResult.error); // This line is removed as per the edit hint
    }
  }, [runResult]);

  const handleRun = (code, language) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setForceTab('output');
    dispatch(runCode({ code, language, input: customInput }));
  };

  const handleSubmit = (code, language) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!problemCode) {
      alert('Problem code not found!');
      return;
    }
    setForceTab('verdict');
    dispatch(submitSolution({ problemCode, code, language, user: user?._id }));
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid min-vh-100">
        <div className="row" style={{ height: 'calc(100vh - 60px)' }}>
          {/* LHS: Problem Details and Submissions Buttons */}
          <div className="col-lg-5 col-md-6 bg-light p-4" style={{ borderRight: '1px solid #eee', overflowY: 'auto' }}>
            <div className="d-flex gap-2 mb-3">
              <SubmissionsButton type="all" />
              {isAuthenticated && <SubmissionsButton type="my" />}
            </div>
            <ProblemDetails />
          </div>
          {/* RHS: Code Editor and Actions */}
          <div className="col-lg-7 col-md-6 p-4 d-flex flex-column">
            <CodeEditor
              onRun={handleRun}
              onSubmit={handleSubmit}
            />
            <IOVerdictBox
              input={customInput}
              onInputChange={setCustomInput}
              runResult={runResult}
              submissionResult={submissionResult}
              forceTab={forceTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemPage; 