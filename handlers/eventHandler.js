const mongoose = require('mongoose');
const EventModel = require('../models/eventModel');
const util = require('../utils/util');
const modelUtil = require('../utils/modelUtil');

exports.GET_events = async function(req, res) {
    let results = await EventModel.find().exec();
    res.render('events', {events: modelUtil.event.filterEvents(results), csrf: 'CSRF token goes here'});
}

exports.GET_event = async function(req, res, next) {
    let eventId;
    try{// check if the ID is valid
        eventId = mongoose.Types.ObjectId(req.params.eventId);
    } catch (err) {
        console.log("Error: " + err);
        res.status(400).send('GET: invalid id');
    }

    try{
        let result = await EventModel.findById(eventId).exec();
        if(result){
            res.render('event', {event: modelUtil.event.filterEvent(result), csrf: 'CSRF token goes here'});
        } else {
            next();
        }
    } catch (err) {
        console.log("Error: " + err);
        next(err);
    }
    
}

exports.GET_eventForm = function (req, res) {
    res.render('eventForm', { csrf: 'CSRF token goes here'});
}
