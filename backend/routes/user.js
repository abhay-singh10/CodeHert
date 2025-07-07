const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// @route   GET /api/user/me
// @desc    Get logged-in user's profile (private)
router.get('/me', authMiddleware , userController.getUserProfile);

// @route   PUT /api/user/me
// @desc    Update logged-in user's profile (private)
router.put('/me',authMiddleware,  userController.updateUserProfile);

// @route   GET /api/user/:username
// @desc    Get public user profile by username (public)
router.get('/:username', userController.getPublicUserProfile);

// @route   GET /api/user/:username/submissions
// @desc    Get public user submissions by username (public)
router.get('/:username/submissions', userController.getPublicUserSubmissions);

module.exports = router; 