"use strict";

var Redis = require('ioredis');

var config = {};
try {
  if (typeof process.env.REDIS_CONFIG !== 'undefined') {
    config = JSON.parse(process.env.REDIS_CONFIG);
  }
} catch(e) {
  console.error(e);
}

var redis = new Redis(config);

redis.on('error', console.error);

module.exports = redis;
