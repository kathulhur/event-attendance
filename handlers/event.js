const mongoose = require('mongoose');
const EventModel = require('../models/Event');
const participantModel = require('../models/Participant');
const modelUtil = require('../utils/modelUtil');
const db = require('../lib/db');

exports.GET_eventForm = function (req, res) {
    res.render('eventForm', { csrf: 'CSRF token goes here'});
}

exports.GET_events = async function (req, res) {
    try {
        let results = await db.event.getEvents();// get all the event records
        // console.log(results);
        if (results.length == 0) {
            res.json({ msg: "GET: Empty data."});
        }else if (results) {// if there are results, filter the data to be passed
            res.render('events', { events: db.event.filterEvents(results) });// return the filtered result

        } else {
            res.json({ msg: "GET: Something went wrong"});// No data in the database
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: "Server error, please try again after a while."});// Server error
    }
},

exports.GET_event = async function (req, res) {
    let eventId; 
    try { // check the validity of id
        eventId = db.validateId(req.params.eventId);
    } catch (err) {
        console.error("Error: " + err);
        res.status(400).json({ msg: "GET: InvalidID."})
    }

    try {
        
        let event = await db.event.getEventById(eventId);// get the event
        let participants = await db.event.getEventParticipants(eventId); // get all the participants of this event
        if(event) {// if there are results, filter the data to be passed
            res.render('event', { event: db.event.filterEvent(event), participants: db.participant.filterParticipants(participants) } );// return the filtered result
        } else {
            res.status(404).json({ mg: "GET: Data not found."});// No data in the database
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: "GET: Server error, please try again after a while."});// Server error
    }
}

exports.GET_eventEdit = async function (req, res, next) {
    let eventId;
    try{ // checks if the id is valid
        console.log("Event ID: " + req.params.eventId);
        eventId = db.validateId(req.params.eventId);
    } catch(err) {
        console.log("Error: " + err);
        next(err);
    }

    try { // Get the event from the database
        let result = await db.event.getEventById(eventId);
        if(result) {
            res.render('eventEdit', 
            { 
                event: db.event.filterEvent(result),
                csrf: "CSRF token goes here."
            });
        } else {
            res.status(404).json({ msg: "Event not found!"});
        }
    } catch(err) {
        console.log('Error: ' + err);
        next(err);
    } 
}

exports.DELETE_event = function(req, res) {
    res.redirect(`/api/events/${req.params.eventId}/delete`);
}