const axios = require('axios');
const TestCase = require('../models/TestCase');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

function normalizeOutput(str) {
    return (str || '')
        .replace(/\r\n/g, '\n') // Normalize line endings
        .split('\n')
        .map(line => line.replace(/[ \t]+$/, '')) // Remove trailing spaces/tabs
        .join('\n')
        .replace(/\n+$/, '') // Remove empty lines at the end
        .trim();
}

// @route   POST /api/compile/run
exports.run = async (req, res) => {
    const { language, code, input } = req.body;
    try {
        const response = await axios.post('http://localhost:8000/run', {
            language,
            code,
            input
        });
        res.json(response.data);
    } catch (error) {
        const err = error.response?.data;
        if (err && err.error) {
            res.status(500).json(err);
        } else {
            res.status(500).json({ error: err || error.message });
        }
    }
};

// @route   POST /api/compile/submit
exports.submit = async (req, res) => {
    let { user, problemId, problemCode, code, language } = req.body;
    try {
        // If problemCode is provided, resolve it to problemId
        if (!problemId && problemCode) {
            const problem = await Problem.findOne({ code: problemCode });
            if (!problem) {
                return res.status(404).json({ error: 'Problem not found' });
            }
            problemId = problem._id;
        }
        if (!problemId) {
            return res.status(400).json({ error: 'Problem ID is required' });
        }
        // Fetch all test cases for the problem, sorted by index
        const testcases = await TestCase.find({ problemId }).sort({ index: 1 });
        const testcaseResults = [];
        let result = 'Accepted';

        for (const testcase of testcases) {
            try {
                const response = await axios.post('http://localhost:8000/run', {
                    language,
                    code,
                    input: testcase.input
                }, { timeout: 10000 });
                const output = normalizeOutput(response.data.output);
                const expected = normalizeOutput(testcase.expected_output);
                if (output === expected) {
                    testcaseResults.push({
                        index: testcase.index,
                        status: 'pass'
                    });
                } else {
                    result = `Wrong answer on TC${testcase.index}`;
                    testcaseResults.push({
                        index: testcase.index,
                        status: 'wrong_answer'
                    });
                    break;
                }
            } catch (error) {
                let isCompilationError = false;
                let errorType = 'runtime_error';
                if (error.response && error.response.data && error.response.data.type === 'compilation') {
                  result = `Compilation Error on TC${testcase.index}`;
                  errorType = 'compilation_error';
                  isCompilationError = true;
                } else {
                  result = `Runtime error on TC${testcase.index}`;
                }
                testcaseResults.push({
                    index: testcase.index,
                    status: errorType
                });
                break;
            }
        }

        // Save the submission
        const submission = new Submission({
            user,
            problem: problemId,
            code,
            language,
            result,
        });
        await submission.save();

        // Update user's problemsAttempted and problemsSolved
        if (user && problemCode) {
          const userDoc = await require('../models/User').findById(user);
          if (userDoc) {
            // Add to problemsAttempted if not already present
            if (!userDoc.problemsAttempted.includes(problemCode)) {
              userDoc.problemsAttempted.push(problemCode);
            }
            // Add to problemsSolved if accepted and not already present
            if (result === 'Accepted' && !userDoc.problemsSolved.includes(problemCode)) {
              userDoc.problemsSolved.push(problemCode);
            }
            await userDoc.save();
          }
        }

        res.json({ result, testcaseResults });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
};
