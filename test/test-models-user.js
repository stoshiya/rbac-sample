"use strict";

require('./env');
var assert = require('assert');
var async = require('async');
var bcrypt = require('bcrypt');
var faker = require('faker');
var uuid = require('node-uuid');
var target = require('./../models/user');

describe('models/user.js', function() {
  before(function(callback) {
    target.model.ensureIndexes(callback)
  });

  beforeEach(function(callback) {
    target.model.remove({}, callback);
  });

  after(function(callback) {
    target.db.dropDatabase(callback);
  });

  it('#authenticate(): should return error with non-string name.', function (callback) {
    var name = 0;
    var password = faker.internet.password();
    target.authenticate(name, password, function(err) {
      if (!err) {
        callback(new Error('error not occurs'));
        return;
      }
      callback();
    });
  });

  it('#authenticate(): should return error with non-string password.', function (callback) {
    var name = faker.internet.userName();
    var password = 0;
    target.authenticate(name, password, function(err) {
      if (!err) {
        callback(new Error('error not occurs'));
        return;
      }
      callback();
    });
  });

  it('#authenticate(): should return undefind when failed.', function (callback) {
    var identifier = faker.internet.userName();
    var password = faker.internet.password();
    var expected = undefined;
    target.authenticate(identifier, password, function (err, actual) {
      if (err) {
        callback(err);
        return;
      }
      assert.strictEqual(actual, expected);
      callback();
    });
  });

  it('#authenticate(): should return json when success.', function (callback) {
    var name = faker.internet.userName();
    var password = faker.internet.password();
    var expected;
    async.series([
      function(callback) {
        target.model({
          id: uuid.v4().toString(),
          name: name,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
          role: 'user'
        }).save(function(err, result) {
          err ? callback(err) : target.model.findById(result, { _id: 0, __v: 0, password: 0 }).lean().exec(function(err, result) {
            expected = result;
            callback(err);
          })
        });
      },
      function(callback) {
        target.authenticate(name, password, function(err, actual) {
          if (err) {
            callback(err);
            return;
          }
          assert.deepStrictEqual(actual, expected);
          callback();
        });
      }
    ], callback);
  });

  it('#get(): should return error with non-string id.', function (callback) {
    var id = 0;
    target.get(id, function(err) {
      if (!err) {
        callback(new Error('error not occurs'));
        return;
      }
      callback();
    });
  });

  it('#get(): should return error with unexpected format id.', function (callback) {
    var id = 'non uuid string';
    target.get(id, function(err) {
      if (!err) {
        callback(new Error('error not occurs'));
        return;
      }
      callback();
    });
  });

  it('#get(): should return null when not found.', function (callback) {
    var id = uuid.v4().toString();
    var expected = null;
    target.get(id, function(err, actual) {
      if (err) {
        callback(err);
        return;
      }
      assert.strictEqual(actual, expected);
      callback();
    });
  });

  it('#get(): should return json when found.', function (callback) {
    var id = uuid.v4().toString();
    var name = faker.internet.userName();
    var password = faker.internet.password();
    var expected;
    async.series([
      function(callback) {
        target.model({
          id: id,
          name: name,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
          role: 'user'
        }).save(function(err, result) {
          err ? callback(err) : target.model.findById(result, { _id: 0, __v: 0, password: 0 }).lean().exec(function(err, result) {
            expected = result;
            callback(err);
          })
        });
      },
      function(callback) {
        target.get(id, function(err, actual) {
          if (err) {
            callback(err);
            return;
          }
          assert.deepStrictEqual(actual, expected);
          callback();
        });
      }
    ], callback);
  });

  it('#create(): should return error with non-object.', function (callback) {
    var obj = undefined;
    target.create(obj, function(err) {
      if (!err) {
        callback(new Error('error not occurs'));
        return;
      }
      callback();
    });
  });

  it('#create(): should return error with empty object.', function (callback) {
    var obj = {};
    target.create(obj, function(err) {
      if (!err) {
        callback(new Error('error not occurs'));
        return;
      }
      callback();
    });
  });

  it('#create(): should return error with non-string name.', function (callback) {
    var obj = { name: 0, password: faker.internet.password(), role: 'user' };
    target.create(obj, function(err) {
      if (!err) {
        callback(new Error('error not occurs'));
        return;
      }
      callback();
    });
  });

  it('#create(): should return error with non-string password.', function (callback) {
    var obj = { name: faker.internet.userName(), password: 0, role: 'user' };
    target.create(obj, function(err) {
      if (!err) {
        callback(new Error('error not occurs'));
        return;
      }
      callback();
    });
  });

  it('#create(): should return error 409 when duplicated.', function (callback) {
    var id = uuid.v4().toString();
    var name = faker.internet.userName();
    var password = faker.internet.password();
    var expected = { statusCode: 409 };
    async.series([
      function(callback) {
        target.model({
          id: id,
          name: name,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
          role: 'user'
        }).save(function(err, result) {
          err ? callback(err) : target.model.findById(result, { _id: 0, __v: 0, password: 0 }).lean().exec(function(err, result) {
            callback(err);
          })
        });
      },
      function(callback) {
        target.create({ name: name, password: password }, function(err) {
          if (!err) {
            callback(new Error('error not occurs'));
            return;
          }
          assert.deepStrictEqual(err, expected);
          callback();
        });
      }
    ], callback);
  });

  it('#create(): should return json when success.', function (callback) {
    var id = uuid.v4().toString();
    var name = faker.internet.userName();
    var password = faker.internet.password();
    target.create({ name: name, password: password }, function(err, actual) {
      if (err) {
        callback(err);
        return;
      }
      assert.strictEqual(actual.name, name);
      assert.strictEqual(actual.role, 'user');
      callback();
    });
  });

  it('#remove(): should return error with non-string id.', function (callback) {
    var id = 0;
    target.remove(id, function(err) {
      if (!err) {
        callback(new Error('error not occurs'));
        return;
      }
      callback();
    });
  });

  it('#remove(): should return error with unexpected format id.', function (callback) {
    var id = 'non uuid string';
    target.remove(id, function(err) {
      if (!err) {
        callback(new Error('error not occurs'));
        return;
      }
      callback();
    });
  });

  it('#remove(): should return null when not found.', function (callback) {
    var id = uuid.v4().toString();
    var expected = null;
    target.remove(id, function(err, actual) {
      if (err) {
        callback(err);
        return;
      }
      assert.strictEqual(actual, expected);
      callback();
    });
  });

  it('#remove(): should return json when found.', function (callback) {
    var id = uuid.v4().toString();
    var name = faker.internet.userName();
    var password = faker.internet.password();
    var expected;
    async.series([
      function(callback) {
        target.model({
          id: id,
          name: name,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
          role: 'user'
        }).save(function(err, result) {
          err ? callback(err) : target.model.findById(result, { _id: 0, __v: 0, password: 0 }).lean().exec(function(err, result) {
            expected = result;
            callback(err);
          })
        });
      },
      function(callback) {
        target.remove(id, function(err, actual) {
          if (err) {
            callback(err);
            return;
          }
          assert.deepStrictEqual(actual, expected);
          callback();
        });
      }
    ], callback);
  });
});
