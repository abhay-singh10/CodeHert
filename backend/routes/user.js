const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// @route   GET /api/user/me
// @desc    Get logged-in user's profile (private)
router.get('/me', authMiddleware, userController.getMe);

// @route   PUT /api/user/:username
// @desc    Update logged-in user's profile (private)
router.put('/:username',authMiddleware,  userController.updateUserProfile);

// @route   GET /api/user/:username
// @desc    Get public user profile by username (public)
router.get('/:username', userController.getPublicUserProfile);

// @route   GET /api/user/:username/submissions
// @desc    Get public user submissions by username (public)
router.get('/:username/submissions', userController.getPublicUserSubmissions);

//@route DELETE/api/user/:username
router.delete('/:username', authMiddleware, userController.deleteUserProfile);

module.exports = router; 