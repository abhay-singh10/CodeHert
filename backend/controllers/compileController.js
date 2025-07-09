const axios = require('axios');
const TestCase = require('../models/TestCase');

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
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// @route   POST /api/compile/submit
exports.submit = async (req, res) => {
    const { language, code, problemId } = req.body;
    try {
        // Fetch all test cases for the problem, sorted by index
        const testcases = await TestCase.find({ problemId }).sort({ index: 1 });
        const results = [];

        for (const testcase of testcases) {
            try {
                const response = await axios.post('http://localhost:8000/run', {
                    language,
                    code,
                    input: testcase.input
                });
                const passed = response.data.output.trim() === testcase.output.trim();
                results.push({
                    index: testcase.index,
                    status: passed ? 'pass' : 'fail',
                    expected: testcase.output,
                    actual: response.data.output
                });
            } catch (error) {
                results.push({
                    index: testcase.index,
                    status: 'error',
                    error: error.response?.data || error.message
                });
            }
        }

        res.json({ results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
