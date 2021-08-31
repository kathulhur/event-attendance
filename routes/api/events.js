var express = require('express');
var router = express.Router();
var eventHandler = require('../../handlers/api/eventsHandler');


router.get('/', eventHandler.api.GET_events);
router.post('/create',  eventHandler.api.POST_eventForm);
router.get('/:eventId', eventHandler.api.GET_event);
router.put('/:eventId/edit', eventHandler.api.PUT_eventForm);
router.delete('/:eventId/delete', eventHandler.api.DELETE_event);


module.exports = router;