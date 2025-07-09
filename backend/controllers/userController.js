const User = require('../models/User');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

// Get logged-in user's profile (for persistent login)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    // Fetch the latest user from DB
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.email = email || user.email;
    await user.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get public user profile by username
exports.getPublicUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password -email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Fetch problem details for problemsSolved
    const problems = await Problem.find({ code: { $in: user.problemsSolved } }, 'code name difficulty');
    // Map to keep order same as user.problemsSolved
    const problemMap = {};
    problems.forEach(p => { problemMap[p.code] = p; });
    const problemsSolvedDetailed = user.problemsSolved.map(code => problemMap[code] || { code });
    const userObj = user.toObject();
    userObj.problemsSolved = problemsSolvedDetailed;
    res.json({
      success: true,
      data: userObj
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get public user submissions by username
exports.getPublicUserSubmissions = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const submissions = await Submission.find({ user: user._id })
      .populate('problem', 'name difficulty')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 