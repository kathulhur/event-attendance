const mongoose = require('mongoose');
const Event = require('../../models/Event');
const db = require('../../lib/db');

exports.api = {
    GET_events: async function (req, res) {
        try {
            let events = await Event.find();// get all the event records
            if (events.length == 0) {
                return res.json({ msg: "GET: Empty data."});
            }else if (events) {// if there are results, filter the data to be passed
                return res.json({
                    event: db.event.filterEvents(events)
                });// return the filtered result

            } else {
                return res.json({ msg: "GET: Something went wrong"});// No data in the database
            }
        } catch(err) {
            return res.status(500).json({ msg: "Server error, please try again after a while."});// Server error
        }
    },

    GET_event: async function (req, res) {
        if(!db.isValidMongoId(req.params.eventId)){
            try {
                let event = await db.event.getEventById(eventId);// get all the event records
    
                if(event) {// if there are results, filter the data to be passed
                    return res.json({
                        event: db.event.filterEvent(event)
                    });// return the filtered result
                } else {
                    return res.status(404).json({ msg: "GET: Data not found."});// No data in the database
                }
            } catch(err) {
                return res.status(500).json({ msg: "GET: Server error, please try again after a while."});// Server error
            }
        } else {
            return res.status(400).json({ msg: "GET: Invalid ID."});
        }

    },

    POST_eventForm: async function (req, res) {
        try {
            let event = db.event.createEvent(req.body)
            event = await event.save();
            return res.json({
                event: db.event.filterEvent(event)
            });
        } catch (err) {
            console.error("Error: " + err);
            res.status(500).json({ msg: "POST: Error saving data."});
        }
        
    },

    PUT_event: async function (req, res) {
        let eventId;

        if(eventId = db.isValidMongoId(req.body.id)){
            try {//
                let event = await Event.findById(eventId);
                console.log(event);
                if(event) {
                    let event = await db.event.updateEventById(req.body);
                    return res.json({
                        event: db.event.filterEvent(event)
                    });
                } else {
                    return res.status(404).json({msg: "PUT: No record match."});
                }
               
            } catch (err) {
                console.log("Error: " + err);
                res.status(500).json({ msg: "PUT: Error querying the database." });
            }
        } else {
            return res.status(400).send({ msg: "Invalid ID" });
        }

    },

    DELETE_event: async function (req, res) {
        let eventId;
        if(eventId = db.isValidMongoId(req.params.eventId)) {
            try {
                let event = await Event.findByIdAndDelete(eventId);
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
        } else {
            res.status(404).json({msg: "Invalid Id"});
        }

    }
}





