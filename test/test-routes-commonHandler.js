var assert = require('assert');
var target = require('./../routes/commonHandler');

describe('routes/commonHandler.js', function() {
  var res = function(expected, callback) {
    return {
      sendStatus: function(actual) {
        assert.strictEqual(actual, expected);
        callback();

      }
    }
  };

  it('#errorHandler(): should return 500 without statusCode.', function(callback) {
    target.errorHandler(new Error(), res(500, callback));
  });
});

