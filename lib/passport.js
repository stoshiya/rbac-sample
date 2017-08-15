"use strict";

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var user = require('./../models/user');

passport.use(new BasicStrategy(user.authenticate));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  user.get(id, done);
});

module.exports = passport;
