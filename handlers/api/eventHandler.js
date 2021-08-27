const mongoose = require('mongoose');
const EventModel = require('../../models/eventModel');
const util = require('../../utils/util');

exports.api = {
    GET_events: async function (req, res) {
        try {
            let results = await EventModel.find().exec();// get all the event records
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
            let event = createEvent(req.body)

            event = await event.save();
            res.json(filterEvent(event));

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "POST: Error saving data."});
        }
        
    },

    PUT_eventForm: async function (req, res) {
        try {
            let id;

            try {
                id = mongoose.Types.ObjectId(req.params.id);
            } catch {
                res.status(400).send({ msg: "Invalid ID"})
            }

            let event = await EventModel.findOne({ _id: id}).exec();
            if(event) {
                modifyEvent(event, req.body);

                event.save()
                .then( savedDoc => {
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
        let eventId = req.params.id;
        try {
            eventId = mongoose.Types.ObjectId(req.params.id);
        } catch(err) {
            console.error(err);
            res.status(400).json({ msg: "DELETE: Invalid Id"});
        }

        try {
            await EventModel.deleteOne({_id: eventId}).exec();
            res.json({ msg: "DELETE: Success" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "DELETE: Deletion failed."});
        }
    }
}



function filterEvents(events) {
    let filteredEvents = events.map(filterEvent);
    
    return filteredEvents;
}

function filterEvent(event) {
    let result = {
        id: event._id,
        name: event.name,
        slug: event.slug,
        code: event.code,
        description: event.description,
        eventStart: event.eventStart.toString(),
        eventEnd: event.eventEnd.toString()
    }
    return result;
}

function modifyEvent(event, body) {   
    event.name = body.name ? body.name: event.name;
    event.description = body.description ? body.description : event.description;
    event.venue = body.venue ? body.venue : event.venue;
    event.eventStart = body.eventStart ? new Date(body.eventStart) : event.eventStart;
    event.eventEnd = body.eventEnd ? new Date(body.eventEnd) : event.eventEnd;
    return event;
}

function createEvent(body) {
    console.log(body.eventStart + " - " + body.eventEnd);
    return new EventModel({
        name: body.name,
        slug: util.slugify(body.name),
        code: util.getRandomInt(1000, 9999),
        description: body.description,
        venue: body.venue,
        eventStart: new Date(body.eventStart),
        eventEnd: new Date(body.eventEnd)
    });
}

