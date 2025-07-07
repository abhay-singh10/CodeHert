const User = require('../models/User');
const Submission = require('../models/Submission');

// Get user profile with statistics
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        first_name: first_name || req.user.first_name,
        last_name: last_name || req.user.last_name,
        email: email || req.user.email
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout user (invalidate token on frontend)
exports.logoutUser = async (req, res) => {
  try {
    // The frontend will handle removing the token from localStorage
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error during logout:', error);
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
    res.json({
      success: true,
      data: user
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