const express = require('express');
const router = express.Router();
const problemController = require('../../controllers/adminControllers/adminProblemController');

// @route   POST /api/problems
// slug is used as a unique identifier for problems
// @desc Create a new problem (admin only)
router.post('/',  problemController.createProblem);

// @route   PUT /api/problems/code/:code
// @desc    Update a problem by code (admin only)
router.put('/code/:code', problemController.updateProblem);

// @route   DELETE /api/problems/code/:code
// @desc    Delete a problem by code (admin only)
router.delete('/code/:code', problemController.deleteProblem);

module.exports = router;
