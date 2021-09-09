const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Participant = require('../models/Participant');

const db = require('../lib/db');

// Index page
router.get('/', function(req, res) {
    res.render('admin/dashboard', { name: req.user.name });
});


// Events list page
router.get('/events', async function(req, res, next) {
    try {
        let events = await Event.find();
        res.render('admin/events', { events: db.event.filterEvents(events) });
    } catch(err) {
        console.error("Error [/events]: " + err);
        return next(err);
    }
});

// Event form
router.get('/events/create', function(req, res) {
    return res.render('admin/eventCreate');
});

// Submit form
router.post('/events/create', async function(req, res) {
    try {
        let newEvent = db.event.createEvent(req.body);
        await newEvent.save();
        return res.redirect('/admin/events');
    } catch(err) {
        console.error("Error [/events/create] " + err);
        return next(err);
    }
    
});

// Event Details
router.get('/events/:eventSlug', async function (req, res, next) {

    try {// check the event if it exist
        let event = await Event.findOne({ slug: req.params.eventSlug});
        if(event){
            let participants = await Participant.find({ event: event.id });
            res.render('admin/event', 
            { 
                event: db.event.filterEvent(event),
                participants: db.participant.filterParticipants(participants)
            });
        } else {
            next(new Error("Event does not exist"));
        }
    } catch (err) {
        console.error('Error [/events/:eventId] ' + err);
        next(new Error("Server Error"));
    }
});

router.get('/events/:eventId/edit', async function (req, res, next) {
    try {
        let event = await Event.findById(req.params.eventId);
        if(event) {
            return res.render('admin/eventEdit', { event: db.event.filterEvent(event) });
        } else {
            next(new Error('Event not found'));
        }
    } catch(err) {
        console.error('Error: [/events/:eventId/edit] ' + err);
        return next(err);
    }
});

router.get('/events/:eventSlug/participants/create', async function(req, res, next) {
    try{
        let event = await Event.findOne({ slug: req.params.eventSlug });
        return res.render('admin/participantCreate', { event: db.event.filterEvent(event) });
    } catch {
        console.error('Error [/events/:eventId/participants/create] ' + err);
        return next(err);
    }
});

router.post('/events/:eventSlug/participants/create', async function(req, res, next) {
    try{
        let newParticipant = db.participant.createParticipant(req.body);
        await newParticipant.save();
        return res.redirect(`/admin/events/${req.params.eventSlug}`);
    } catch(err) {
        console.error('Error [/events/:eventId/participants/create] ' + err);
        return next(err);
    }
});

router.get('/events/:eventSlug/participants/:participantId', async function(req, res, next) {
    let participantId = req.params.participantId;
    let eventSlug = req.params.eventSlug;
    try{
        let event = await Event.findOne({ slug: eventSlug });
        let participant = await Participant.findById(participantId);
        console.log(event);
        console.log(participant);
        return res.render('admin/participant', 
        { 
            participant: db.participant.filterParticipant(participant),
            event: db.event.filterEvent(event)
        });
    } catch(err) {
        console.error("Error [/events/:eventId/participants/:participantId] " + err);
        next(new Error("Server Error"));
    }
});


router.get('/events/:eventId/participants/:participantId/edit', async function(req, res, next) {

    try{
        let participant = await db.participant.getParticipantById(req.params.participantId);
        return res.render('admin/participantEdit', { participant: db.participant.filterParticipant(participant) });
    } catch {
        console.error('Error [/events/:eventId/participants/:participantId/edit] ' + err);
        return next(err);
    }
});


module.exports = router;