const mongoose = require('mongoose');
const EventModel = require('../../models/Event');
const modelUtil = require('../../utils/modelUtil');
const db = require('../../lib/db');

exports.api = {
    GET_events: async function (req, res) {
        try {
            let events = await db.event.getEvents();// get all the event records
            if (events.length == 0) {
                res.json({ msg: "GET: Empty data."});
            }else if (events) {// if there are results, filter the data to be passed
                res.json(db.event.filterEvents(events));// return the filtered result

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
            eventId = db.validateId(req.params.eventId);
        } catch (err) {
            console.error("Error: " + err);
            res.status(400).json({ msg: "GET: InvalidID."})
        }

        try {
            let event = await db.event.getEventById(eventId);// get all the event records

            if(event) {// if there are results, filter the data to be passed
                res.json(db.event.filterEvent(event));// return the filtered result
            } else {
                res.status(404).json({ msg: "GET: Data not found."});// No data in the database
            }
        } catch(err) {
            res.status(500).json({ msg: "GET: Server error, please try again after a while."});// Server error
        }
    },

    POST_eventForm: async function (req, res) {
        try {
            let event = db.event.createEvent(req.body)
            event = await event.save();
            res.json(db.event.filterEvent(event));
        } catch (err) {
            console.error("Error: " + err);
            res.status(500).json({ msg: "POST: Error saving data."});
        }
        
    },

    PUT_event: async function (req, res) {
        let eventId;
        try {// check if the id is valid
            eventId = db.validateId(req.params.eventId);
        } catch {
            res.status(400).send({ msg: "Invalid ID"});
            return;
        }

        try {//
            let event = await db.event.getEventById(eventId);

            if(event) {
                let event = await db.event.updateEventById(eventId, req.body);
                res.json(db.event.filterEvent(event));
            } else {
                res.status(404).json({msg: "PUT: No record match."});
            }
           
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json( {msg: "PUT: Error querying the database."});
        }
    },

    DELETE_event: async function (req, res) {
        let eventId;
        try {
            eventId = db.validateId(req.params.eventId);
        } catch(err) {
            console.error(err);
            res.status(400).json({ msg: "DELETE: Invalid Id"});
        }

        try {
            let event = await db.event.deleteEventById(eventId);
            if(event) {
                res.json({ 
                    msg: "DELETE: Success",
                    event: db.event.filterEvent(event)
                });
            } else {
                res.status(404).json({msg: "Event not found."});
            }
        } catch (err) {
            console.log("Error: " + err);
            res.status(500).json({ msg: "DELETE: Deletion failed."});
        }
    }
}





