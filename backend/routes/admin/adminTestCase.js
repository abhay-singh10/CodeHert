const express = require('express');
const router = express.Router();
const testCaseController = require('../../controllers/adminControllers/adminTestCaseController');

// @route   POST /api/admin/testcases
// @desc    Create a new test case for a problem (admin only)
router.post('/', testCaseController.createTestCase);

// @route   PUT /api/admin/testcases/:testcaseId
// @desc    Update an existing test case (admin only)
router.put('/:testcaseId', testCaseController.updateTestCase);

// @route   DELETE /api/admin/testcases/:testcaseId
// @desc    Delete a test case (admin only)
router.delete('/:testcaseId', testCaseController.deleteTestCase);

// @route   GET /api/admin/testcases/problems/:problemCode
// @desc    List all test cases for a problem (admin only)
router.get('/problems/:problemCode', testCaseController.listTestCases);

module.exports = router;
