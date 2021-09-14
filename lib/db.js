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
    getUser: (req) => {
        if(req.user){
            let user = this.user.filterUser(req.user);
            user.isAuthenticated = req.isAuthenticated();
            return user;
        } else {
            return null;
        }
    },
    getUserById: async id => UserModel.findById(id),
    getUserByAuthId: async authId => UserModel.findOne({ authId }),
    addUser: async data => new UserModel(data).save(),
    filterUser: (data) => {
        let filteredUser = {
            id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
        }
        return filteredUser;
    }
}

exports.participant = {
    getParticipants: async () => {
        let participants = await ParticipantModel.find();
        if(participants.length) {
            return this.participant.filterParticipants(participants); 
        } else {
            return null;
        }
    },

    getParticipantById: async id => ParticipantModel.findById(id),

    getParticipant: async (participantSlug, eventSlug) => {
        let event = await this.event.getEventBySlug(eventSlug);
        if(event) {
            let participant = await ParticipantModel.findOne({ event: event.id, slug: participantSlug }).populate('event');
            return this.participant.filterParticipant(participant);
        } else {
            return null;
        }
    },

    addParticipant: async data => new ParticipantModel.save(),

    createParticipant: async (data) => {
        let newParticipant = await new ParticipantModel({
            event: mongoose.Types.ObjectId(data.event),
            name: data.name,
            slug: slugify(data.name, slugifyOption),
            age: data.age,
            course: data.course,
            institution: data.institution,
        }).save()
        
        await this.event.incrementEventParticipants(data.event, 1);
        return this.participant.filterParticipant(newParticipant);
    },

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

    deleteParticipant: async (participantId, eventId) => {
        let deletedParticipant = await ParticipantModel.findOneAndDelete({_id: participantId, event: eventId});
        if(deletedParticipant) {
            await this.event.incrementEventParticipants(eventId, -1);
            return this.participant.filterParticipant(deletedParticipant);
        } else {
            return null;
        }
    },

    updateParticipantById:  async (data) => {
        let updatedParticipant = await ParticipantModel.findByIdAndUpdate(
            { _id: data.id },
            { 
                name: data.name,
                slug: slugify(data.name, slugifyOption),
                age: data.age,
                course: data.course,
                institution: data.institution
            },
            { new: true});
        if(updatedParticipant){
            return this.participant.filterParticipant(await updatedParticipant.populate('event'));
        } else {
            return null;
        }
    },

}


exports.event = {
    getEvents: async () => {
        let events = await EventModel.find();
        if(events.length) {
            return this.event.filterEvents(events);
        } else {
            return null;
        }
    },

    getOngoingEvents: async (limit) => {
        let events;
        if(limit) {
            events = await EventModel.find({ $and : 
                [
                    { start: { $lte: Date.now() } },
                    { end: { $gte: Date.now() } }
                ]
            }).sort({start: 'asc'}).limit(limit);
        } else {
            events = await EventModel.find({ $and : 
                [
                    { start: { $lte: Date.now() } },
                    { end: { $gte: Date.now() } }
                ]
            }).sort({start: 'asc'}).limit(limit);
        }

        if(events.length) {
            return this.events.filterEvents(events);
        } else {
            return null;
        }
    },
    
    getIncomingEvents: async (limit) => {
        let events;
        if(limit) {
            events = await EventModel.find({ start: { $gte: Date.now() } }).sort({start: 'asc'}).limit(limit);
        } else {
            events = await EventModel.find({ start: { $gte: Date.now() } }).sort({start: 'asc'});
        }

        if(events.length) {
            return this.event.filterEvents(events);
        } else {
            return null;
        }
    },

    getPastEvents: async(limit) => {
        let events;
        if(limit) {
            events = await EventModel.find({ end: { $lt: Date.now() }}).sort({end: 'desc'}).limit(limit);
        } else {
            events = await EventModel.find({ end: { $lt: Date.now() }}).sort({end: 'desc'});
        }

        if(events.length) {
            return this.event.filterEvents(events);
        } else {
            return null;
        }
    },
    
    getEventById: async id => {
        let event = await EventModel.findById(id);
        if(event) {
            return this.event.filterEvent(event);
        } else {
            return null;
        }
    },
    
    getEventBySlug: async slug => {
        let event = await EventModel.findOne({ slug: slug });
        if(event) {
            return this.event.filterEvent(event);
        } else {
            return null;
        }
    },

    getEventParticipants: async eventId => {
        let participants = await ParticipantModel.find({event: eventId});
        if(participants.length) {
            return this.participant.filterParticipants(participants);
        } else {
            return null;
        }
    },

    incrementEventParticipants: async (eventId, value) => // increment the participants counter by 1,
        EventModel.findById(eventId).update({ $inc: { participants: value } }),

    filterEvent: (event) => {
        let result = {
            id: event._id.valueOf(),
            name: event.name,
            slug: event.slug,
            status: event.status,
            start: event.start,
            end: event.end,
            participants: event.participants
        }
        return result;
    },
    
    filterEvents: events => events.map(this.event.filterEvent),

    
    createEvent: async (data) => {
        let newEvent = await new EventModel({
            name: data.name,
            slug: slugify(data.name, slugifyOption),
            start: data.start,
            end: data.end
        }).save();
        return this.event.filterEvent(newEvent);
    },

    deleteEventById: async (eventId) => {
        let deletedEvent = await EventModel.findByIdAndDelete(eventId);
        if(deletedEvent) {
            let deletedParticipants = await ParticipantModel.deleteMany({ event: eventId });
            return { event: this.event.filterEvent(deletedEvent), participants: deletedParticipants };
        } else {
            return null;
        }
        
    },

    updateEventById:  async (data) => {
        let updatedEvent = await EventModel.findByIdAndUpdate(
        { _id: data.id },
        { 
            name: data.name,
            slug: slugify(data.name, slugifyOption),
            start: data.start,
            end: data.end,
            status: data.status
        },
        { new: true });
        
        if(updatedEvent) {
            return this.event.filterEvent(updatedEvent);
        } else {
            return null;
        }
    },

    getLatestEvents: async (limit) => {
        let events = await EventModel.find({ status: 'incoming' }).sort({start: 1}).limit(limit);
        if(events.length) {
            return this.event.filterEvents(events);
        } else {
            return null;
        }
    }
    
}










