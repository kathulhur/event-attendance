var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs  = require('express-handlebars');

const {credentials} = require('./config');
process.env.DEBUG = credentials.DEBUG;

// setup the database
const mongodb = require('./mongoConnection.js');
mongodb.connect();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const participantsRouter = require('./routes/participant');
const eventsRouter = require('./routes/events')

const eventsRouterAPI = require('./routes/api/event');
const participantsRouterAPI = require('./routes/api/participant');

var app = express();

// view engine setup
app.engine('.hbs', exphbs({ extname: '.hbs'}));
app.set('view engine', '.hbs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/events', participantsRouter);
app.use('/api/events', eventsRouterAPI);
app.use('/api/events', participantsRouterAPI);

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
