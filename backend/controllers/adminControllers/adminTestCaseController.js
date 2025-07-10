const TestCase = require('../../models/TestCase');
const Problem = require('../../models/Problem'); // Add this import

// Create a new test case for a problem
exports.createTestCase = async (req, res) => {
    try {
        const { problemCode, input, expected_output, points } = req.body;
        // Find the problem by code
        const problem = await Problem.findOne({ code: problemCode });
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
        const problemId = problem._id;
        // Find the highest index for this problem
        const lastTestCase = await TestCase.find({ problemId }).sort({ index: -1 }).limit(1);
        const nextIndex = lastTestCase.length > 0 ? lastTestCase[0].index + 1 : 1;
        const testCase = new TestCase({
            problemId,
            input,
            expected_output,
            index: nextIndex,
            points,
            createdBy: req.user.userId,
            editedBy: req.user.userId
        });
        await testCase.save();
        res.status(201).json(testCase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing test case
exports.updateTestCase = async (req, res) => {
    try {
        const { input, expected_output, index, points } = req.body;
        const testCase = await TestCase.findByIdAndUpdate(
            req.params.testcaseId,
            { input, expected_output, index, points, editedBy: req.user._id },
            { new: true }
        );
        if (!testCase) return res.status(404).json({ error: 'Test case not found' });
        res.json(testCase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a test case
exports.deleteTestCase = async (req, res) => {
    try {
        // Find and delete the test case
        const testCase = await TestCase.findByIdAndDelete(req.params.testcaseId);
        if (!testCase) return res.status(404).json({ error: 'Test case not found' });
        // After deletion, reindex remaining test cases for the same problem
        const remainingTestCases = await TestCase.find({ problemId: testCase.problemId }).sort({ index: 1 });
        for (let i = 0; i < remainingTestCases.length; i++) {
            if (remainingTestCases[i].index !== i + 1) {
                remainingTestCases[i].index = i + 1;
                await remainingTestCases[i].save();
            }
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// List all test cases for a problem
exports.listTestCases = async (req, res) => {
    try {
        const problemCode = req.params.problemCode;
        // Find the problem by code
        const problem = await Problem.findOne({ code: problemCode });
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
        const testcases = await TestCase.find({ problemId: problem._id }).sort({ index: 1 });
        res.json(testcases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 