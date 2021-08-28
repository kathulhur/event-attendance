var express = require('express');
var router = express.Router();
var eventHandler = require('../handlers/eventHandler');

// Events Page
router.get('/', eventHandler.GET_events);

// Event form page
router.get('/create', eventHandler.GET_eventForm);
router.get('/:eventId', eventHandler.GET_event);





module.exports = router;