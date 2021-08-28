const AttendanceModel = require('../models/participantModel');
const mongoose = require('mongoose');

exports.GET_attendance = function (req, res) {
    res.render('attendance.hbs', { csrf: 'CSRF token goes here'});
}
