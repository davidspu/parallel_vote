var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/models').User;
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var connect = process.env.MONGODB_URI;
var mongoose = require('mongoose');
mongoose.connect(connect);

app.use(session({
    secret: 'brexit is bad',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, function(err, user) {
      done(null, user);
  });
})

function hashPassword(pass) {
  var hash = crypto.createHash('sha256');
  hash.update(pass);
  return hash.digest('hex');
}

// Tell passport how to read our user models
passport.use(new LocalStrategy(
  function(username, password, done) {
      User.findOne({ username: username, password: hashPassword(password) }, function(err, user) {
          if (err) console.error(err);
          else {
              if (user) done(null, user);
              else {
                  done(null, false);
              }
          }
      });
  }
));

app.use(passport.initialize());
app.use(passport.session());


var routes = require('./routes/index');
var auth = require('./routes/auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport stuff here
// YOUR CODE HERE
app.use('/', auth(passport));
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
