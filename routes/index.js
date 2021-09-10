var express = require('express');
var router = express.Router();
const Event = require('../models/Event');
const auth = require('../lib/auth');
const db = require('../lib/db');


/* GET home page. */
router.get('/', async function(req, res, next) {
    let events = await db.event.getLatestEvents(3);
    return res.render('index', { 
        events: events
    });

});

router.get('/events', async function(req, res) {
    let user = db.user.getUser(req);
    try {
        let incomingEvents = await db.event.getIncomingEvents();
        let pastEvents = await db.event.getPastEvents();
        res.render('events', {
            incomingEvents: incomingEvents,
            pastEvents: pastEvents
        });

    } catch(err) {
        console.err('Error: [/events]: ' + err);
        next(err);
    }
});

router.get('/events/:eventSlug', async function(req, res) {
    let event = await db.event.getEventBySlug(req.params.eventSlug);
    res.render('event', {event: event});

});


module.exports = router;
