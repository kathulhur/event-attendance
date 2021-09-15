var express = require('express');
var router = express.Router();
const indexHandler = require('../handlers/index');
const db = require('../lib/db');


/* GET home page. */
router.get('/', async function(req, res, next) {
    let ongoingEvents = await db.event.getOngoingEvents(1);
    let upcomingEvents = await db.event.getUpcomingEvents(1);
    let pastEvents = await db.event.getPastEvents(1);

    return res.render('index', { 
        ongoingEvents: ongoingEvents,
        upcomingEvents: upcomingEvents,
        pastEvents: pastEvents
    });

});

router.get('/events', async function(req, res, next) {
    let user = db.user.getUser(req);
    try {
        let upcomingEvents = await db.event.getUpcomingEvents();
        let pastEvents = await db.event.getPastEvents();
        let ongoingEvents = await db.event.getOngoingEvents();
        return res.render('events', {
            upcomingEvents: upcomingEvents,
            pastEvents: pastEvents,
            ongoingEvents: ongoingEvents
        });

    } catch(err) {
        console.error('Error: [/events]: ' + err);
        return next(err);
    }
});

router.get('/events/ongoing', async function(req, res, next) {
    let user = db.user.getUser(req);
    try {
        let ongoingEvents = await db.event.getOngoingEvents();
        return res.render('ongoing', {
            ongoingEvents: ongoingEvents
        });

    } catch(err) {
        console.error('Error: [/events/ongoing]: ' + err);
        return next(err);
    }
});

router.get('/events/upcoming', async function(req, res, next) {
    let user = db.user.getUser(req);
    try {
        let upcomingEvents = await db.event.getUpcomingEvents();
        return res.render('upcoming', {
            upcomingEvents: upcomingEvents
        });

    } catch(err) {
        console.error('Error: [/events/upcoming]: ' + err);
        return next(err);
    }
});

router.get('/events/past', async function(req, res, next) {
    let user = db.user.getUser(req);
    try {
        let pastEvents = await db.event.getPastEvents();
        return res.render('past', {
            pastEvents: pastEvents
        });

    } catch(err) {
        console.error('Error: [/events/past]: ' + err);
        return next(err);
    }
});

router.get('/events/:eventSlug', async function(req, res) {
    let event = await db.event.getEventBySlug(req.params.eventSlug);
    return res.render('event', {event: event});
});

router.post('/events/:eventSlug', indexHandler.register);


module.exports = router;
