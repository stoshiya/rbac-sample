"use strict";

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var SessionStore = require('connect-redis')(session);
var authenticator = require('./lib/authenticator');
var constants = require('./lib/constants');
var passport = require('./lib/passport');
var redis = require('./lib/redis');
var user = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  store: new SessionStore({ client: redis, prefix: constants.appName + ':' }),
  secret: process.env.COOKIE_SECRET,
  resave: true,
  saveUninitialized: true,
  rolling: true,
  name: constants.appName + '.sid',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 6 * 60 * 60 * 1000 // 6 hours.
  }
}));

var api = express.Router();
api.use(authenticator);

api.get('/users/:id', user.get);
//api.post('/users',    user.create);
api.delete('/users/:id', user.remove);
app.use('/api', api);


module.exports = app;

process.on('uncaughtException', console.error);
