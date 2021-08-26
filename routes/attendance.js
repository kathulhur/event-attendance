var express = require('express');
var router = express.Router();
var attendanceHandler = require('../handlers/attendanceHandler');
// Get attendance form page
router.get('/', attendanceHandler.GET_attendance);


router.post('/api/attendance-process',  attendanceHandler.api.POST_attendance);


module.exports = router;