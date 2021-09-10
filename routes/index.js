var express = require('express');
var router = express.Router();
const Event = require('../models/Event');
const auth = require('../lib/auth');
const db = require('../lib/db');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user = false;
  if(req.user) {
    user = req.user;
  }
  
  let events = await db.event.getLatestEvent();

  return res.render('index', { 
    user: db.user.filterUser(user, req.isAuthenticated()),
    events: db.event.filterEvents(events)
  });

});


module.exports = router;
