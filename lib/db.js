const mongoose          = require('mongoose');
const UserModel         = require('../models/User');
const EventModel        = require('../models/Event');
const ParticipantModel  = require('../models/Participant');

exports.validateId = id => mongoose.Types.ObjectId(id);

exports.user = {
    getUserById: async id => UserModel.findById(id),
    getUserByAuthId: async authId => UserModel.findOne({ authId }),
    addUser: async data => new UserModel(data).save(),
}

exports.participant = {
    getParticipants: async () => ParticipantModel.find(),

    getParticipantById: async id => ParticipantModel.findById(id),

    addParticipant: async data => new ParticipantModel.save(),

    createParticipant: data =>
        new ParticipantModel({
            event: mongoose.Types.ObjectId(body.eventId),
            name: body.name,
        }),

    filterParticipant: filterParticipant,

    filterParticipants: participants => participants.map(filterParticipant),

    modifyParticipant: (participant, body) => {
        participant.name = body.name ? body.name: participant.name;
        return participant;
    },

    deleteParticipantById: async (participantId) => ParticipantModel.findByIdAndDelete(participantId),

    updateParticipantById:  (id, data) => ParticipantModel.findByIdAndUpdate(
        { _id: id },
        { name: data.name},
        { new: true}
    ),

}


exports.event = {
    getEvents: async () => EventModel.find(),
    
    getEventById: async id => EventModel.findById(id),
    
    getEventParticipants: async eventId => ParticipantModel.find({event: eventId}),

    filterEvent: filterEvent,
    
    filterEvents: events => events.map(filterEvent),
    
    modifyEvent: (event, body) => {   
        event.name = body.name ? body.name: event.name;
        return event;
    },
    
    createEvent: body => 
    new EventModel({
        name: body.name,
    }),

    deleteEventById: async (eventId) => EventModel.findByIdAndDelete(eventId),

    updateEventById:  (id, data) => EventModel.findByIdAndUpdate(
        { _id: id },
        { name: data.name},
        { new: true }
    ),
}

function filterEvent (event) {
    let result = {
        id: event._id,
        name: event.name,
    }
    return result;
}

function filterParticipant (participant) {
    let filteredResult = {
        id: participant._id,
        event: participant.event,
        name: participant.name,
    }
    return filteredResult;
}






