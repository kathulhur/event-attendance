var express = require('express');
var router = express.Router();
const passport = require('passport');
const userHandler = require('../handlers/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Get login form
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.post('/login', userHandler.login);

router.get('/logout', userHandler.logout);

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', userHandler.register);


module.exports = router;
