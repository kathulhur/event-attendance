var express = require('express');
var router = express.Router();
var participantHandler = require('../handlers/participantHandler');
// Get attendance form page
router.get('/', participantHandler.GET_attendance);

module.exports = router;