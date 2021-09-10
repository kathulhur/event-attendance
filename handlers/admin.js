const db = require('../lib/db');
const Participant = require('../models/Participant');
exports.index = function(req, res) {
    res.render('admin/dashboard', { name: req.user.name });
}

exports.events = async function(req, res, next) {
    try {
        let events = await db.event.getEvents();
        res.render('admin/events', { events: db.event.filterEvents(events) });
    } catch(err) {
        console.error("Error [/events]: " + err);
        return next(err);
    }
}

exports.eventForm = function(req, res) {
    return res.render('admin/eventCreate');
}

exports.eventSubmit = async function(req, res) {
    try {
        let newEvent = db.event.createEvent(req.body);
        await newEvent.save();
        return res.redirect(`/admin/events/${newEvent.slug}`);
    } catch(err) {
        console.error("Error [/events/create] " + err);
        return next(err);
    }
}

exports.event = async function (req, res, next) {

    try {// check the event if it exist
        let event = await db.event.getEventBySlug(req.params.eventSlug);
        if(event){
            let participants = await db.event.getEventParticipants(event._id);
            res.render('admin/event', 
            { 
                event: db.event.filterEvent(event),
                participants: db.participant.filterParticipants(participants)
            });
        } else {
            next(new Error("Event does not exist"));
        }
    } catch (err) {
        console.error('Error [/events/:eventSlug] ' + err);
        next(new Error("Server Error"));
    }
}

exports.eventEditForm = async function (req, res, next) {
    try {
        let event = await db.event.getEventBySlug(req.params.eventSlug);
        if(event) {
            let fEvent = {
                id: event._id,
                slug: event.slug,
                name: event.name,
                start: db.toDatetimeLocal(event.start),
                end: db.toDatetimeLocal(event.end)
            }
            return res.render('admin/eventEdit', { event: fEvent });
        } else {
            next(new Error('Event not found'));
        }
    } catch(err) {
        console.error('Error: [/events/:eventId/edit] ' + err);
        return next(err);
    }
}

exports.participantForm = async function(req, res, next) {
    try{
        let event = await db.event.getEventBySlug(req.params.eventSlug);
        return res.render('admin/participantCreate', { event: db.event.filterEvent(event) });
    } catch {
        console.error('Error [/events/:eventId/participants/create] ' + err);
        return next(err);
    }
}

exports.participantSubmit = async function(req, res, next) {
    try{
        let newParticipant = db.participant.createParticipant(req.body);
        await newParticipant.save();
        await db.event.incrementEventParticipants(req.body.event);
        return res.redirect(`/admin/events/${req.params.eventSlug}`);
    } catch(err) {
        console.error('Error [/events/:eventId/participants/create] ' + err);
        return next(err);
    }
}

exports.participant = async function(req, res, next) {
    let participantSlug = req.params.participantSlug;
    let eventSlug = req.params.eventSlug;
    try{
        let participant = await db.participant.getParticipant(participantSlug, eventSlug);
        if(participant){
            return res.render('admin/participant', 
            { 
                participant: db.participant.filterParticipant(participant),
            });
        } else {
            next(new Error('participant not found'))
        }
    } catch(err) {
        console.error("Error [/events/:eventSlug/participants/:participantSlug] " + err);
        return next(new Error("Server Error"));
    }
}

exports.participantEditForm = async function(req, res, next) {
    let eventSlug = req.params.eventSlug,
        participantSlug = req.params.participantSlug;
    try{
        let participant = await db.participant.getParticipant(participantSlug, eventSlug);
        if(participant) {
            return res.render('admin/participantEdit', { 
                participant: db.participant.filterParticipant(participant) 
            });
        } else {
            return next(new Error('Participant not found'));
        }
    } catch (err) {
        console.error('Error [/events/:eventSlug/participants/:participantSlug/edit] ' + err);
        return next(err);
    }
}