var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const {credentials} = require('./config');

process.env.DEBUG = credentials.DEBUG;
process.env.MONGODB_URI = credentials.MONGODB_URI;
require('./db');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const participantRouter = require('./routes/participant');
const eventRouter = require('./routes/event')

const eventRouterAPI = require('./routes/api/event');
const participantRouterAPI = require('./routes/api/participant');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/attendance', participantRouter);
app.use('/events', eventRouter);
app.use('/api/events', eventRouterAPI);
app.use('/api/events', participantRouterAPI);

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
