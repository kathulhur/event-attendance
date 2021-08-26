const AttendanceModel = require('../models/attendanceModel');
const mongoose = require('mongoose');

exports.GET_attendance = function (req, res) {
    res.render('attendance.hbs', { csrf: 'CSRF token goes here'});
}

exports.api = {
    POST_attendance : function (req, res) {
        let attendance = new AttendanceModel({
            event: mongoose.Types.ObjectId(),
            name: req.body.fullName,
            age: req.body.age,
            professionalStatus: req.body.professionalStatus,
            institution: req.body.institution,
            course: req.body.course, 
        });

        attendance.save(function (err) {
            console.log('hey')
            if(err){
                console.log('hello')
                console.log("Error: " + err);
                res.status(500);
                res.send({result: "Failed"});
            } else {
                console.log('event', req.body.event),
                console.log('CSRF token: ', req.body._csrf);
                console.log('Full name: ', req.body.fullName);
                console.log('age: ', req.body.age);
                console.log('Professional Status: ', req.body.professionalStatus);
                console.log('Institution: ', req.body.institution);
                console.log('Course: ', req.body.course);
                console.log('Submitted: ', Date.now());
                res.send({ result: "Success" });
            }
        });
    }
}
