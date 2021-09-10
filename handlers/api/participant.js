const mongoose          = require('mongoose');
const Participant  = require('../../models/Participant');
const Event        = require('../../models/Event');
const db                = require('../../lib/db');

exports.api = {
    GET_participants: async function (req, res) {
        try { // fetch participants
            let participants = await db.participant.getParticipants();
            if (participants) {// participants found
                return res.json({ participants: participants});
            } else {// The query return nothing (probably there's no records)
                return res.status(404).json({ msg: "GET: No available data."});
            }
        } catch(err) {// on error
            console.error("Error: " + err);
            return res.status(500).json({ msg: "GET: Error fetching data."});
        }
    },

    GET_eventParticipants: async function(req, res) {
        let eventId;;
  
        if(eventId = db.isValidMongoId(req.params.eventId)){
            try {// fetch the participants data
                let participants = await db.event.getEventParticipants(eventId);
                if(participants) {// participants found
                    return res.json({
                        participants: participants
                    });
                } else {// nothing were found
                    return res.status(404).json({ msg: "GET: No participants found."});
                }
            } catch(err) {// on error
                console.error(err);
                return res.status(500).json({ msg: "GET: Error querying the database."});
            }
        } else {// invalid id
            res.status(400).json({ msg: "Invalid Id"});
        }
    },

    POST_participant : async function (req, res) {
        let eventId;
        if(eventId = req.body.eventId = db.isValidMongoId(req.params.eventId)) {
            try {
                let event = await db.event.getEventById(eventId);// find the event
                if(event){// if event found, create and save the participant
                    let newParticipant = await db.participant.createParticipant(req.body);
                    if(newParticipant) {// participant created
                        res.json({
                            participant: newParticipant
                        });
                    } else {// mysterious error
                        res.json({ msg: "POST: Something went wrong. Saving failed. "});
                    }
                } else { // Event does not exist with the given id
                    res.status(404).json({ msg: "POST: Event does not exist"});
                }
            } catch(err) {// failed retrieving the event
                console.log("Error: " + err);
                res.status(500).json({ msg: "An error occured while saving the data."});
            }
        } else {// Invalid id
            return res.status(400).json({ msg: "POST: Invalid event ID"});
        }

    },

    DELETE_participant: async function(req, res) {
        let participantId,
            eventId;

        if((participantId = db.isValidMongoId(req.params.participantId)) && (eventId = db.isValidMongoId(req.params.eventId))){
            try {
                let event = await db.event.getEventById(eventId);
                if(event){// checks if the event exists with the given id
                    let deletedParticipant = await db.participant.deleteParticipant(participantId, eventId);
                    if(deletedParticipant){// delete successful
                        return res.json({ 
                                msg: "DELETE: Success",
                                participant: deletedParticipant
                            });
                    } else {// participant not found
                        return res.status(404).json({ msg: "DELETE: Participant not found."});
                    }
                } else {// event does not exist 
                    return res.status(404).json({ msg: "DELETE: Event does not exist"});
                }
                   
            } catch(err) {// on error
                console.error("ERROR: " + err);
                return res.status(500).json({ msg: "DELETE: Error deletion."});
            }
        } else {// invalid id
            return res.status(400).json({ msg: "DELETE: Invalid Id."});
        }

    },

    PUT_participant: async function(req, res) {
        let participantId, eventId;
        if((participantId = db.isValidMongoId(req.body.id)) && (eventId = db.isValidMongoId(req.body.event))){
            try {
                let event = await db.event.getEventById(eventId);
                if(event){// check if the event does exist with the given id
                    let updatedParticipant = await db.participant.updateParticipantById(req.body);
                    if(updatedParticipant) { // updated
                        res.json(
                        {
                            event: event,
                            participant: updatedParticipant,
                        });
                    } else { // participant not found
                        res.status(404).json({ msg: "PUT: Participant not found."});
                    }
                } else {// event does not exist
                    res.status(404).json({ msg: "PUT: Event does not exist"});
                }

            } catch(err) {// on error
                console.log("Error: " + err);
                res.status(500).json({ msg: "PUT: Update error."});
            }
        } else {// invalid id
            return res.json({msg: "Invalid ID" })
        }

    }
}



