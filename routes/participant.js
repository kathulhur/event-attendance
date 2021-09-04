var express = require('express');
var router = express.Router();
var participantHandler = require('../handlers/participant');

// Get participants page
// router.get('/:eventId/participants', participantHandler.GET_participants);
router.get('/:eventId/participants/create', participantHandler.GET_participantForm);
router.get('/:eventId/participants/:participantId/', participantHandler.GET_participant);
router.get('/:eventId/participants/:participantId/edit', participantHandler.GET_participantEdit);
module.exports = router;