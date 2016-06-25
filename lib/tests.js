'use strict'
var fs = require('fs');
var assert = require('chai').assert;
var evaluate = require("./service");

var test = '8.1.1';
var content = fs.readFileSync('../test/data/' + test + '.Failure.html', 'utf8');
evaluate(test, content, function(result) {
  console.log(result);
  assert.equal(result[test].success, false);
});

content = fs.readFileSync('../test/data/' + test + '.Success.html', 'utf8');
evaluate(test, content, function(result) {
  assert.equal(result[test].success, true);
});
