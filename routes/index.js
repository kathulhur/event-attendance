var express = require('express');
var router = express.Router();
const indexHandler = require('../handlers/index');
const db = require('../lib/db');


/* GET home page. */
router.get('/', async function(req, res, next) {
    let ongoingEvents = await db.event.getOngoingEvents(3);
    let incomingEvents = await db.event.getIncomingEvents(3);
    let pastEvents = await db.event.getPastEvents(3);

    return res.render('index', { 
        ongoingEvents: ongoingEvents,
        incomingEvents: incomingEvents,
        pastEvents: pastEvents
    });

});

router.get('/events', async function(req, res, next) {
    let user = db.user.getUser(req);
    try {
        let incomingEvents = await db.event.getIncomingEvents();
        let pastEvents = await db.event.getPastEvents();
        let ongoingEvents = await db.event.getOngoingEvents();
        res.render('events', {
            incomingEvents: incomingEvents,
            pastEvents: pastEvents,
            ongoingEvents: ongoingEvents
        });

    } catch(err) {
        console.error('Error: [/events]: ' + err);
        next(err);
    }
});

router.get('/events/ongoing', async function(req, res, next) {
    let user = db.user.getUser(req);
    try {
        let ongoingEvents = await db.event.getOngoingEvents();
        res.render('ongoing', {
            ongoingEvents: ongoingEvents
        });

    } catch(err) {
        console.error('Error: [/events/ongoing]: ' + err);
        next(err);
    }
});

router.get('/events/incoming', async function(req, res, next) {
    let user = db.user.getUser(req);
    try {
        let incomingEvents = await db.event.getIncomingEvents();
        res.render('incoming', {
            incomingEvents: incomingEvents
        });

    } catch(err) {
        console.error('Error: [/events/incoming]: ' + err);
        next(err);
    }
});

router.get('/events/past', async function(req, res, next) {
    let user = db.user.getUser(req);
    try {
        let pastEvents = await db.event.getPastEvents();
        res.render('past', {
            pastEvents: pastEvents
        });

    } catch(err) {
        console.error('Error: [/events/past]: ' + err);
        next(err);
    }
});

router.get('/events/:eventSlug', async function(req, res) {
    let event = await db.event.getEventBySlug(req.params.eventSlug);
    console.log(event);
    res.render('event', {event: event});

});

router.post('/events/:eventSlug', indexHandler.register);


module.exports = router;
