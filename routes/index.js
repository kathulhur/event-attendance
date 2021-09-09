var express = require('express');
var router = express.Router();
const Event = require('../models/Event');
const auth = require('../lib/auth');
const db = require('../lib/db');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user = false;
  if(req.user) {
    user = {
      id: req.user.id,
      name: req.user.name,
      isAuthenticated: req.isAuthenticated()
    }
  }
  let events = await Event.find().limit(3);

  return res.render('index', { 
    user: user,
    events: db.event.filterEvents(events)
  });

});


module.exports = router;
