"use strict";

var passport = require('./passport');

function loginHandler(err, user, req, callback) {
  if (err) {
    callback(500);
  } else if (!user) {
    callback(401);
  } else {
    req.login(user, function (err) {
      err ? callback(500) : callback();
    });
  }
}

module.exports = function(req, res, next) {
  if (req.isUnauthenticated()) {
    passport.authenticate('basic', { session: false }, function (err, user) {
      loginHandler(err, user, req, function(errStatus) {
        errStatus ? res.sendStatus(errStatus) : next();
      });
    })(req, res);
  } else {
    next();
  }
};

// for test.
module.exports.loginHandler = loginHandler;
