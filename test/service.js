'use strict'
var assert = require('chai').assert;
var fs = require('fs');
var assert = require('chai').assert;
var evaluate = require("../lib/service");

var getContent = function(test) {
  return fs.readFileSync(__dirname + "/data/" + test + '.Failure.html', 'utf8');
};

describe('Repository', function() {
    describe('1.1.1', function() {
        it('should return a failure', function() {
          evaluate('1.1.1', getContent('1.1.1'), function(result) {
            assert.equal(result['1.1.1'].success, false);
          });
        });
    });
});
