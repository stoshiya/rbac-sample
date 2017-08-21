"use strict";

var helper = require('./helper');
var assert = require('assert');
var async = require('async');
var bcrypt = require('bcrypt');
var express = require('express');
var faker = require('faker');
var uuid = require('node-uuid');
var request = require('supertest');
var target = require('./../lib/authenticator');
var passport = require('./../lib/passport');
var model = require('./../models/user').model;

describe('lib/authenticator.js', function () {
  before(function(callback) {
    helper.before(callback)
  });

  beforeEach(function(callback) {
    helper.beforeEach(callback);
  });

  after(function(callback) {
    helper.after(callback);
  });

  it('require("lib/authenticator"): should return 401.', function(callback) {
    var app = express();

    app.get('/', target, function(req, res) {
      res.sendStatus(200)
    });

    request(app)
      .get('/')
      .expect(401, callback);
  });

  it('require("lib/authenticator"): should return 200.', function(callback) {
    var app = express();
    app.use(passport.initialize());
    app.get('/', target, function(req, res) {
      res.sendStatus(200)
    });

    var password = faker.internet.password();
    var user = {
      id: uuid.v4().toString(),
      name: faker.internet.userName(),
      password: bcrypt.hashSync(password, bcrypt.genSaltSync())
    };

    async.series([
      function(callback) {
        model(user).save(callback);
      },
      function(callback) {
        request(app)
          .get('/')
          .auth(user.name, password)
          .expect(200, callback);
      }
    ], callback);
  });

  it('require("lib/authenticator"): should call next().', function(callback) {
    var req = {
      isUnauthenticated: function() {
        return false;
      }
    };
    var res = {};

    target(req, res, callback);
  });

  it('#loginHandler(): should return 500 with invalid user object.', function(callback) {
    var expected = 500;
    var req = {
      login: function(user, callback) {
        callback("error");
      }
    };
    target.loginHandler(undefined, {}, req, function(actual) {
      assert.strictEqual(actual, expected);
      callback();
    })
  });

  it('#loginHandler(): should return 500 with error.', function(callback) {
    var expected = 500;

    target.loginHandler(new Error(), undefined, undefined, function(actual) {
      assert.strictEqual(actual, expected);
      callback();
    })
  });
});