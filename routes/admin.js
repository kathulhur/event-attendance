const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Participant = require('../models/Participant');

const db = require('../lib/db');

// Index page
router.get('/', function(req, res) {
    res.render('admin/dashboard', { name: req.user.name });
});



router.get('/events', async function(req, res, next) {
    try {
        let events = await Event.find();
        res.render('admin/events', { events: db.event.filterEvents(events) });
    } catch(err) {
        console.error("Error [/events]: " + err);
        return next(err);
    }
});

router.get('/events/create', function(req, res) {
    return res.render('admin/eventCreate');
});

router.post('/events/create', async function(req, res) {
    try {
        let newEvent = db.event.createEvent(req.body);
        newEvent.save();
        return res.redirect('/admin/events');
    } catch(err) {
        console.error("Error [/events/create] " + err);
        return next(err);
    }
    
});

router.get('/events/:eventId', async function (req, res, next) {
    let eventId = req.params.eventId;

    try {// check the event if it exist
        let event = await Event.findById(eventId);
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

router.get('/events/:eventId/participants/create', async function(req, res, next) {
    console.log(req.params.eventId);
    try{
        let event = await db.event.getEventById(db.validateId(req.params.eventId));
        return res.render('admin/participantCreate', { event: db.event.filterEvent(event) });
    } catch {
        console.error('Error [/events/:eventId/participants/create] ' + err);
        return next(err);
    }
});

router.get('/events/:eventId/participants/:participantId', async function(req, res, next) {
    let eventId = req.params.eventId, 
        participantId = req.params.participantId;
    try{
        let participant = await Participant.findById(participantId);
        res.render('admin/participant', { participant: db.participant.filterParticipant(participant) });
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