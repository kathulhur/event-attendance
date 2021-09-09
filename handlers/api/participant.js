const mongoose          = require('mongoose');
const Participant  = require('../../models/Participant');
const Event        = require('../../models/Event');
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
                    await newParticipant.save();// save the new participant
                    event.update({// increment the participants counter
                        $inc: {
                            participants: 1
                        }
                    });
                    res.json({
                        participant: db.participant.filterParticipant(newParticipant)
                    });
                    
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

        if((participantId = db.isValidMongoId(req.params.participantId)) && (eventId = db.isValidMongoId(req.params.eventId))){
            try { // delete the object
                let deletedParticipant = await Participant.findByIdAndDelete(participantId);
                if(deletedParticipant){
                    await Event.findByIdAndUpdate(eventId, {
                        $inc: {
                            participants: -1
                        }
                    });
                    return res.json({ 
                            msg: "DELETE: Success",
                            participant: db.participant.filterParticipant(deletedParticipant)
                        });
                } else {
                    res.status(404).json({ msg: "DELETE: Participant not found."});
                }
                   
            } catch(err) {
                console.error("ERROR: " + err);
                return res.status(500).json({ msg: "DELETE: Error deletion."});
            }
        } else {
            return res.status(400).json({ msg: "DELETE: Invalid Id."});
        }

    },

    PUT_participant: async function(req, res) {
        
        if(db.isValidMongoId(req.body.id) && db.isValidMongoId(req.body.event)){
            try {
                let updatedParticipant = await db.participant.updateParticipantById(req.body);
                let event = await Event.findById(req.body.event);
                
                if(updatedParticipant) { // updated
                    res.json(
                    {
                        event: db.event.filterEvent(event),
                        participant: db.participant.filterParticipant(updatedParticipant),
                    });
                } else { // participant not found
                    res.status(404).json({ msg: "PUT: Participant not found."});
                }
            } catch(err) {
                console.log("Error: " + err);
                res.status(500).json({ msg: "PUT: Update error."});
            }
        } else {
            return res.json({msg: "Invalid ID" })
        }

    }
}



