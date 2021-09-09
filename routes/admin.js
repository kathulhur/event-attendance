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
        return res.render('admin/event', {
            event: db.event.filterEvent(newEvent)
        });
    } catch(err) {
        console.error("Error [/events/create] " + err);
        return next(err);
    }
    
});

// Event Details
router.get('/events/:eventSlug', async function (req, res, next) {

    try {// check the event if it exist
        let event = await Event.findOne({ slug: req.params.eventSlug}).lean();
        if(event){
            let participants = await Participant.find({ event: event._id }).lean();
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
});

router.get('/events/:eventSlug/edit', async function (req, res, next) {
    try {
        let event = await Event.findOne({ slug: req.params.eventSlug }).lean();
        console.log(event);
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
        await Event.findByIdAndUpdate(req.body.event, {// increment the participants counter by 1
            $inc: {
                participants: 1
            }
        });
        await newParticipant.save();
        return res.redirect(`/admin/events/${req.params.eventSlug}`);
    } catch(err) {
        console.error('Error [/events/:eventId/participants/create] ' + err);
        return next(err);
    }
});

router.get('/events/:eventSlug/participants/:participantSlug', async function(req, res, next) {
    let participantSlug = req.params.participantSlug;
    let eventSlug = req.params.eventSlug;
    try{
        let participant = await Participant.findOne({slug: participantSlug}).populate('event').lean();
        return res.render('admin/participant', 
        { 
            participant: db.participant.filterParticipant(participant),
        });
    } catch(err) {
        console.error("Error [/events/:eventId/participants/:participantId] " + err);
        return next(new Error("Server Error"));
    }
});


router.get('/events/:eventSlug/participants/:participantSlug/edit', async function(req, res, next) {

    try{
        let participant = await Participant.findOne({ slug: req.params.participantSlug }).populate('event').lean();
        console.log(participant.event._id.str)
        return res.render('admin/participantEdit', { 
            participant: db.participant.filterParticipant(participant) 
        });
    } catch {
        console.error('Error [/events/:eventId/participants/:participantId/edit] ' + err);
        return next(err);
    }
});


module.exports = router;