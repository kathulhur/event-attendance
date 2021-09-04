let express = require('express');
let router = express.Router();
let participantHandler = require('../../handlers/api/participant');

router.get('/participants', participantHandler.api.GET_participants);
router.get('/:eventId/participants', participantHandler.api.GET_eventParticipants);
router.post('/:eventId/participants/create', participantHandler.api.POST_participant);
router.delete('/:eventId/participants/:participantId/delete', participantHandler.api.DELETE_participant);
router.put('/:eventId/participants/:participantId/edit', participantHandler.api.PUT_participant);

module.exports = router;