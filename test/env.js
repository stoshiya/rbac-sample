"use strict";

var constants = require('./../lib/constants');

process.env.MONGO_URL = 'mongodb://localhost/' + constants.appName + '-' + Date.now();
