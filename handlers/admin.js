const db = require('../lib/db');
const Participant = require('../models/Participant');

exports.index = function(req, res) {
    let user = db.user.getUser(req);
    res.render('admin/dashboard', { name: user });
}

exports.events = async function(req, res, next) {
    try {
        let events = await db.event.getEvents();
        res.render('admin/events', { events: events });
    } catch(err) {
        console.error("Error [/events]: " + err);
        return next(err);
    }
}

exports.eventForm = function(req, res) {
    return res.render('admin/eventCreate');// render event form
}

exports.eventSubmit = async function(req, res, next) {
    try {// submit event form
        let newEvent = await db.event.createEvent(req.body);
        return res.redirect(`/admin/events/${newEvent.slug}`);
    } catch(err) {// on error
        console.error("Error [/events/create] " + err);
        return next(err);
    }
}

exports.event = async function (req, res, next) {

    try {// check the event if it exist
        let event = await db.event.getEventBySlug(req.params.eventSlug);
        if(event) {// event found, render
            let participants = await db.event.getEventParticipants(event.id);
            res.render('admin/event', 
            { 
                event: event,
                participants: participants
            });
        } else {// event not found
            next(new Error('Event does not exist'));
        }
    } catch (err) {// on error
        console.error('Error [/events/:eventSlug] ' + err);
        next(new Error("Server Error"));
    }
}

exports.eventEditForm = async function (req, res, next) {
    try {
        let event = await db.event.getEventBySlug(req.params.eventSlug);
        if(event) {// event found, render form
            let fEvent = {
                id: event.id,
                slug: event.slug,
                name: event.name,
                start: db.toDatetimeLocal(event.start),
                end: db.toDatetimeLocal(event.end),
                status: event.status,
            }
            return res.render('admin/eventEdit', { event: fEvent });
        } else {// event not found
            next(new Error('Event not found'));
        }
    } catch(err) {// on error
        console.error('Error: [/events/:eventSlug/edit] ' + err);
        return next(err);
    }
}

exports.participantForm = async function(req, res, next) {
    try{
        let event = await db.event.getEventBySlug(req.params.eventSlug);
        if(event) {// event found, render form
            return res.render('admin/participantCreate', { event: event });
        } else {// event does not exist
            return next(new Error("Event does not exist"));
        }
    } catch (err){// on error
        console.error('Error [/events/:eventSlug/participants/create] ' + err);
        return next(err);
    }
}

exports.participantSubmit = async function(req, res, next) {
    try{
        let event = db.event.getEventById(req.body.event);
        if(event) {// event found, create the participant and redirect
            await db.participant.createParticipant(req.body, event);
            return res.redirect(`/admin/events/${req.params.eventSlug}`);
        } else {// event not found
            return res.status(404).json({ msg: 'POST: Event does not exist '});
        }
    } catch(err) {// on error
        console.error('Error [/events/:eventSlug/participants/create] ' + err);
        return next(err);
    }
}

exports.participant = async function(req, res, next) {
    let participantSlug = req.params.participantSlug;
    let eventSlug = req.params.eventSlug;
    try{
        let participant = await db.participant.getParticipant(participantSlug, eventSlug);
        if(participant){// participant found, render
            return res.render('admin/participant', 
            { 
                participant: participant
            });
        } else {// participant not found
            next(new Error('participant not found'))
        }
    } catch(err) {// on error
        console.error("Error [/events/:eventSlug/participants/:participantSlug] " + err);
        return next(new Error("Server Error"));
    }
}

exports.participantEditForm = async function(req, res, next) {
    let eventSlug = req.params.eventSlug,
        participantSlug = req.params.participantSlug;
    try{
        let participant = await db.participant.getParticipant(participantSlug, eventSlug);
        if(participant) {// participant found, render
            return res.render('admin/participantEdit', { 
                participant: participant
            });
        } else {// participant not found,
            return next(new Error('Participant not found'));
        }
    } catch (err) {// On error
        console.error('Error [/events/:eventSlug/participants/:participantSlug/edit] ' + err);
        return next(err);
    }
}