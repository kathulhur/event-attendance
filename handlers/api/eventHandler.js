const mongoose = require('mongoose');
const EventModel = require('../../models/eventModel');
const util = require('../../utils/util');

exports.api = {
    GET_events: async function (req, res) {
        try {
            let results = await EventModel.find().exec();// get all the event records
            if (results.length == 0) {
                res.json({ msg: "GET: Empty data."});
            }else if (results) {// if there are results, filter the data to be passed
                let events = filterEvents(results);
                res.json(events);// return the filtered result

            } else {
                res.json({ msg: "GET: Something went wrong"});// No data in the database
            }
        } catch(err) {
            res.status(500).json({ msg: "Server error, please try again after a while."});// Server error
        }
    },

    GET_event: async function (req, res) {
        let eventId; 
        try { // check the validity of id
            eventId = mongoose.Types.ObjectId(req.params.eventId);
        } catch (err) {
            console.error("Error: " + err);
            res.status(400).json({ msg: "GET: InvalidID."})
        }

        try {
            let result = await EventModel.findById(eventId).exec();// get all the event records
            if(result) {// if there are results, filter the data to be passed
                let event = filterEvent(result);
                res.json(event);// return the filtered result
            } else {
                res.status(404).json({ msg: "GET: Data not found."});// No data in the database
            }
        } catch(err) {
            res.status(500).json({ msg: "GET: Server error, please try again after a while."});// Server error
        }
    },

    POST_eventForm: async function (req, res) {
        try {
            let event = createEvent(req.body)

            event = await event.save();
            res.json(filterEvent(event));

        } catch (err) {
            console.log("Error: " + err);
            res.status(500).json({ msg: "POST: Error saving data."});
        }
        
    },

    PUT_eventForm: async function (req, res) {
        try {
            let eventId;

            try {
                eventId = mongoose.Types.ObjectId(req.params.eventId);
            } catch {
                res.status(400).send({ msg: "Invalid ID"})
            }
            let event = await EventModel.findOne({ _id: eventId}).exec();

            if(event) {
                modifyEvent(event, req.body);

                event.save()
                .then( savedDoc => {
                    res.json(filterEvent(savedDoc));
                })
                .catch( err => {
                    console.log("Error: " + err);
                    res.status(400).json( {msg: "PUT: Error update request."});
                });
            } else {
                res.status(404).json( {msg: "PUT: No record match."});
            }
           
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json( {msg: "PUT: Error querying the database."});
        }
    },

    DELETE_event: async function (req, res) {
        let eventId = req.params.eventId;
        try {
            eventId = mongoose.Types.ObjectId(req.params.eventId);
        } catch(err) {
            console.error(err);
            res.status(400).json({ msg: "DELETE: Invalid Id"});
        }

        try {
            await EventModel.deleteOne({_id: eventId}).exec();
            res.json({ msg: "DELETE: Success" });
        } catch (err) {
            console.log("Error: " + err);
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
    }
    return result;
}

function modifyEvent(event, body) {   
    event.name = body.name ? body.name: event.name;
    return event;
}

function createEvent(body) {
    return new EventModel({
        name: body.name,
    });
}

