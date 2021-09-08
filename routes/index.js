var express = require('express');
var router = express.Router();
const auth = require('../lib/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', auth.ensureAuthenticated, function(req, res) {
  return res.render('dashboard');
});

module.exports = router;
