"use strict";

require('./env');

var model = require('./../models/user').model;
var db = require('./../models/user').db;

exports.before = function(callback) {
  model.ensureIndexes(callback)
};

exports.beforeEach = function(callback) {
  model.remove({}, callback);
};

exports.after = function(callback) {
  db.dropDatabase(callback);
};
