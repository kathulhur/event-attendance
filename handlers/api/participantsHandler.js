const ParticipantModel = require('../../models/participantModel');
const EventModel = require('../../models/eventModel');
const mongoose = require('mongoose');
const modelUtil = require('../../utils/modelUtil');

exports.api = {
    GET_participants: async function (req, res) {
        try { // fetch participants
            let results = await ParticipantModel.find().exec();
            if (results.length == 0) {// if no data
                res.json({ msg: "GET: No available data."});
            } else if (results) {// if there are result
                let participants = modelUtil.participant.filterParticipants(results);
                res.json(participants);
            } else {// results return null (or something that evaluates to false);
                res.status(500).json({ msg: "GET: FIX THIS!"});
            }
        } catch(err) {// on error
            console.error("Error: " + err);
            res.status(500).json({ msg: "GET: Error fetching data."});
        }
    },

    GET_participant: async function(req, res) {
        let eventId;;
        try {// checks whether the id is valid mongodb ObjectId
            eventId = mongoose.Types.ObjectId(req.params.eventId);
        } catch (err) {
            res.status(400).json({ msg: "Invalid event ID"});
        }

        try {// fetch the participants data
            let results = await ParticipantModel.find({ event: eventId }).exec();
            if(results.length != 0) {
                res.json(modelUtil.participant.filterParticipants(results));
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
        try {// check if the id is valid
            eventId = mongoose.Types.ObjectId(req.params.eventId);
            req.body.eventId = eventId;// add the object id to the body for the filter
        } catch(err) {// invalid id
            console.error(err);
            res.status(400).json({ msg: "POST: Invalid event ID"});
            return;
        }

        try {// find the event
            let event = await EventModel.findById(eventId).exec();
            
            if(event){// if event found, create the save the participant
                let participant = modelUtil.participant.createParticipant(req.body);
                participant.save(function (err) {
                    if(err){// error saving
                        console.log("Error: " + err);
                        res.status(500).send({result: "POST: Failed saving participant data."});
                    } else {// saving success
                        res.json(modelUtil.participant.filterParticipant(participant));
                    }
                }); 
            } else { //otherwise, return event not found
                res.status(404).json({ msg: "POST: Event not found"});
            }
        } catch(err) {// failed retrieving the event
            console.log("Error: " + err);
            res.status(500).json({ msg: "An error occured while retrieving event."});
        }
    },

    DELETE_participant: async function(req, res) {
        let participantId,
            eventId;

        try { //check if the IDs are valid
            participantId = mongoose.Types.ObjectId(req.params.participantId);
            eventId = mongoose.Types.ObjectId(req.params.eventId)
        } catch (err) {
            console.error("Error: " + err);
            res.status(400).json({ msg: "DELETE: Invalid Id."});
        }

        try { // delete the object
            let deletedParticipant = await ParticipantModel.findOneAndDelete({_id: participantId, event: eventId}).exec();
            if(deletedParticipant){
                res.json({ msg: "DELETE: Success"});
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
            participantId = mongoose.Types.ObjectId(req.params.participantId);
            eventId = mongoose.Types.ObjectId(req.params.eventId);
        } catch(err) {// Invalid ID
            console.log('Error: ' + err);
            res.status(400).json({ msg: "PUT: Invalid ID."});
        }

        try {
            let updatedParticipant = await ParticipantModel.findOneAndUpdate(
                {_id: participantId, event: eventId},
                { name: req.body.name ? req.body.name : this.name},
                { new: true});

            if(updatedParticipant) { // updated
                res.json(modelUtil.participant.filterParticipant(updatedParticipant));
            } else { // participant not found
                res.status(404).json({ msg: "PUT: Participant not found."});
            }
        } catch(err) {
            console.log("Error: " + err);
            res.status(500).json({ msg: "PUT: Update error."});
        }
    }
}



