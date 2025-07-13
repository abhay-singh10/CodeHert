const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

// GET /api/submissions/problem/:problemCode
exports.getSubmissionsByProblem = async (req, res) => {
  try {
    const { problemCode } = req.params;
    // Find the problem by code
    const problem = await Problem.findOne({ code: problemCode });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    // Find all submissions for this problem, populate user and problem info
    const submissions = await Submission.find({ problem: problem._id })
      .populate('user', 'username')
      .populate('problem', 'code')
      .sort({ createdAt: -1 });

    // Map to required fields only
    const data = submissions.map(sub => ({
      result: sub.result,
      timestamp: sub.createdAt,
      username: sub.user?.username || '',
      problem_code: sub.problem?.code || '',
      language: sub.language,
      code: sub.code
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// GET /api/submissions/:problemCode/:username
exports.getSubmissionsByProblemAndUser = async (req, res) => {
  try {
    const { problemCode, username } = req.params;
    // Find the problem by code
    const problem = await Problem.findOne({ code: problemCode });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    // Find the user by username
    const user = await require('../models/User').findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Find all submissions for this problem and user
    const submissions = await Submission.find({ problem: problem._id, user: user._id })
      .sort({ createdAt: -1 });
    const data = submissions.map(sub => ({
      result: sub.result,
      timestamp: sub.createdAt,
      username: username,
      problem_code: problemCode,
      language: sub.language,
      code: sub.code
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}; 