"use strict";

var path = require('path');

describe('lib/redis.js', function() {
  var env;

  before(function() {
    env = process.env;
  });

  beforeEach(function() {
    delete(require.cache[path.resolve('lib/redis.js')]);
  });

  after(function() {
    process.env = env;
  });

  it('require("lib/redis.js") with json config.', function() {
    process.env.REDIS_CONFIG = JSON.stringify({ host: '127.0.0.1', port: 6379, db: 1 });
    require('./../lib/redis');
  });

  it('require("lib/redis.js") with undefined.', function() {
    delete process.env.REDIS_CONFIG;
    require('./../lib/redis');
  });

  it('require("lib/redis.js") with invalid config.', function() {
    process.env.REDIS_CONFIG = 'foo bar';
    require('./../lib/redis');
  });
});
