var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// load environment variables
var dotenv = require('dotenv');
var result = dotenv.config({ path: './credentials-development.env'});
console.log("ENV: " + process.env.NODE_ENV);
if(result.error) {
  console.log('ERROR HAS OCCURED WHILE LOADING ENVIRONMENT VARIABLES');
} else {
  console.error('Environment configuration loaded successfully!');
}

require('./db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var attendanceRouter = require('./routes/attendance');
var eventRouter = require('./routes/event')
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
app.use('/attendance', attendanceRouter);
app.use('/events', eventRouter);

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
