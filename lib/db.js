const mongoose          = require('mongoose');
const UserModel         = require('../models/User');
const EventModel        = require('../models/Event');
const ParticipantModel  = require('../models/Participant');
const slugify           = require('slugify');

const slugifyOption = {
    replacement: '-',
    strict: true,
    lower: true
};

exports.validateId = id => mongoose.Types.ObjectId(id);

exports.isValidMongoId = function(id) {
    try {
        return mongoose.Types.ObjectId(id);
    } catch(err) {
        return false;
    }
}

exports.toDatetimeLocal = function(date) {
    return date.toISOString().substring(0, date.toISOString().length - 1);
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
            slug: slugify(data.name, slugifyOption),
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

    updateParticipantById:  (data) => ParticipantModel.findByIdAndUpdate(
        { _id: data.id },
        { 
            name: data.name,
            age: data.age,
            course: data.course,
            institution: data.institution
        },
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
        slug: slugify(data.name, slugifyOption),
        start: data.start,
        end: data.end
    }),

    deleteEventById: async (eventId) => EventModel.findByIdAndDelete(eventId),

    updateEventById:  (data) => EventModel.findByIdAndUpdate(
        { _id: data.id },
        { 
            name: data.name,
            slug: slugify(data.name, slugifyOption),
            start: data.start,
            end: data.end
        },
        { new: true }
    ),
}

function filterEvent (event) {
    let result = {
        id: event._id.valueOf(),
        name: event.name,
        slug: event.slug,
        status: event.status,
        start: event.start.toString(),
        end: event.end.toString(),
        participants: event.participants
    }
    return result;
}

function filterParticipant (participant) {
    let filteredResult = {
        id: participant._id.valueOf(),
        event: participant.event.name ? filterEvent(participant.event) : participant.event,
        name: participant.name,
        slug: participant.slug,
        age: participant.age,
        course: participant.course,
        institution: participant.institution,
        registered: participant.registered
    }
    return filteredResult;
}






