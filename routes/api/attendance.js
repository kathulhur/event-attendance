let express = require('express');
let router = express.Router();
let attendanceHandler = require('../../handlers/api/attendanceHandler');


router.get('/', attendanceHandler.api.GET_attendances);
router.get('/:id', attendanceHandler.api.GET_attendance);
router.post('/create/:id', attendanceHandler.api.POST_attendance);
router.delete('/delete/:id', attendanceHandler.api.DELETE_attendance);
module.exports = router;