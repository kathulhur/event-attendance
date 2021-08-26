var express = require('express');
var router = express.Router();
var eventHandler = require('../handlers/eventHandler');

// Events Page
router.get('/', eventHandler.GET_events);
router.get('/:slug', eventHandler.GET_event);

// Event form page
router.get('/create', eventHandler.GET_eventForm);
router.post('/api/create-event-process',  eventHandler.api.POST_eventForm);


module.exports = router;