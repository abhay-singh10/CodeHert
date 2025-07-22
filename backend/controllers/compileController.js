const axios = require('axios');
const TestCase = require('../models/TestCase');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

const COMPILER_URL = process.env.COMPILER_URL || 'http://localhost:8000/run';

function normalizeOutput(str) {
    return (str || '')
        .replace(/\r\n/g, '\n') // Normalize line endings
        .split('\n')
        .map(line => line.replace(/[ \t]+$/, '')) // Remove trailing spaces/tabs
        .join('\n')
        .replace(/\n+$/, '') // Remove empty lines at the end
        .trim();
}

function cleanErrorDetails(details) {
    if (!details) return '';
    // Replace any .cpp, .py, .java file path with a generic name (Windows or Unix)
    return details
        .replace(/[A-Za-z]:\\[^\r\n]+?compiler\\codes\\[^\r\n]+?\.cpp/g, 'main.cpp')
        .replace(/[A-Za-z]:\\[^\r\n]+?compiler\\codes\\[^\r\n]+?\.py/g, 'main.py')
        .replace(/[A-Za-z]:\\[^\r\n]+?compiler\\codes\\[^\r\n]+?\.java/g, 'Main.java')
        // Also match Unix-style paths just in case
        .replace(/[A-Za-z]?:?\/?[^\r\n]+?\/compiler\/codes\/[^\r\n]+?\.cpp/g, 'main.cpp')
        .replace(/[A-Za-z]?:?\/?[^\r\n]+?\/compiler\/codes\/[^\r\n]+?\.py/g, 'main.py')
        .replace(/[A-Za-z]?:?\/?[^\r\n]+?\/compiler\/codes\/[^\r\n]+?\.java/g, 'Main.java')
        // Docker-specific /app/codes/uuid.cpp
        .replace(/\/app\/codes\/[^\r\n]+?\.cpp/g, 'main.cpp')
        .replace(/\/app\/codes\/[^\r\n]+?\.py/g, 'main.py')
        .replace(/\/app\/codes\/[^\r\n]+?\.java/g, 'Main.java');
}

// @route   POST /api/compile/run
exports.run = async (req, res) => {
    const { language, code, input } = req.body;
    try {
        const response = await axios.post(COMPILER_URL, {
            language,
            code,
            input
        });
        res.json(response.data);
    } catch (error) {
        const err = error.response?.data;
        // Clean error details and message if present
        if (err && typeof err === 'object') {
            if (err.details) {
                err.details = cleanErrorDetails(err.details);
            }
            if (err.type === 'mle') {
                err.message = 'Your program tried to use more memory than allowed (256MB).';
            } else if (err.message) {
                err.message = cleanErrorDetails(err.message);
            }
            res.status(500).json(err);
        } else if (err && typeof err === 'object') {
            res.status(500).json({ ...err, message: 'An error occurred' });
        } else {
            res.status(500).json({
                type: 'runtime',
                message: err || error.message || 'An error occurred'
            });
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
                const response = await axios.post(COMPILER_URL, {
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
                let errorType = 'runtime_error';
                const details = error.response?.data?.details || '';
                if (error.response && error.response.data && error.response.data.type === 'compilation') {
                    result = `Compilation Error on TC${testcase.index}`;
                    errorType = 'compilation_error';
                } else if (error.response && error.response.data && error.response.data.type === 'tle') {
                    result = `Time limit exceeded on TC${testcase.index}`;
                    errorType = 'tle';
                } else if (error.response && error.response.data && error.response.data.type === 'mle') {
                    result = `Memory limit exceeded on TC${testcase.index}`;
                    errorType = 'mle';
                } else if (error.response && error.response.data && error.response.data.type === 'ole') {
                    result = `Output limit exceeded on TC${testcase.index}`;
                    errorType = 'ole';
                }  else {
                    result = `Runtime error on TC${testcase.index}`;
                    errorType = 'runtime_error';
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