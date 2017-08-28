"use strict";

var helper = require('./helper');

var async = require('async');
var assert = require('assert');
var bcrypt = require('bcrypt');
var faker = require('faker');
var uuid = require('uuid/v4');
var target = require('./../routes/user');
var model = require('./../models/user').model;

describe('routes/user.js', function() {
  before(function(callback) {
    helper.before(callback)
  });

  beforeEach(function(callback) {
    helper.beforeEach(callback);
  });

  after(function(callback) {
    helper.after(callback);
  });

  var res = function(expectedStatus, expectedJSON, callback) {
    if (typeof expectedJSON === 'function') {
      callback = expectedJSON;
    }
    return {
      sendStatus: function(actual) {
        assert.strictEqual(actual, expectedStatus);
        callback();
      },
      json: function(actual) {
        assert.deepStrictEqual(actual, expectedJSON);
        callback();
      }
    }
  };

  it('#get(): should return 404 with non admin and id not match.', function(callback) {
    var req = {
      session: {
        passport: { user: {
          role: 'user',
          id: uuid().toString()
        } } },
      params: {
        id: uuid().toString()
      }
    };
    target.get(req, res(404, callback));
  });

  it('#get(): should return 404 with the specified id is not found.', function(callback) {
    var req = {
      session: {
        passport: { user: {
          role: 'admin',
          id: uuid().toString()
        } } },
      params: {
        id: uuid().toString()
      }
    };
    target.get(req, res(404, callback));
  });

  it('#get(): should return 400 with non string id.', function(callback) {
    var req = {
      session: {
        passport: { user: {
          role: 'admin',
          id: uuid().toString()
        } } },
      params: {
        id: 0
      }
    };
    target.get(req, res(400, callback));
  });

  it('#get(): should return json when success.', function(callback) {
    var expected;
    var req = {
      session: {
        passport: { user: {
          role: 'admin',
          id: uuid().toString()
        } } },
      params: {
        id: uuid().toString()
      }
    };
    async.series([
      function(callback) {
        model({
          id: req.params.id,
          name: faker.internet.userName(),
          password: bcrypt.hashSync(faker.internet.password(), bcrypt.genSaltSync())
        }).save(function(err, result) {
          err ? callback(err) : model.findById(result, { _id: 0, __v: 0, password: 0}).lean().exec(function(err, result) {
            expected = result;
            callback(err);
          });
        });
      },
      function(callback) {
        target.get(req, res(200, expected, callback));
      }
    ], callback);
  });

  it('#create(): should return 404 with user.', function(callback) {
    var req = {
      session: {
        passport: { user: {
          role: 'user',
          id: uuid().toString()
        } } },
      params: {
        id: uuid().toString()
      }
    };
    target.create(req, res(404, callback));
  });

  it('#create(): should return 400 with invalid body.', function(callback) {
    var req = {
      session: { passport: { user: { role: 'admin' } } },
      body: 0
    };
    target.create(req, res(400, callback));
  });

  it('#remove(): should return 404 with non admin and id not match.', function(callback) {
    var req = {
      session: {
        passport: { user: {
          role: 'user',
          id: uuid().toString()
        } } },
      params: {
        id: uuid().toString()
      }
    };
    target.remove(req, res(404, callback));
  });

  it('#remove(): should return 404 with the specified id is not found.', function(callback) {
    var req = {
      session: {
        passport: { user: {
          role: 'admin',
          id: uuid().toString()
        } } },
      params: {
        id: uuid().toString()
      }
    };
    target.remove(req, res(404, callback));
  });

  it('#remove(): should return 400 with non string id.', function(callback) {
    var req = {
      session: {
        passport: { user: {
          role: 'admin',
          id: uuid().toString()
        } } },
      params: {
        id: 0
      }
    };
    target.remove(req, res(400, callback));
  });

  it('#remove(): should return 204 when success.', function(callback) {
    var req = {
      session: {
        passport: { user: {
          role: 'admin',
          id: uuid().toString()
        } } },
      params: {
        id: uuid().toString()
      }
    };
    async.series([
      function(callback) {
        model({
          id: req.params.id,
          name: faker.internet.userName(),
          password: bcrypt.hashSync(faker.internet.password(), bcrypt.genSaltSync())
        }).save(callback);
      },
      function(callback) {
        target.remove(req, res(204, callback));
      }
    ], callback);
  });

  it('#errorHandler(): should return 500 without statusCode.', function(callback) {
    target.errorHandler(new Error(), res(500, callback));
  });
});
