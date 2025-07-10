const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');

// @route   GET /api/problems
// @desc Get all problems (public)
router.get('/', problemController.getAllProblems);

// @route   GET /api/problems/:id
// Get a single problem by ID (public)
router.get('/code/:code', problemController.getProblemByCode);

module.exports = router;