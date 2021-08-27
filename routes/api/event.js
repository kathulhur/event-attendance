var express = require('express');
var router = express.Router();
var eventHandler = require('../../handlers/api/eventHandler');

router.get('/', eventHandler.api.GET_events);
router.post('/create',  eventHandler.api.POST_eventForm);
router.put('/modify/:id', eventHandler.api.PUT_eventForm);
router.delete('/delete/:id', eventHandler.api.DELETE_event);

module.exports = router;