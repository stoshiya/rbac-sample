"use strict";

var model = require('./../models/user');
var errorHandler = require('./commonHandler').errorHandler;

exports.get = function(req, res) {
  if (req.session.passport.user.role === 'admin' || req.session.passport.user.id === req.params.id) {
    model.get(req.params.id, function (err, result) {
      err ? errorHandler(err, res) : result ? res.json(result) : res.sendStatus(404);
    });
  } else {
    res.sendStatus(404);
  }
};

exports.create = function(req, res) {
  if (req.session.passport.user.role === 'admin') {
    model.create(req.body, function (err, result) {
      err ? errorHandler(err, res) : res.status(201).json(result); // TODO add location header.
    });
  } else {
    res.sendStatus(404);
  }
};

exports.remove = function(req, res) {
  if (req.session.passport.user.role === 'admin' ||
    (req.session.passport.user.role === 'user' && req.session.passport.user.id === req.params.id)) {
    model.remove(req.params.id, function (err, result) {
      err ? errorHandler(err, res) : res.sendStatus(result ? 204 : 404);
    });
  } else {
    res.sendStatus(404);
  }
};
