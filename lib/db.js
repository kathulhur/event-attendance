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
    filterUser: (data, authenticated) => {
        let filteredUser = {
            id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            isAuthenticated: authenticated
        }
        return filteredUser;
    }
}

exports.participant = {
    getParticipants: async () => ParticipantModel.find(),

    getParticipantById: async id => ParticipantModel.findById(id),

    getParticipant: async (participantSlug, eventSlug) => {
        let event = await this.event.getEventBySlug(eventSlug);
        console.log(event);
        if(event) {
            return participant = await ParticipantModel.findOne({ event: event._id, slug: participantSlug }).populate('event');
        } else {
            return null;
        }
    },

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

    filterParticipant: (participant) => {
        let filteredResult = {
            id: participant._id.valueOf(),
            event: participant.event.name ? this.event.filterEvent(participant.event) : participant.event,
            name: participant.name,
            slug: participant.slug,
            age: participant.age,
            course: participant.course,
            institution: participant.institution,
            registered: participant.registered
        }
        return filteredResult;
    },

    filterParticipants: participants => participants.map(this.participant.filterParticipant),

    modifyParticipant: (participant, body) => {
        participant.name = body.name ? body.name: participant.name;
        return participant;
    },

    deleteParticipant: async (participantId, eventId) => ParticipantModel.findOneAndDelete({_id: participantId, event: eventId}),

    updateParticipantById:  (data) => ParticipantModel.findByIdAndUpdate(
        { _id: data.id },
        { 
            name: data.name,
            slug: slugify(data.name, slugifyOption),
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
    
    getEventBySlug: async slug => EventModel.findOne({ slug: slug }),

    getEventParticipants: async eventId => ParticipantModel.find({event: eventId}),

    incrementEventParticipants: async eventId => EventModel.findByIdAndUpdate(
        eventId, 
        {// increment the participants counter by 1
            $inc: {
                participants: 1
            }
        }
    ),

    filterEvent: (event) => {
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
    },
    
    filterEvents: events => events.map(this.event.filterEvent),
    
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

    deleteEventById: async (eventId) => {
        let deletedEvent = await EventModel.findByIdAndDelete(eventId);
        let deletedParticipants = await ParticipantModel.deleteMany({ event: eventId });
        return { event: deletedEvent, participants: deletedParticipants };
    },

    updateEventById:  (data) => EventModel.findByIdAndUpdate(
        { _id: data.id },
        { 
            name: data.name,
            slug: slugify(data.name, slugifyOption),
            start: data.start,
            end: data.end,
            status: data.status
        },
        { new: true }
    ),

    getLatestEvent: async (limit) => EventModel.find({ status: 'incoming' }).sort({start: 1}).limit(3)
    
}










