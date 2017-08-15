"use strict";

var mongoose = require('mongoose');
var connection = mongoose.createConnection(process.env.MONGO_URL);
var Schema = mongoose.Schema;
var async = require('async');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');

var constants = require('./../lib/constants');

var regexId = constants.REGEX_UUID;
var regexHash = constants.REGEX_HASH;
var roles = ['admin', 'user', 'guest'];
var defaultRole = 'user';

var name = 'user';
var schema = new Schema({
  id:       { type: String, required: true, unique: true, index: true, match: regexId },
  created:  { type: Date, default: new Date() },
  modified: { type: Date, default: new Date() },
  name:     { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, match: regexHash },
  role:     { type: String, default: defaultRole, enum: roles }
});
var select = { _id: 0, __v: 0, password: 0 };

mongoose.model(name, schema);
var Model = connection.model(name);

exports.authenticate = function(identifier, password, callback) {
  if (typeof identifier !== 'string' || typeof password !== 'string') {
    callback(new Error('invalid parameter'));
    return;
  }
  async.waterfall([
    function(callback) {
      var caseInsensitiveId = createRegExp(identifier, 'i');
      var condition = { $or: [{ id: identifier }, { name: caseInsensitiveId }]};
      Model.findOne(condition, { _id: 0, __v: 0 }, select).lean().exec(callback);
    },
    function(data, callback) {
      data ? bcrypt.compare(password, data.password, function(err, compared) {
        delete data.password;
        callback(err, compared ? data : null);
      }) : callback();
    }
  ], callback);
};

exports.get = function (id, callback) {
  if (typeof id !== 'string' || !regexId.test(id)) {
    callback({ statusCode: 400, message: 'invalid parameter' });
    return;
  }
  Model.findOne({ id: id }, select).lean().exec(callback);
};

exports.create = function(obj, callback) {
  if (!obj || typeof obj !== 'object' || typeof obj.name !== 'string' || typeof obj.password !== 'string') {
    callback({ statusCode: 400, message: 'invalid parameter' });
    return;
  }
  async.waterfall([
    function(callback) {
      Model.findOne({ name: createRegExp(obj.name, 'i') }, { _id: 1 }).limit(1).exec(function (err, exists) {
        callback(err, Array.isArray(exists) && exists.length > 0);
      });
    },
    function(exists, callback) {
      exists ?
        callback({ statusCode: 409 }) :
        Model({
          id:       uuid.v4().toString(),
          name:     obj.name,
          password: bcrypt.hashSync(obj.password, bcrypt.genSaltSync()),
          role:     roles.indexOf(obj.role) !== -1 ? obj.role : defaultRole
        }).save(function(err, result) {
          err ? callback(err) : Model.findById(result._id, select).lean().exec(callback)
        });
    }
  ], callback);
};

exports.remove = function(id, callback) {
  if (typeof id !== 'string' || !regexId.test(id)) {
    callback({ statusCode: 400, message: 'invalid parameter' });
    return;
  }
  Model.findOneAndRemove({ id: id }, { select: select }).lean().exec(callback);
};

var regexpSpecialCharacters = /([.*+?^=!:${}()|[\]/\\])/g;

function createRegExp(s, flag) {
  flag = flag || '';
  return new RegExp('^' + s.replace(regexpSpecialCharacters, '\\$&') + '$', flag);
}

connection.on('error', console.error);
