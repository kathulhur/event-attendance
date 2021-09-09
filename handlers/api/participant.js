const mongoose          = require('mongoose');
const ParticipantModel  = require('../../models/Participant');
const EventModel        = require('../../models/Event');
const db                = require('../../lib/db');

exports.api = {
    GET_participants: async function (req, res) {
        try { // fetch participants
            let participants = await Participants.find();
            if (participants.length == 0) {// if no data
                res.json({ msg: "GET: No available data."});
            } else if (participants) {// if there are result
                let filteredParticipants = db.participant.filterParticipants(participants);
                res.json(filteredParticipants);
            } else {// results return null (or something that evaluates to false);
                res.status(500).json({ msg: "GET: FIX THIS!"});
            }
        } catch(err) {// on error
            console.error("Error: " + err);
            res.status(500).json({ msg: "GET: Error fetching data."});
        }
    },

    GET_eventParticipants: async function(req, res) {
        let eventId;;
        try {// checks whether the id is valid mongodb ObjectId
            eventId = db.validateId(req.params.eventId);
        } catch (err) {
            res.status(400).json({ msg: "Invalid event ID"});
        }

        try {// fetch the participants data
            let participants = await db.event.getEventParticipants(eventId);
            if(participants.length != 0) {
                res.json(db.participant.filterParticipants(participants));
            } else {
                res.status(404).json({ msg: "GET: No participants found."});
            }
            
        } catch(err) {
            console.error(err);
            res.status(500).json({ msg: "GET: Error querying the database."});
        }
    },

    POST_participant : async function (req, res) {
        let eventId;
        if(eventId = req.body.eventId = db.isValidMongoId(req.params.eventId)) {
            try {// find the event
                let event = await db.event.getEventById(eventId);
                if(event){// if event found, create the save the participant
                    let newParticipant = db.participant.createParticipant(req.body);
                    let participant = await newParticipant.save();
                    res.json(db.participant.filterParticipant(participant));
                    
                } else { //otherwise, return event not found
                    res.status(404).json({ msg: "POST: Event not found"});
                }
            } catch(err) {// failed retrieving the event
                console.log("Error: " + err);
                res.status(500).json({ msg: "An error occured while saving the data."});
            }
        } else {
            return res.status(400).json({ msg: "POST: Invalid event ID"});
        }

    },

    DELETE_participant: async function(req, res) {
        let participantId,
            eventId;

        try { //check if the IDs are valid
            participantId = db.validateId(req.params.participantId);
            eventId = db.validateId(req.params.eventId)
        } catch (err) {
            console.error("Error: " + err);
            res.status(400).json({ msg: "DELETE: Invalid Id."});
        }

        try { // delete the object
            let deletedParticipant = await db.participant.deleteParticipantById(participantId);
            if(deletedParticipant){
                res.json({ 
                        msg: "DELETE: Success",
                        participant: db.participant.filterParticipant(deletedParticipant)
                    });
            } else {
                res.status(404).json({ msg: "DELETE: Participant not found."});s
            }
               
        } catch(err) {
            console.error("ERROR: " + err);
            res.status(500).json({ msg: "DELETE: Error deletion."});
        }
    },

    PUT_participant: async function(req, res) {
        let participantId,
            eventId;
        try{// Valid ID
            participantId = db.validateId(req.params.participantId);
            eventId = db.validateId(req.params.eventId);
        } catch(err) {// Invalid ID
            console.log('Error: ' + err);
            res.status(400).json({ msg: "PUT: Invalid ID."});
        }

        try {
            let updatedParticipant = await db.participant.updateParticipantById(participantId, req.body);
            if(updatedParticipant) { // updated
                res.json(db.participant.filterParticipant(updatedParticipant));
            } else { // participant not found
                res.status(404).json({ msg: "PUT: Participant not found."});
            }
        } catch(err) {
            console.log("Error: " + err);
            res.status(500).json({ msg: "PUT: Update error."});
        }
    }
}



