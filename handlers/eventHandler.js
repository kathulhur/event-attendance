const mongoose = require('mongoose');
const EventModel = require('../models/eventModel');
const util = require('../utils/util');

exports.GET_events = async function(req, res) {
    let results = await EventModel.find();
    let events = results.map(result => ({
            name: result.name,
            slug: result.slug,
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

exports.GET_event = async function(req, res, next) {
    try{
        let result = await EventModel.find({slug: req.params.slug});
        if(result && result.length === 1){
            let event = {
                name: result[0].name,
                slug: result[0].slug,
                code: result[0].code,
                description: result[0].description,
                eventStart: result[0].eventStart.toLocaleString(),
                eventEnd: result[0].eventEnd.toLocaleString()
            }
            res.render('event', {event: event, csrf: 'CSRF token goes here'});
        } else {
            throw new Error('Error: Multiple result returned');
        }
    } catch (err) {
        if (err) next(err);
    }
    
}

exports.GET_eventForm = function (req, res) {
    res.render('eventForm', { csrf: 'CSRF token goes here'});
}

exports.api = {
    POST_eventForm: function (req, res) {
        
        let event = new EventModel({
            name: req.body.event,
            slug: util.slugify(req.body.event),
            code: util.getRandomInt(1000, 9999), 
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