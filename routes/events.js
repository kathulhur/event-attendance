var express = require('express');
var router = express.Router();
var eventsHandler = require('../handlers/event');

// Events Page
router.get('/', eventsHandler.GET_events);

// Event form page
router.get('/create', eventsHandler.GET_eventForm);
// router.post('/create', eventsHandler.POST_eventForm);
router.get('/:eventId/', eventsHandler.GET_event);
// router.delete('/:eventId', eventsHandler.DELETE_event);

// Event edit page
router.get('/:eventId/edit', eventsHandler.GET_eventEdit);



module.exports = router;