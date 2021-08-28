const mongoose = require('mongoose');
const EventModel = require('../models/eventModel');
const ParticipantModel = require('../models/participantModel');
function filterEvent(event) {
    let result = {
        id: event._id,
        name: event.name,
    }
    return result;
}

function filterEvents(events) {
    let filteredEvents = events.map(filterEvent);
    
    return filteredEvents;
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

function createParticipant(body) {
    return new ParticipantModel({
        event: mongoose.Types.ObjectId(body.eventId),
        name: body.name,
    });
}

function filterParticipant(participant) {
    let filteredResult = {
        id: participant._id,
        event: participant.event,
        name: participant.name,
    }
    return filteredResult;
}

function filterParticipants(participants) {
    return participants.map(filterParticipant);
}

function modifyParticipant(participant, body) {
    participant.name = body.name ? body.name: participant.name;
    return participant;
}

module.exports = { 
    event: {
        filterEvent, 
        filterEvents, 
        createEvent, 
        modifyEvent 
    },
    participant: {
        filterParticipant,
        filterParticipants,
        createParticipant,
        modifyParticipant
    }
}
