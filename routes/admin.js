const express = require('express');
const router = express.Router();
const adminHandler = require('../handlers/admin');

// Index page
router.get('/', adminHandler.index);
// Events list page
router.get('/events', adminHandler.events);

router.get('/events/ongoing', adminHandler.ongoing);
router.get('/events/upcoming', adminHandler.upcoming);
router.get('/events/past', adminHandler.past);
// Event form
router.get('/events/create', adminHandler.eventForm);
// Submit form
router.post('/events/create', adminHandler.eventSubmit);
// Event Details
router.get('/events/:eventSlug', adminHandler.event);
router.get('/events/:eventSlug/edit', adminHandler.eventEditForm);
router.get('/events/:eventSlug/participants/create', adminHandler.participantForm);
router.post('/events/:eventSlug/participants/create', adminHandler.participantSubmit);
router.get('/events/:eventSlug/participants/:participantSlug', adminHandler.participant);
router.get('/events/:eventSlug/participants/:participantSlug/edit', adminHandler.participantEditForm);


module.exports = router;