"use strict";

var debug = require('debug')('routes:commonHandler');
var statusCodes = Object.keys(require('http').STATUS_CODES);

exports.errorHandler = function (err, res) {
  debug(err);
  res.sendStatus(typeof err.statusCode === 'number' && statusCodes.indexOf(err.statusCode.toString()) !== -1 ? err.statusCode : 500);
};
