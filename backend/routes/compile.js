const express = require("express");
const router = express.Router();
const compileController = require('../controllers/compileController');

//@desc For custom input
// @route POST /api/compile/run
router.post('/run', compileController.run);

//@desc For submission
//@route POST /api/compile/submit
router.post('/submit', compileController.submit);

module.exports = router;