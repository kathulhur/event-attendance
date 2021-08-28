const ParticipantModel = require('../models/participantModel');
const mongoose = require('mongoose');
const EventModel = require('../models/eventModel');
const modelUtil = require('../utils/modelUtil');

exports.GET_participants = async function (req, res) {
    console.log('GET_participants');
    let eventId;
    try{// check if the eventId is valid
        eventId = mongoose.Types.ObjectId(req.params.eventId);
    } catch (err) {
        console.log('Error: ' + err);
        res.status(404).json({ msg: "GET: Invalid Id"});
    }

    try {
        let event = await EventModel.findById(eventId).exec();
        let results = await ParticipantModel.find({ event: eventId }).exec();
        console.log(results);
        if(results.length == 0) {

            res.json({ msg: "GET: Empty data"});
            
        } else if (results) {
            console.log(results);
            res.render('participants', 
            {
                event: modelUtil.event.filterEvent(event),
                participants: modelUtil.participant.filterParticipants(results),
                csrf: 'CSRF token goes here'
            });

        } else {
            res.json({ msg: "GET: fix this"});
        }
    } catch(err) {
        console.log("Error: " + err);
        res.status(500).json({ msg: "GET: Error retrieving data"});
    }
}

exports.GET_participant = async function (req, res) {
    let eventId, participantId;
    try{// check if the IDs are valid
        eventId = mongoose.Types.ObjectId(req.params.eventId);
        participantId = mongoose.Types.ObjectId(req.params.participantId);
    } catch (err) {
        console.error('Error: ' + err);
        res.status(400).json({ msg: "GET: Invalid ID"});
        return;
    }

    try { // fetch the participant
        let participant = await ParticipantModel.findOne({ _id: participantId, event: eventId }).exec();
        console.log(participant);
        if(participant) {
            res.render('participant', { participant: modelUtil.participant.filterParticipant(participant)});
        } else {
            res.status(404).json({ msg: "GET: Participant not found."});
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json({ msg: "GET: Error fetching data."});
    }
}
