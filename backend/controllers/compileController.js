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
                result = `Runtime error on TC${testcase.index}`;
                if (error.response) {
                  console.error('Error response data:', error.response.data);
                  console.error('Error response status:', error.response.status);
                  console.error('Error response headers:', error.response.headers);
                } else {
                  console.error('Error object:', error);
                }
                testcaseResults.push({
                    index: testcase.index,
                    status: 'runtime_error'
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

        res.json({ result, testcaseResults });
    } catch (error) {
        console.error('Error in submit controller:', error);
        res.status(500).json({ error: error.message });
    } 
};
