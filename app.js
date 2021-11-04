var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
const database = require ('./database/models/index');
const session = require("express-session");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var trainingStaffRouter = require('./routes/trainingStaff');
var trainerRouter = require('./routes/trainer');
var traineeRouter = require('./routes/trainee');
var authenticationRouter = require('./routes/authentication');
const { adminVerify } = require('./middleware/admin_auth');
const { trainingStaffVerify } = require('./middleware/trainingStaff_auth');
const { trainerVerify } = require('./middleware/trainer_auth');
const { traineeVerify } = require('./middleware/trainee_auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: "abc",
    resave: false,
  })
)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminVerify, adminRouter);
app.use('/trainingStaff', trainingStaffVerify, trainingStaffRouter);
app.use('/authentication', authenticationRouter);
app.use('/trainer', trainerVerify, trainerRouter);
app.use('/trainee', traineeVerify, traineeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

database.testConnection();

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
