const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// @route   POST /api/problems
// slug is used as a unique identifier for problems
// @desc Create a new problem (admin only)
router.post('/', authMiddleware, isAdmin, problemController.createProblem);

// @route   GET /api/problems
// @desc Get all problems (public)
router.get('/', problemController.getAllProblems);

// @route   GET /api/problems/:id
// Get a single problem by ID (public)
router.get('/code/:code', problemController.getProblemByCode);

// @route   PUT /api/problems/code/:code
// @desc    Update a problem by code (admin only)
router.put('/code/:code', authMiddleware, isAdmin, problemController.updateProblem);

// @route   DELETE /api/problems/code/:code
// @desc    Delete a problem by code (admin only)
router.delete('/code/:code', authMiddleware, isAdmin, problemController.deleteProblem);

module.exports = router;