const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

// GET /api/submissions/problem/:problemCode
router.get('/problem/:problemCode', submissionController.getSubmissionsByProblem);

// GET /api/submissions/:problemCode/:username
router.get('/:problemCode/:username', submissionController.getSubmissionsByProblemAndUser);

module.exports = router;
