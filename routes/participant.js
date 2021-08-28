var express = require('express');
var router = express.Router();
var participantHandler = require('../handlers/participantHandler');

// Get participants page
router.get('/:eventId/participants', participantHandler.GET_participants);
router.get('/:eventId/participants/:participantId', participantHandler.GET_participant);
module.exports = router;