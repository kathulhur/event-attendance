var express = require('express');
var router = express.Router();
var eventHandler = require('../../handlers/api/eventHandler');
var participantHandler = require('../../handlers/api/participantHandler');

router.get('/participants', participantHandler.api.GET_participants);
router.get('/:eventId/participants', participantHandler.api.GET_participant);
router.post('/:eventId/participants', participantHandler.api.POST_participant);
router.delete('/:eventId/participants/:participantId', participantHandler.api.DELETE_participant);
router.put('/:eventId/participants/:participantId', participantHandler.api.PUT_participant);

router.get('/', eventHandler.api.GET_events);
router.post('/',  eventHandler.api.POST_eventForm);
router.get('/:eventId', eventHandler.api.GET_event);
router.put('/:eventId', eventHandler.api.PUT_eventForm);
router.delete('/:eventId', eventHandler.api.DELETE_event);


module.exports = router;