const mongoose = require('mongoose');
const EventModel = require('../models/eventModel');

exports.GET_events = async function(req, res) {
    let results = await EventModel.find();
    let events = results.map(result => ({
            name: result.name,
            description: result.description,
            venue: result.venue,
            eventStart: 
                result.eventStart.toLocaleString(),
            eventEnd: 
                result.eventEnd.toLocaleString(),
        }));

    console.log(events);

    res.render('events', {events: events, csrf: 'CSRF token goes here'});
}


exports.GET_eventForm = function (req, res) {
    res.render('event', { csrf: 'CSRF token goes here'});
}

exports.api = {
    POST_eventForm: function (req, res) {
        console.log(req.body.event);
        console.log(req.body.description);
        console.log(req.body.venue);
        console.log(req.body.eventStart);
        console.log(req.body.eventEnd);

        let event = new EventModel({
            name: req.body.event,
            description: req.body.description,
            venue: req.body.venue,
            eventStart: req.body.eventStart,
            eventEnd: req.body.eventEnd,
        });

        event.save( function (err){
            if(err){
                console.log(err);
                res.status(500);
                res.send({ result: "Failed"});
            } else {
                res.send({ result: "Success" });
            }
        })
    }
}