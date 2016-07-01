var repository = require('./repository');
var assert = require('chai').assert;
var underscore = require('underscore');
var jsdom = require("node-jsdom");
var rule = require('./rule');

var allTests = [];
for (var test in repository) {
    allTests.push(test);
}

var evaluateTest = function(test, window, html) {
    assert(repository[test] !== undefined, 'No declared test with name : ' + test);
    return result = repository[test](rule('1.1.2', window.$), window, html).trigger().result;
};

module.exports = function(test, html, callback) {
    assert(html !== null && html !== undefined, 'No HTML content specified for evaluation.');

    if (test === null) {
        test = allTests;
    }

    if (!underscore.isArray(test)) {
        test = [test];
    }

    jsdom.env(html, ["file://" + __dirname + "/../resources/jquery.js"],
        function(errors, window) {
            var result = {}
            test.forEach(function(test) {
                var resultTest = evaluateTest(test, window, html);
                if (resultTest) {
                    result[test] = resultTest;
                }
            });
            if (callback) {
                callback(result);
            }
        }
    );
};
