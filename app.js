const express     = require('express');
const app         = express();
const createError = require('http-errors');
const path        = require('path');
const logger      = require('morgan');
const exphbs      = require('express-handlebars');
const session     = require('express-session');
const flash       = require('connect-flash');
const db          = require('./lib/db');
// passport configuration
const passport = require('passport')
require('./lib/auth').configure(passport);// load passport strategies and serializers

// Get all environment configuration
const {credentials} = require('./config');
process.env.DEBUG = credentials.DEBUG;
process.env.cookieSecret = credentials.cookieSecret;

// Connect to mongodb database
const mongodb = require('./mongoConnection.js');
mongodb.connect();

// Router imports
const indexRouter           = require('./routes/index');
const usersRouter           = require('./routes/user');
const eventsRouterAPI       = require('./routes/api/event');
const participantsRouterAPI = require('./routes/api/participant');
const adminRouter           = require('./routes/admin');

const auth                  = require('./lib/auth');

const hbs = exphbs.create({
  extname: '.hbs',
  helpers: {
    displayIfAvailable: function(data) {
      return data ? data : '';
    },
    hasEnded: function(status) {
      return status === 'ended';
    },
  }
});


// view engine setup
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');


app.use(logger('dev'));

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// configure passport

//Express Session
app.use(session({
  secret: process.env.cookieSecret,
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect-flash
app.use(function (req, res, next) {
  res.locals.success_msgs = req.flash('success_msgs');
  res.locals.error_msgs = req.flash('error_msgs');
  res.locals.info_msgs = req.flash('info_msgs');
  res.locals.error = req.flash('error');
  res.locals.user = db.user.getUser(req);
  next();
});

// Routes
app.use(express.static(path.join(__dirname, 'public')));// static route
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/events', eventsRouterAPI);
app.use('/api/events', participantsRouterAPI);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
