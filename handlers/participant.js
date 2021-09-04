const mongoose = require('mongoose');
const ParticipantModel = require('../models/Participant');
const EventModel = require('../models/Event');
const modelUtil = require('../utils/modelUtil');
const db = require('../lib/db');

exports.GET_participants = async function (req, res) {// this handler is currently not in use
    let eventId;
    try{// check if the eventId is valid
        eventId = db.validateId(req.params.eventId);
    } catch (err) {
        console.log('Error: ' + err);
        res.status(404).json({ msg: "GET: Invalid Id"});
    }

    try {
        let event = await db.event.getEventById(eventId);
        let results = await ParticipantModel.find({ event: eventId }).exec();
        if(results.length == 0) {

            res.json({ msg: "GET: Empty data"});
            
        } else if (results) {
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
        eventId = db.validateId(req.params.eventId);
        participantId = db.validateId(req.params.participantId);
    } catch (err) {
        console.error('Error: ' + err);
        res.status(400).json({ msg: "GET: Invalid ID"});
        return;
    }

    try { // fetch the participant
        let participant = await db.participant.getParticipantById(participantId);
        if(participant) {
            res.render('participant', { participant: db.participant.filterParticipant(participant)});
        } else {
            res.status(404).json({ msg: "GET: Participant not found."});
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json({ msg: "GET: Error fetching data."});
    }
}

exports.GET_participantForm = async function(req, res, next) {
    let eventId;
    try{// checks if the id is valid
        eventId = db.validateId(req.params.eventId);
    } catch(err){
        console.log("Error: Invalid id - " + err);
        next(err);
        return;
    }

    try{
        let event = await db.event.getEventById(eventId);
        if(event) {// if returns a result
            res.render('participantForm', 
                { 
                    event: db.event.filterEvent(event),
                    _csrf: "CSRF token goes here",
                });
        } else {// returns null or identify
            res.status(500).json({ msg: "Query result to null. Debug this."});
        }
    } catch(err) {
        console.log("Error: " + err);
        next(err);
    }
    
}

exports.GET_participantEdit = async function (req ,res, next) {
    let eventId, participantId;
    try {// checks if the IDs are valid
        eventId = db.validateId(req.params.eventId);
        participantId = db.validateId(req.params.participantId);
    } catch(err) {
        console.log("Error : " + err);
    }

    try {
        let participant = await db.participant.getParticipantById(participantId);
        if(participant) {
            res.render('participantEdit', { participant: db.participant.filterParticipant(participant)})
        } else {
            next(err);
        }
    } catch (err) {
        console.log("Error: " + err);
        next(err);
    }
}
