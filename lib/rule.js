'use strict'

var fs = require('fs');
var format = require("string-template");
var config = require('config');
var wildcard = require('wildcard');

var i18n = config.get("messages");
var config = config.get("markers");
var count = require('word-count')

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
Rule.prototype.failon = function(attribute, value, messageId) {
    this.failson = this.failson || [];

    this.failson.push({
        'attribute': attribute,
        'value': value,
        'messageId': messageId
    });

    return this;
};
Rule.prototype.notnullattribute = function(attribute) {
    this.failon(attribute, function(attribute, value, element) {
        return value !== "";
    });

    return this;
};

Rule.prototype.attributewithvalue = function(attribute, expectedvalue, messageId) {
    this.failon(attribute, function(attribute, value, element) {
        return value !== undefined && value.toLowerCase() === expectedvalue.toLowerCase();
    }, messageId);

    return this;
};

Rule.prototype.pertinent = function(attribute, messageId) {
    this.failonelement = this.failonelement || [];
    this.failonelement.push(function(element, $) {
        return count($(element).attr(attribute)) >= 3;
    });
    this.failonelement.messageId = messageId;

    return this;
};

Rule.prototype.ifpresentequals = function(attribute1, attribute2, messageId) {
    this.failonelement = this.failonelement || [];
    this.failonelement.push(function(element, $) {
        if ($(element).attr(attribute1) !== undefined) {
            return $(element).attr(attribute1).trim() === $(element).attr(attribute2).trim();
        }
        return true;
    });
    this.failonelement.messageId = messageId;

    return this;
};

Rule.prototype.notext = function(messageId) {
    this.failonelement = this.failonelement || [];
    this.failonelement.push(function(element, $) {
        return $(element).text().trim() === '';
    });
    this.failonelement.messageId = messageId;

    return this;
};

Rule.prototype.notundefinedattribute = function(attribute, messageId) {
    this.failon(attribute, function(attribute, value, element) {
        return value !== undefined;
    }, messageId);

    return this;
};

Rule.prototype.emptyattribute = function(attribute, messageId) {
    this.failon(attribute, function(attribute, value, element) {
        return value === "";
    }, messageId);

    return this;
};

Rule.prototype.withattribute = function(attribute, messageId) {
    this.failon(attribute, function(attribute, value, element) {
        return (value !== undefined && value !== null);
    }, messageId);

    return this;
};

Rule.prototype.emptyorundefined = function(attribute, messageId) {
    this.failon(attribute, function(attribute, value, element) {
        return value === "" || value === undefined;
    }, messageId);

    return this;
};

Rule.prototype.noattribute = function(attribute, messageId) {
    this.failon(attribute, function(attribute, value, element) {
        return value === undefined;
    }, messageId);

    return this;
};
Rule.prototype.noattributepattern = function(pattern, exclusions, messageId) {
    exclusions = exclusions || [];
    this.failon(pattern, function(attribute, value, element, $) {
        var result = true;
        element.each(function() {
            $.each(this.attributes, function() {
                if (this.specified && this.name.match(pattern) !== null && exclusions.indexOf(this.name) === -1) {
                    result = false;
                    return;
                }
            });
        });

        return result;
    }, messageId);

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

        if (rule.failson) {
            var result = true;
            rule.failson.forEach(function(fail) {
                if (!fail.value(fail.attribute, element.attr(fail.attribute), element, $)) {
                    messages.push((i18n[fail.messageId || rule.test] === undefined) ? "Aucun message " + (fail.messageId || rule.test) : format(i18n[fail.messageId || rule.test], [placeholders]));
                }
            });
        }

        if (rule.failonelement) {
            var result = true;
            rule.failonelement.forEach(function(check) {
                result = result && check(element, $);
            });
            if (!result) {
                messages.push(format(i18n[rule.test], [placeholders]));
            }
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

    var statut;
    if (elements.length === 0 && rule.checknoelement) {
        statut = 'C';
    } else if (elements.length === 0) {
        statut = 'NA';
    } else {
        statut = (messages.length === 0) ? 'C' : 'NC';
    }
    rule.result = {
        "success": true,
        "statut": statut,
        "messages": messages
    };

    return this;
};

module.exports = rule;
