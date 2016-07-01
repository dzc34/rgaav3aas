'use strict'

var fs = require('fs');
var assert = require('chai').assert;
var evaluate = require("../lib/service");
var walk = require('walk');

['1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.2.1', '1.2.2', '1.2.3', '1.2.4', '1.2.5', '1.2.6', '1.3.1', '1.3.2', '1.3.3']
.forEach(function(test) {
    var dir = "./data/" + test;
    var walker = walk.walk(dir, {});

    walker.on("file", function(root, fileStats, next) {
        var statut = fileStats.name.split('.')[0].split('-')[0];
        var erreurs = fileStats.name.split('.')[0].split('-')[1];
        fs.readFile(dir + "/" + fileStats.name, function(err, data) {
            evaluate(test, data.toString(), function(result) {
                console.log(test, fileStats.name, result[test].statut, result[test].messages)
                assert.equal(statut, result[test].statut);
            });
            next();
        });
    });

    walker.on("errors", function(root, nodeStatsArray, next) {
        next();
    });

    walker.on("end", function() {
        //console.log("all done");
    });
});
