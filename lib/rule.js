'use strict'

var fs = require('fs');
var format = require("string-template");
var config = require('config');

var i18n = config.get("messages");
var config = config.get("markers");

var notnull = "NOT_NULL";
var UNKNOWN_MESSAGE = "UNKNOWN_MESSAGE";

function rule(test, window) {
  var rule = new Rule();
  rule.test = test;
  rule.window = window;
  rule.placeholders = [];

  return rule;
}

function Rule(config) {
  this.config = config || {};
}

Rule.prototype.select = function(selector) {
  this.selector = selector;
  return this;
};
Rule.prototype.noelement = function() {
  this.checknoelement = true;
  return this;
};
Rule.prototype.addplaceholders = function(placeholders) {
  this.placeholders = this.placeholders || [];
  this.placeholders = this.placeholders.concat(placeholders);

  return this;
};
Rule.prototype.failon = function(attribute, value) {
  this.failson = this.failson || [];

  this.failson.push({
    'attribute': attribute,
    'value': value
  });

  return this;
};
Rule.prototype.notnullattribute = function(attribute) {
  this.failon(attribute, notnull);

  return this;
};

Rule.prototype.notundefinedattribute = function(attribute) {
  this.failon(attribute, undefined);

  return this;
};
Rule.prototype.addnochildren = function(tags, messageId) {
  this.nochildren = this.nochildren || [];
  this.nochildren.push({
    "tags": tags,
    "messageId": messageId
  });

  return this;
};
Rule.prototype.addnochildwithattributes = function(tag, attributes, messageId) {
  this.nochildwithattributes = this.nochildwithattributes || [];
  this.nochildwithattributes.push({
    "tag": tag,
    "attributes": attributes,
    "messageId": messageId
  });

  return this;
};
Rule.prototype.trigger = function() {
  var rule = this;
  var $ = rule.window;
  var elements = $(rule.selector);

  var messages = [];

  elements.each(function() {
    var element = $(this);
    var placeholders = [];
    rule.placeholders.forEach(function(attribute) {
      placeholders.push(element.attr(attribute));
    });
    var failed = true;
    if (rule.failson) {
      rule.failson.forEach(function(fail) {
        var failoneval = true;
        if (fail.value === notnull) {
          failoneval = $(this).attr(fail.attribute) !== null;
        } else {
          failoneval = $(this).attr(fail.attribute) === fail.value;
        }

        failed = failed && eval;
      });
    }

    if (rule.nochildren) {
      rule.nochildren.forEach(function(child) {
        child.tags.forEach(function(tag) {
          if (element.find(tag).length > 0) {
            messages.push(format(i18n[child.messageId], [tag]));
          }
        });
      });
    }
    if (rule.nochildwithattributes) {
      rule.nochildwithattributes.forEach(function(child) {
        child.attributes.forEach(function(attribute) {
          if (element.find(child.tag + "[" + attribute + "]").length > 0) {
            messages.push(format(i18n[child.messageId], [attribute]));
          }
        });
      });
    }
    if (rule.checknoelement) {
      messages.push(format(i18n[rule.test] || UNKNOWN_MESSAGE, placeholders));
    }
  });

  rule.result = {
    "success": elements.length == 0 && messages.length === 0,
    "messages": messages
  };
  return this;
};

module.exports = rule;
