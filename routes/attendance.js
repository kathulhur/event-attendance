var express = require('express');
var router = express.Router();
var attendanceHandler = require('../handlers/attendanceHandler');
// Get attendance form page
router.get('/', attendanceHandler.GET_attendance);

module.exports = router;