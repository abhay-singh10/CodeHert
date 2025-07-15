import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import ProblemDetails from '../components/Problem/ProblemDetails';
import CodeEditor from '../components/Problem/CodeEditor';
import IOVerdictBox from '../components/Problem/IOVerdictBox';
import SubmissionsButton from '../components/Submission/SubmissionsButton';
import { runCode, submitSolution } from '../features/submissions/submissionsSlice';
import { getAICodeReview } from '../api/ai';

const ProblemPage = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const problemCode = useSelector(state => state.problems.currentProblem?.code);
  const currentProblem = useSelector(state => state.problems.currentProblem);
  const runResult = useSelector(state => state.submissions.runResult);
  const submissionResult = useSelector(state => state.submissions.submissionResult);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [customInput, setCustomInput] = useState('');
  const [forceTab, setForceTab] = useState();
  const [editorCode, setEditorCode] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('cpp');
  const [aiReview, setAiReview] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

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

  // AI Review Handler
  const handleAICodeReview = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!currentProblem) {
      alert('Problem not loaded!');
      return;
    }
    setAiLoading(true);
    setAiReview('');
    setForceTab('review'); // Always switch to review tab on click
    try {
      const review = await getAICodeReview({
        problemName: currentProblem.name,
        problemStatement: currentProblem.statement,
        code: editorCode,
        language: editorLanguage
      });
      setAiReview(review);
      setForceTab('review'); // Ensure tab stays on review after response
    } catch (err) {
      setAiReview('Error getting AI review.');
    }
    setAiLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="problem-page-wrapper">
        <div className="problem-page-background">
          <div className="problem-page-particles"></div>
        </div>
        <div className="problem-page-content">
          {/* LHS: Problem Details and Submissions Buttons */}
          <div className="problem-details-section">
            <div className="problem-submissions-buttons">
              <SubmissionsButton type="all" />
              {isAuthenticated && <SubmissionsButton type="my" />}
            </div>
            <div className="problem-details-content">
              <ProblemDetails />
            </div>
          </div>
          {/* RHS: Code Editor and Actions */}
          <div className="code-editor-section">
            <CodeEditor
              onRun={handleRun}
              onSubmit={handleSubmit}
              code={editorCode}
              setCode={setEditorCode}
              language={editorLanguage}
              setLanguage={setEditorLanguage}
              extraButton={
                <button
                  className="btn-ai-review"
                  onClick={handleAICodeReview}
                  disabled={aiLoading}
                  style={{ marginLeft: '1em' }}
                >
                  {aiLoading ? 'Reviewing...' : 'Get AI Code Review'}
                </button>
              }
            />
            <IOVerdictBox
              input={customInput}
              onInputChange={setCustomInput}
              runResult={runResult}
              submissionResult={submissionResult}
              forceTab={forceTab}
              onTabChange={handleTabChange}
              aiReview={aiReview}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemPage; 