const mongoose          = require('mongoose');
const UserModel         = require('../models/User');
const EventModel        = require('../models/Event');
const ParticipantModel  = require('../models/Participant');
const slugify           = require('slugify');

exports.validateId = id => mongoose.Types.ObjectId(id);

exports.isValidMongoId = function(id) {
    try {
        return mongoose.Types.ObjectId(id);
    } catch(err) {
        return false;
    }
}
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
            event: mongoose.Types.ObjectId(data.event),
            name: data.name,
            age: data.age,
            course: data.course,
            institution: data.institution,
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
    
    createEvent: data => 
    new EventModel({
        name: data.name,
        slug: slugify(data.name, 
        {
            replacement: '-',
            strict: true,
            lower: true
        }),
        start: data.start,
        end: data.end
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
        id: event.id,
        name: event.name,
        slug: event.slug,
        status: event.status,
        start: event.start.toString(),
        end: event.end.toString()
    }
    return result;
}

function filterParticipant (participant) {
    let filteredResult = {
        id: participant.id,
        event: participant.event,
        name: participant.name,
        age: participant.age,
        course: participant.course,
        institution: participant.institution,
        registered: participant.registered
    }
    return filteredResult;
}






