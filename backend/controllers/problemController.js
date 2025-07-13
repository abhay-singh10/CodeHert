const Problem = require('../models/Problem');
// @desc    Get all problems
exports.getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single problem by code
exports.getProblemByCode = async (req, res) => {
    try {
        const problem = await Problem.findOne({ code: req.params.code });
        if (!problem) return res.status(404).json({ message: 'Problem not found' });
        res.json(problem);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};