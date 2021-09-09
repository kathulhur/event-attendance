var express = require('express');
var router = express.Router();
const auth = require('../lib/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = false;
  if(req.user) {
    user = {
      id: req.user.id,
      name: req.user.name,
      isAuthenticated: req.isAuthenticated()
    }
  }
  res.render('index', { user: user });
});


module.exports = router;
