"use strict";

var debug = require('debug')('lib:redis');
var Redis = require('ioredis');

var config = {};
try {
  if (typeof process.env.REDIS_CONFIG !== 'undefined') {
    config = JSON.parse(process.env.REDIS_CONFIG);
  }
} catch(e) {
  debug(e);
}

var redis = new Redis(config);

redis.on('error', debug);

module.exports = redis;
