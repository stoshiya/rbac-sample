"use strict";

var model = require('./../models/user');

function errorHandler(err, res) {
  typeof err.statusCode === 'number' && isFinite(err.statusCode) ? res.sendStatus(err.statusCode) : res.sendStatus(500);
}

exports.get = function(req, res) {
  if (req.session.passport.user.role === 'admin' ||
    req.session.passport.user.id === req.params.id) {
    model.get(req.params.id, function (err, result) {
      err ? errorHandler(err, res) : res.json(result);
    });
  } else {
    res.sendStatus(403);
  }
};

exports.remove = function(req, res) {
  if (req.session.passport.user.role === 'admin' ||
    (req.session.passport.user.role === 'user' && req.session.passport.user.id === req.params.id)) {
    model.remove(req.params.id, function (err) {
      err ? errorHandler(err, res) : res.sendStatus(200);
    });
  } else {
    res.sendStatus(403);
  }
};
