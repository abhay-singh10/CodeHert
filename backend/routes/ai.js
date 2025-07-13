const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// @route   POST /api/ai/codeReview
router.post('/codeReview', aiController.codeReview);

module.exports = router;