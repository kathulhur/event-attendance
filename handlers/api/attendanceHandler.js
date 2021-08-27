const AttendanceModel = require('../../models/attendanceModel');
const EventModel = require('../../models/eventModel');
const mongoose = require('mongoose');

function createAttendance(body) {
    return new AttendanceModel({
        event: mongoose.Types.ObjectId(body.eventId),
        name: body.fullName,
        age: body.age,
        professionalStatus: body.professionalStatus,
        institution: body.institution,
        course: body.course, 
    });
}

function filterAttendance(attendance){
    let filteredAttendance = {
        id: attendance._id,
        event: attendance.event,
        age: attendance.age,
        professionalStatus: attendance.professionalStatus,
        institution: attendance.institution,
        course: attendance.course,
        submitted: attendance.submitted.toString()
    }

    return filteredAttendance;
}

function filterAttendances(attendances) {
    return attendances.map(filterAttendance);
}

exports.api = {
    GET_attendances: async function(req, res) {
        try {
            let results = await AttendanceModel.find()
            .populate('event')
            .exec();
            res.json(filterAttendances(results));

        } catch(err) {
            console.log(err);
            res.status(500).json({msg: "GET: Error querying the database"});
        }
    },

    GET_attendance: async function(req, res) {
        try {
            let event;
            try {// checks whether the id is valid mongodb ObjectId
                event = mongoose.Types.ObjectId(req.params.id);
            } catch (err) {
                res.status(400).json({ msg: "Invalid event ID"});
            }
            let results = await AttendanceModel.find({ event: event });
            res.json(filterAttendances(results));
        } catch(err) {
            console.error(err);
            res.status(500).json({ msg: "GET: Error querying the database."});
        }
    },

    POST_attendance : async function (req, res) {
        let eventId = req.params.id
        try {// check if the id is valid
            eventId = mongoose.Types.ObjectId(eventId);
            req.body.eventId = eventId;
        } catch(err) {
            console.error(err);
            res.status(400).json({ msg: "POST: Invalid event ID"});
        }

        try {
            let event = await EventModel.findOne({_id: eventId}).exec();
            if(event){// if there is an event, create the attendance
                let attendance = createAttendance(req.body);
                attendance.save(function (err) {
                    console.log('hey')
                    if(err){
                        console.log("Error: " + err);
                        res.status(500).send({result: "POST: Failed saving data."});
                    } else {
                        res.json(filterAttendance(attendance));
                    }
                }); 
            } else { //otherwise, return as bad request
                res.status(400).json({ msg: "POST: event not found"});
            }
        } catch(err) {
            console.log(err);
            res.status(500).json({ msg: "An error occured while retrieving event."});
        }
    },

    DELETE_attendance: async function(req, res) {
        let attendanceId = req.params.id;
        try { //check if the id is valid
            attendanceId = mongoose.Types.ObjectId(attendanceId);
        } catch (err) {
            console.error(err);
            res.status(400).json({ msg: "DELETE: Invalid Id."});
        }

        try { // delete the object
            await AttendanceModel.deleteOne({_id: attendanceId}).exec();
            res.json({ msg: "DELETE: Success"});
        } catch(err) {
            console.error("ERROR: " + err);
            res.status(500).json({ msg: "DELETE: Error deletion."});
        }
    }
}
