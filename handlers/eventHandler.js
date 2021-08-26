const mongoose = require('mongoose');
const EventModel = require('../models/eventModel');
const util = require('../utils/util');

exports.GET_events = async function(req, res) {
    let results = await EventModel.find().exec();
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
        let result = await EventModel.find({slug: req.params.slug}).exec();
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



function filterEvents(events) {
    let filteredEvents = events.map(filterEvent);
    
    return filteredEvents;
}

function filterEvent(event) {
    let result = {
        name: event.name,
        slug: event.slug,
        code: event.code,
        description: event.description,
        eventStart: event.eventStart.toLocaleString(),
        eventEnd: event.eventEnd.toLocaleString()
    }
    return result;
}

exports.api = {
    GET_events: async function (req, res) {
        try {
            let results = await EventModel.find().exec();// get all the event records
            console.log(results);
            if(results) {// if there are results, filter the data to be passed
                let events = filterEvents(results);
                res.json(events);// return the filtered result

            } else {
                res.json({ msg: "The database is empty."});// No data in the database
            }
        } catch(err) {
            res.status(500).json({ msg: "Server error, please try again after a while."});// Server error
        }
    },

    POST_eventForm: async function (req, res) {
        try {
            let body = req.body;
            console.log(body);
            let event = new EventModel({
                name: body.name,
                slug: util.slugify(body.name),
                code: util.getRandomInt(1000, 9999),
                description: body.description,
                venue: body.venue,
                eventStart: body.eventStart,
                eventEnd: body.eventEnd
            });
    
            event = await event.save();
            res.json(filterEvent(event));

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "POST: Error saving data."});
        }
        
    },

    PUT_eventForm: async function (req, res) {
        try {
            console.log(req.params.id);
            let event = await EventModel.findOne({ _id: mongoose.Types.ObjectId(req.params.id)}).exec();
            if(event) {
                let body = req.body;    
                event.name = body.name ? body.name: event.name;
                event.description = body.description ? body.description : event.description;
                event.venue = body.venue ? body.venue : event.venue;
                event.eventStart = body.eventStart ? body.eventStart : event.eventStart;
                event.eventEnd = body.eventEnd ? body.eventEnd : event.eventEnd;
                console.log(event);

                event.save()
                .then( savedDoc => {
                    console.log('success');
                    res.json(filterEvent(savedDoc));
                })
                .catch( err => {
                    console.log(err);
                    res.status(400).json( {msg: "PUT: Error update request."});
                });
            } else {
                console.log(err);
                    res.status(400).json( {msg: "PUT: No record match."});
            }
           
        } catch (err) {
            console.log(err);
            res.status(400).json( {msg: "PUT: Error querying the database."});
        }
    },

    DELETE_event: async function (req, res) {
        try {
            await EventModel.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)}).exec();
            res.json({ msg: "DELETE: Success" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "DELETE: Deletion failed."});
        }
    }
}
