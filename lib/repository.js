'use strict'

var fs = require('fs');

var rule = require('./rule');
var config = require('config');
var markers = config.get('markers');
var messages = config.get('messages');
var validdoctypes = config.get('validdoctypes');
var bcp47 = require('bcp47');
var util = require('util');
var tags = require('language-tags')

var repository = {};

var champsFormulaire = [
    'input[type="text"]',
    'input[type="password"]',
    'input[type="search"]',
    'input[type="tel"]',
    'input[type="email"]',
    'input[type="number"]',
    'input[type="tel"]',
    'input[type="url"]',
    'textarea',
    'input[type="checkbox"]',
    'input[type="radio"]',
    'input[type="date"]',
    'input[type="range"]',
    'input[type="color"]',
    'input[type="time"]',
    'select',
    'datalist',
    'optgroup',
    'option',
    'keygen',
    'input[type="file"]',
    'output',
    'progress',
    'meter'
];

var getResult = function(success, test) {
    if (!success) {
        return {
            "success": false,
            "messages": [messages[test]]
        };
    } else {
        return {
            "success": true
        }
    }
};

/********************************************************************
 * 1 - Images
 ********************************************************************/


/********************************************************************
/* 1.1 - Chaque image a-t-elle une alternative textuelle ?
********************************************************************/

/**
 * Test 1.1.1 : Chaque image (balise img) a-t-elle un attribut alt ?
 */
repository["1.1.1"] = function(rule) {
    return rule
        .select("img")
        .withattribute('alt')
        .addplaceholders(['src']);
}

/**
 * Test 1.1.2 : Chaque zone (balise area) d’une image réactive a-t-elle un attribut alt ?
 */
repository["1.1.2"] = function(rule) {
    return rule
        .select("area")
        .withattribute('alt')
        .addplaceholders(['src']);
}

/**
 * Test 1.1.3 : Chaque bouton de formulaire (balise input avec l’attribut type="image") a-t-il un attribut alt ?
 */
repository["1.1.3"] = function(rule) {
    return rule
        .select("input[type=image]")
        .withattribute('alt')
        .addplaceholders(['src'])
        .trigger();
}

/**
 * Test 1.1.4 : Chaque zone cliquable d’une image réactive coté serveur est-t-elle doublée d’un lien dans la page ?
 */
repository["1.1.4"] = function(rule) {
    return rule
        .select("img[ismap]:not([usemap])")
        .noelement()
        .addplaceholders(['src']);
}


/********************************************************************
/* 1.2 - Pour chaque image de décoration ayant une alternative textuelle, cette alternative est-elle vide ?
********************************************************************/

/**
 * Test 1.2.1 : Chaque image (balise img) de décoration, sans légende, et ayant un attribut alt, vérifie-t-elle ces conditions ?
 * - Le contenu de l’attribut alt est vide (alt="") ;
 * - L’image de décoration ne possède pas d’attribut title ;
 * - La balise img est dépourvue de rôle, propriété ou état ARIA visant à labelliser l’image (aria-label, aria-describedby, aria-labelledby par exemple).
 */
repository["1.2.1"] = function(rule) {
    // Une image sans légende peut définir :
    // - une image qui n'est pas insérée dans un élément figure ;
    // - une image insérée dans un élément figure sans élément figcaption.
    return rule
        .select("figure:not(figcaption) img.class-decorative-element[alt]")
        .emptyattribute("alt", "1.2.1.1")
        .noattribute("title", "1.2.1.1")
        .noattributepattern('^aria', "1.2.1.1")
        .addplaceholders(['src']);
}

/**
 * Test 1.2.2 : Chaque zone non cliquable (balise area sans attribut href) de décoration, et ayant un attribut alt, vérifie-t-elle ces conditions ?
 * - Le contenu de l’attribut alt est vide (alt="") ;
 * - La zone non cliquable ne possède pas d’attribut title ;
 * - La balise area est dépourvue de rôle, propriété ou état ARIA visant à labelliser l’image (aria-label, aria-describedby, aria-labelledby par exemple).
 */
repository["1.2.2"] = function(rule) {
    return rule
        .select("area.class-decorative-element[alt],area#id-decorative-element[alt],area[alt][role='role-decorative-element']")
        .emptyattribute("alt", "1.2.2.1")
        .noattribute("title", "1.2.2.2")
        .noattributepattern('^aria', "1.2.2.3");
}

/**
 * Test 1.2.3 : Chaque image objet (balise object avec l’attribut type="image/…") de décoration, sans légende, vérifie-t-elle ces conditions ?
 * - La balise object possède un attribut aria-hidden="true" ;
 * - L’alternative textuelle entre <object> et </object> est vide ;
 * - La balise object ou l’un de ses enfants est dépourvue de rôle, propriété ou état ARIA visant à labelliser l’image (aria-label, aria-describedby, aria-labelledby par exemple).
 */
repository["1.2.3"] = function(rule) {
    return rule
        .select("object[type^='image'].class-decorative-element,object[type^='image'][role='role-decorative-element'],#id-decorative-element[type^='image']")
        .attributewithvalue("aria-hidden", "true", "1.2.3.1")
        .notext("1.2.3.2")
        .noattributepattern('^aria', ['aria-hidden'], "1.2.3.3");
}

/**
 * Test 1.2.4 : Chaque image vectorielle (balise svg) de décoration, sans légende, vérifie-t-elle ces conditions ?
 * - La balise svg possède un attribut aria-hidden="true" ;
 * - Les balises title et desc sont absentes ou vides ;
 * - La balise svg ou l’un de ses enfants est dépourvue d’attribut title ;
 * - La balise svg ou l’un de ses enfants est dépourvue de rôle, propriété ou état ARIA visant à labelliser l’image vectorielle (aria-label, aria-describedby, aria-labelledby par exemple).
 */
repository["1.2.4"] = function(rule) {
    return rule
        .select("svg.class-decorative-element,svg[role='role-decorative-element'],svg#id-decorative-element")
        .attributewithvalue("aria-hidden", "true", "1.2.4.1")
        .emptyorundefined("title", "1.2.4.2")
        .emptyorundefined("desc", "1.2.4.3")
        .noattributepattern('^aria', ['aria-hidden'], "1.2.4.4");
}

/**
 * Test 1.2.5 : Chaque image bitmap (balise canvas) de décoration, sans légende, vérifie-t-elle ces conditions ?
 * - La balise canvas possède un attribut aria-hidden="true" ;
 * - Le contenu entre <canvas> et </canvas> est dépourvue de contenus textuels ;
 * - La balise canvas ou l’un de ses enfants est dépourvue de rôle, propriété ou état ARIA visant à labelliser l’image (aria-label, aria-describedby, aria-labelledby par exemple).
 */
repository["1.2.5"] = function(rule) {
    return rule
        .select("canvas.class-decorative-element, canvas[role='role-decorative-element'], canvas#id-decorative-element")
        .attributewithvalue("aria-hidden", "true", "1.2.5.1")
        .notext("1.2.5.2")
        .noattributepattern('^aria', ['aria-hidden'], "1.2.5.3");
}

/**
 * Test 1.2.6 : Chaque image embarquée (balise embed avec l’attribut type="image/…") de décoration, sans légende, vérifie-t-elle ces conditions ?
 * - La balise embed possède un attribut aria-hidden="true" ;
 * - La balise embed ou l’un de ses enfants est dépourvue de rôle, propriété ou état ARIA visant à labelliser l’image (aria-label, aria-describedby, aria-labelledby par exemple).
 */
repository["1.2.6"] = function(rule) {
    return rule
        .select("embed[type='image'].class-decorative-element, embed[type='image'][role='role-decorative-element'], embed[type='image']#id-decorative-element")
        .attributewithvalue("aria-hidden", "true", "1.2.6.1")
        .notext("1.2.6.1")
        .noattributepattern('^aria', ["aria-hidden"], "1.2.6.1");
}

/********************************************************************
/* 1.3 - Pour chaque image porteuse d&#39;information ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?
********************************************************************/

/**
 * Test 1.3.1 : Chaque image (balise img) porteuse d’information, ayant un attribut alt, vérifie-t-elle ces conditions (hors cas particuliers) ?
 * - Le contenu de l’attribut alt est pertinent ;
 * - S’il est présent, le contenu de l’attribut title est identique au contenu de l’attribut alt ;
 * - S’il est présent, le contenu de la propriété aria-label est identique au contenu de l’attribut alt ;
 * - S’il est présent, le contenu du passage de texte lié via la propriété aria-labelledby est identique au contenu de l’attribut alt.
 */
repository["1.3.1"] = function(rule) {
    return rule
        .select("img.class-informative-element[alt], img#id-informative-element[alt], img[role='role-informative-element'][alt]")
        .pertinent("alt", "1.3.1.1")
        .ifpresentequals('title', 'alt', "1.3.1.2")
        .ifpresentequals('aria-label', 'alt', "1.3.1.3")
        .ifpresentequals('aria-labelledby', 'alt', "1.3.1.4");
}

/**
 * Test 1.3.2 : Chaque zone (balise area) d’une image réactive porteuse d’information, ayant un attribut alt, vérifie-t-elle ces conditions (hors cas particuliers) ?
 * - Le contenu de l’attribut alt est pertinent ;
 * - S’il est présent, le contenu de l’attribut title est identique au contenu de l’attribut alt ;
 * - S’il est présent, le contenu de la propriété aria-label est identique au contenu de l’attribut alt ;
 * - S’il est présent, le contenu du passage de texte lié via la propriété aria-labelledby est identique au contenu de l’attribut alt.
 */
repository["1.3.2"] = function(rule) {
    return rule
        .select("area.class-informative-element[alt], area#id-informative-element[alt], area[role='id-informative-element'][alt]")
        .pertinent("alt", "1.3.1.1")
        .ifpresentequals('title', 'alt', "1.3.1.2")
        .ifpresentequals('aria-label', 'alt', "1.3.1.3")
        .ifpresentequals('aria-labelledby', 'alt', "1.3.1.4");
}

/**
 * Test 1.3.3 : Chaque bouton associé à une image (balise input avec l’attribut type="image"), ayant un attribut alt, vérifie-t-il ces conditions (hors cas particuliers) ?
 * - Le contenu de l’attribut alt est pertinent ;
 * - S’il est présent, le contenu de l’attribut title est identique au contenu de l’attribut alt ;
 * - S’il est présent, le contenu de la propriété aria-label est identique au contenu de l’attribut alt ;
 * - S’il est présent, le contenu du passage de texte lié via la propriété aria-labelledby est identique au contenu de l’attribut alt.
 */
repository["1.3.3"] = function(rule) {
    return rule
        .select("input.class-informative-element[type^=image][alt], input#id-informative-element[type^=image][alt], input[role='id-informative-element'][alt][type^=image]")
        .pertinent("alt", "1.3.1.1")
        .ifpresentequals('title', 'alt', "1.3.1.2")
        .ifpresentequals('aria-label', 'alt', "1.3.1.3")
        .ifpresentequals('aria-labelledby', 'alt', "1.3.1.4");
}

/**
 * Test 1.3.4 : Chaque image objet (balise object avec l’attribut type="image/…") porteuse d’information vérifie-t-elle une de ces conditions (hors cas particuliers) ?
 * - L’image objet est immédiatement suivie d’un lien adjacent permettant d’afficher une page ou un passage de texte contenant une alternative pertinente. ;
 * - Un mécanisme permet à l’utilisateur de remplacer l’image objet par un texte alternatif pertinent ;
 * - Un mécanisme permet à l’utilisateur de remplacer l’image objet par une image possédant une alternative pertinente.
 */
repository["1.3.4"] = function(rule) {
    return null;
}

/**
 * Test 1.3.5 : Chaque image objet (balise object avec l’attribut type="image/…") porteuse d’information, qui utilise une propriété aria-label, aria-labelledby ou un attribut title, vérifie-t-elle ces conditions (hors cas particuliers) ?
 * - S’il est présent, le contenu de l’attribut title est identique au contenu de l’attribut aria-label ;
 * - S’il est présent, le contenu de l’attribut title est identique au passage de texte lié par la propriété aria-labelledby.
 */
repository["1.3.5"] = function(rule) {
    return null;
}

/**
 * Test 1.3.6 : Chaque image embarquée (balise embed avec l’attribut type="image/…") porteuse d’information vérifie-t-elle une de ces conditions (hors cas particuliers) ?
 * - L’image embarquée est immédiatement suivie d’un lien adjacent permettant d’afficher une page ou un passage de texte contenant une alternative pertinente ;
 * - Un mécanisme permet à l’utilisateur de remplacer l’image embarquée par un texte alternatif pertinent ;
 * - Un mécanisme permet à l’utilisateur de remplacer l’image embarquée par une image possédant une alternative pertinente.
 */
repository["1.3.6"] = function(rule) {
    return null;
}

/**
 * Test 1.3.7 : Chaque image embarquée (balise embed avec l’attribut type="image/…") porteuse d’information, qui utilise une propriété aria-label, aria-labelledby ou un attribut title, vérifie-t-elle ces conditions (hors cas particuliers) ?
 * - S’il est présent, le contenu de l’attribut title est identique au contenu de l’attribut aria-label ;
 * - S’il est présent, le contenu de l’attribut title est identique au passage de texte lié par la propriété aria-labelledby.
 */
repository["1.3.7"] = function(rule) {
    return null;
}

/**
 * Test 1.3.8 : Chaque image vectorielle (balise svg) porteuse d’information, en l’absence d’alternative, vérifie-t-elle ces conditions (hors cas particuliers) ?
 * - La balise svg possède un role="img" ;
 * - La balise svg possède une propriété aria-label dont le contenu est pertinent et identique à l’attribut title s’il est présent ;
 * - La balise svg possède une balise desc dont le contenu est pertinent et contient un passage de texte identique à la propriété aria-label et à l’attribut title de la balise svg s’il est présent.
 */
repository["1.3.8"] = function(rule) {
    return null;
}

/**
 * Test 1.3.9 : Pour chaque image vectorielle (balise svg) porteuse d’information et possédant une alternative, cette alternative est-elle correctement restituée par les technologies d’assistance ?
 */
repository["1.3.9"] = function(rule) {
    return null;
}

/**
 * Test 1.3.10 : Chaque image bitmap (balise canvas) porteuse d’information vérifie-t-elle une de ces conditions (hors cas particuliers) ?
 * - Le contenu de l’alternative (contenu entre <canvas> et </canvas>) est pertinent ;
 * - L’image bitmap est immédiatement suivie d’un lien adjacent permettant d’afficher une page ou un passage de texte contenant une alternative pertinente ;
 * - Un mécanisme permet à l’utilisateur de remplacer l’image bitmap par un texte alternatif pertinent ;
 * - Un mécanisme permet à l’utilisateur de remplacer l’image bitmap par une image possédant une alternative pertinente.
 */
repository["1.3.10"] = function(rule) {
    return null;
}

/**
 * Test 1.3.11 : Chaque image bitmap (balise canvas) porteuse d’information, qui utilise une propriété aria-label, aria-labelledby ou un attribut title, vérifie-t-elle ces conditions (hors cas particuliers) ?
 * - S’il est présent, le contenu de l’attribut title est identique au contenu de l’attribut aria-label ;
 * - S’il est présent, le contenu de l’attribut title est identique au passage de texte lié par la propriété aria-labelledby.
 */
repository["1.3.11"] = function(rule) {
    return null;
}

/**
 * Test 1.3.12 : Pour chaque image bitmap (balise canvas) porteuse d’information et possédant une alternative (contenu entre <canvas> et </canvas>), cette alternative est-elle correctement restituée par les technologies d’assistance ?
 */
repository["1.3.12"] = function(rule) {
    return null;
}

/**
 * Test 1.3.13 : Pour chaque image porteuse d’information et ayant une alternative textuelle, l’alternative textuelle est-elle courte et concise (hors cas particuliers) ?
 */
repository["1.3.13"] = function(rule) {
    return null;
}

/********************************************************************
/* 1.4 - Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d&#39;identifier la nature et la fonction de l&#39;image ?
********************************************************************/

/**
 *
 */
repository["1.4.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.4.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.4.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.4.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.4.5"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.4.6"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.4.7"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.4.8"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.4.9"] = function(rule) {
    return null;
}


/********************************************************************
/* 1.5 - Pour chaque image utilisée comme CAPTCHA, une solution d&#39;accès alternatif au contenu ou à la fonction du CAPTCHA est-elle présente ?
********************************************************************/

/**
 *
 */
repository["1.5.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.5.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 1.6 - Chaque image porteuse d&#39;information a-t-elle, si nécessaire, une description détaillée ?
********************************************************************/

/**
 *
 */
repository["1.6.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.6.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.6.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.6.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.6.5"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.6.6"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.6.7"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.6.8"] = function(rule) {
    return null;
}


/********************************************************************
/* 1.7 - Pour chaque image porteuse d&#39;information ayant une description détaillée, cette description est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["1.7.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.7.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.7.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.7.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.7.5"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.7.6"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.7.7"] = function(rule) {
    return null;
}


/********************************************************************
/* 1.8 - Chaque image texte porteuse d&#39;information, en l&#39;absence d&#39;un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["1.8.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.8.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.8.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.8.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.8.5"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.8.6"] = function(rule) {
    return null;
}


/********************************************************************
/* 1.9 - Chaque image texte porteuse d&#39;information, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["1.9.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.9.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.9.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.9.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.9.5"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.9.6"] = function(rule) {
    return null;
}


/********************************************************************
/* 1.10 - Chaque légende d&#39;image est-elle, si nécessaire, correctement reliée à l&#39;image correspondante ?
********************************************************************/

/**
 *
 */
repository["1.10.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.10.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.10.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.10.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["1.10.5"] = function(rule) {
    return null;
}


/********************************************************************
 * 2 - Cadres
 ********************************************************************/


/********************************************************************
/* 2.1 - Chaque cadre en ligne a-t-il un titre de cadre ?
********************************************************************/

/**
 * Test 2.1.1 : Chaque cadre en ligne (balise iframe) a-t-il un attribut title ?
 */
repository["2.1.1"] = function(rule) {
    return rule
        .select("iframe, frame")
        .withattribute('title')
        .addplaceholders(['src']);
}


/********************************************************************
/* 2.2 - Pour chaque cadre en ligne ayant un titre de cadre, ce titre de cadre est-il pertinent ?
********************************************************************/

/**
 * Test 2.2.1 : Pour chaque cadre en ligne (balise iframe) ayant un attribut title, le contenu de cet attribut est-il pertinent ?
 */
repository["2.2.1"] = function(rule) {
    return rule
        .select("iframe, frame")
        .pertinent('title')
        .addplaceholders(['src']);
}


/********************************************************************
 * 3 - Couleurs
 ********************************************************************/


/********************************************************************
/* 3.1 - Dans chaque page Web, l&#39;information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["3.1.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.1.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.1.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.1.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.1.5"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.1.6"] = function(rule) {
    return null;
}


/********************************************************************
/* 3.2 - Dans chaque page Web, l&#39;information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle implémentée de façon pertinente ?
********************************************************************/

/**
 *
 */
repository["3.2.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.2.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.2.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.2.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.2.5"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.2.6"] = function(rule) {
    return null;
}


/********************************************************************
/* 3.3 - Dans chaque page Web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["3.3.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.3.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.3.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.3.4"] = function(rule) {
    return null;
}


/********************************************************************
/* 3.4 - Dans chaque page Web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il amélioré (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["3.4.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.4.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.4.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["3.4.4"] = function(rule) {
    return null;
}


/********************************************************************
 * 4 - Multimédia
 ********************************************************************/


/********************************************************************
/* 4.1 - Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audio-description (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.1.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.1.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.1.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.2 - Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audio-description synchronisée, celles-ci sont-elles pertinentes (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.2.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.2.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.2.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.3 - Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.3.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.3.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.4 - Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?
********************************************************************/

/**
 *
 */
repository["4.4.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.5 - Chaque média temporel en direct a-t-il, si nécessaire, des sous-titres synchronisés ou une transcription textuelle (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.5.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.5.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.6 - Pour chaque média temporel en direct ayant des sous-titres synchronisés ou une transcription textuelle, ceux-ci sont-ils pertinents ?
********************************************************************/

/**
 *
 */
repository["4.6.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.6.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.7 - Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audio-description synchronisée (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.7.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.7.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.8 - Pour chaque média temporel pré-enregistré ayant une audio-description synchronisée, celle-ci est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["4.8.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.8.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.9 - Chaque média temporel pré-enregistré a-t-il, si nécessaire, une interprétation en langue des signes (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.9.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.9.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.10 - Pour chaque média temporel pré-enregistré ayant une interprétation en langue des signes, celle-ci est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["4.10.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.10.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.11 - Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audio-description étendue synchronisée (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.11.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.11.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.12 - Pour chaque média temporel pré-enregistré ayant une audio-description étendue synchronisée, celle-ci est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["4.12.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.12.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.13 - Chaque média temporel synchronisé ou seulement vidéo a-t-il, si nécessaire, une transcription textuelle (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.13.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.13.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.14 - Pour chaque média temporel synchronisé ou seulement vidéo, ayant une transcription textuelle, celle-ci est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["4.14.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.14.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.15 - Chaque média temporel est-il clairement identifiable (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.15.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.15.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.16 - Chaque média non temporel a-t-il, si nécessaire, une alternative (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.16.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.16.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.17 - Pour chaque média non temporel ayant une alternative, cette alternative est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["4.17.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.18 - Chaque son déclenché automatiquement est-il contrôlable par l&#39;utilisateur ?
********************************************************************/

/**
 *
 */
repository["4.18.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.19 - Pour chaque média temporel seulement audio pré-enregistré, les dialogues sont-ils suffisamment audibles (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.19.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.20 - La consultation de chaque média temporel est-elle, si nécessaire, contrôlable par le clavier et la souris ?
********************************************************************/

/**
 *
 */
repository["4.20.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.20.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.20.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.21 - La consultation de chaque média non temporel est-elle contrôlable par le clavier et la souris ?
********************************************************************/

/**
 *
 */
repository["4.21.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.21.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 4.22 - Chaque média temporel et non temporel est-il compatible avec les technologies d&#39;assistance (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.22.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["4.22.2"] = function(rule) {
    return null;
}


/********************************************************************
 * 5 - Tableaux
 ********************************************************************/


/********************************************************************
/* 5.1 - Chaque tableau de données complexe a-t-il un résumé ?
********************************************************************/

/**
 *
 */
repository["5.1.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 5.2 - Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["5.2.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 5.3 - Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?
********************************************************************/

/**
 *
 */
repository["5.3.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 5.4 - Chaque tableau de données a-t-il un titre ?
********************************************************************/


/********************************************************************
/* 5.5 - Pour chaque tableau de données ayant un titre, celui-ci est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["5.5.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 5.6 - Pour chaque tableau de données, chaque en-tête de colonnes et chaque en-tête de lignes sont-ils correctement déclarés ?
********************************************************************/

/**
 *
 */
repository["5.6.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["5.6.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 5.7 - Pour chaque tableau de données, la technique appropriée permettant d&#39;associer chaque cellule avec ses en-têtes est-elle utilisée ?
********************************************************************/

/**
 *
 */
repository["5.7.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["5.7.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["5.7.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["5.7.4"] = function(rule) {
    return null;
}


/********************************************************************
/* 5.8 - Chaque tableau de mise en forme ne doit pas utiliser d&#39;éléments propres aux tableaux de données. Cette règle est-elle respectée ?
********************************************************************/


/**
 * Test 5.8.1 : Chaque tableau de mise en forme (balise table) vérifie-t-il ces conditions ?
 * Le tableau de mise en forme (balise table) ne possède pas de balises caption, th, thead, tfoot ;
 * Les cellules du tableau de mise en forme (balise td) ne possèdent pas d’attributs scope, headers, colgroup, axis
 */
repository["5.8.1"] = function(rule) {
    return rule('5.8.1', $).select("table." + markers['layout-table-class']).addnochildren(['caption', 'th', 'thead', 'tfoot'], '5.8.1.1').addnochildwithattributes('td', ['scope', 'headers', 'colgroup', 'axis'], '5.8.1.2').trigger();
}


/********************************************************************
 * 6 - Liens
 ********************************************************************/


/********************************************************************
/* 6.1 - Chaque lien est-il explicite (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["6.1.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.1.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.1.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.1.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.1.5"] = function(rule) {
    return null;
}


/********************************************************************
/* 6.2 - Pour chaque lien ayant un titre de lien, celui-ci est-il pertinent ?
********************************************************************/

/**
 * Test 6.2.1 : Pour chaque lien texte ayant un titre de lien (attribut title), le contenu de cet attribut est-il pertinent ?
 * Un lien texte est un lien dont le contenu entre <a href="…"> et </a> est uniquement constitué de texte (il s’agit de son intitulé de lien).
 * Contenu de l’attribut title d’un lien. Ce contenu ne doit être présent que s’il est nécessaire pour identifier la destination du lien de manière explicite. Un titre de lien doit reprendre l’intitulé de lien en y ajoutant des informations. Un titre de lien sera considéré comme non-pertinent dans les cas suivants :
 * - Le titre de lien est vide ;
 * - Le titre de lien est identique à l’intitulé du lien (Cf. note 1) ;
 * - Le titre de lien ne reprend pas l’intitulé du lien.
 * - Note 1 : Par exception, un titre de lien identique à l’intitulé est accepté dans le seul cas d’un lien image (lien ne contenant que des images), une icône par exemple.
 * - Note 2 : Il est rappelé que l’attribut title peut poser de vrais problèmes de restitution, par exemple au clavier, sur les surfaces tactiles, lorsqu’une technologie d’assistance est paramétrée pour ne pas les restituer et ne devrait être utilisé qu’en dernier recours.
 */
repository["6.2.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.2.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.2.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.2.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.2.5"] = function(rule) {
    return null;
}


/********************************************************************
/* 6.3 - Chaque intitulé de lien seul est-il explicite hors contexte (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["6.3.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.3.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.3.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.3.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.3.5"] = function(rule) {
    return null;
}


/********************************************************************
/* 6.4 - Pour chaque page web, chaque lien identique a-t-il les mêmes fonction et destination ?
********************************************************************/

/**
 *
 */
repository["6.4.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.4.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.4.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.4.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["6.4.5"] = function(rule) {
    return null;
}


/********************************************************************
/* 6.5 - Dans chaque page Web, chaque lien, à l&#39;exception des ancres, a-t-il un intitulé ?
********************************************************************/

/**
 *
 */
repository[""] = function(rule) {
    return null;
}


/********************************************************************
 * 7 - Scripts
 ********************************************************************/


/********************************************************************
/* 7.1 - Chaque script est-il, si nécessaire, compatible avec les technologies d&#39;assistance ?
********************************************************************/

/**
 *
 */
repository["7.1.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["7.1.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["7.1.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["7.1.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["7.1.5"] = function(rule) {
    return null;
}

/**
 *
 */
repository["7.1.6"] = function(rule) {
    return null;
}


/********************************************************************
/* 7.2 - Pour chaque script ayant une alternative, cette alternative est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["7.2.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["7.2.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 7.3 - Chaque script est-il contrôlable par le clavier et la souris (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["7.3.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["7.3.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["7.3.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["7.3.4"] = function(rule) {
    return null;
}


/********************************************************************
/* 7.4 - Pour chaque script qui initie un changement de contexte, l&#39;utilisateur est-il averti ou en a-t-il le contrôle ?
********************************************************************/

/**
 *
 */
repository["7.4.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 7.5 - Chaque script qui provoque une alerte non sollicitée est-il contrôlable par l&#39;utilisateur (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["7.5.1"] = function(rule) {
    return null;
}


/********************************************************************
 * 8 - Éléments Obligatoires
 ********************************************************************/


/********************************************************************
/* 8.1 - Chaque page Web est-elle définie par un type de document ?
********************************************************************/

/**
 *
 */
repository["8.1.1"] = function(rule) {
    var jsdom = require("node-jsdom").jsdom;
    var document = jsdom(content);
    var window = document.defaultView;

    return getResult(window.document.doctype !== null, '8.1.1');
}

/**
 *
 */
repository["8.1.2"] = function(rule) {
    var jsdom = require("node-jsdom").jsdom;
    var document = jsdom(content);
    var window = document.defaultView;
    if (window.document.doctype == null) {
        return getResult(false, '8.1.1');
    } else {
        return getResult(validdoctypes.indexOf(window.document.doctype.publicId) !== -1, '8.1.2');
    }
};

/**
 *
 */
repository["8.1.3"] = function(rule) {
    var jsdom = require("node-jsdom").jsdom;
    var document = jsdom(content);
    var window = document.defaultView;

    if (window.document.doctype === null && content.indexOf("<!DOCTYPE") !== -1) {
        return getResult(false, '8.1.3');
    }

    if (window.document.doctype === null) {
        return getResult(false, '8.1.1');
    }
    if (validdoctypes.indexOf(window.document.doctype.publicId) === -1) {
        return getResult(false, '8.1.2');
    }

    return {
        "success": true
    };
};


/********************************************************************
/* 8.2 - Pour chaque page Web, le code source est-il valide selon le type de document spécifié hors cas particuliers ?
********************************************************************/

/**
 *
 */
repository["8.2.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["8.2.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 8.3 - Dans chaque page Web, la langue par défaut est-elle présente ?
********************************************************************/

/**
 * Test 8.3.1 : Pour chaque page Web, l’indication de langue par défaut vérifie-t-elle une de ces conditions ?
 * L’indication de la langue de la page (attribut lang et/ou xml:lang) est donnée pour l’élément html ;
 * L’indication de la langue de la page (attribut lang et/ou xml:lang) est donnée sur chaque élément de texte ou sur l’un des éléments parents.
 */
repository["8.3.1"] = function(rule) {
    return getResult($('html[xml\\:lang]').length + ($("html[lang]")).length > 0, '8.3.1');
}


/********************************************************************
/* 8.4 - Pour chaque page Web ayant une langue par défaut, le code de langue est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["8.4.1"] = function(rule) {
    if ($('html[xml\\:lang]').length + ($("html[lang]")).length === 0) {
        return getResult(false, '8.3.1');
    }

    var valid = true;
    if ($('html').attr('lang') !== null) {
        valid = tags.check($('html').attr('lang'));
    }

    if ($('html').attr('xml:lang') !== null) {
        valid = valid && tags.check($('html').attr('xml:lang'));
    }

    return getResult(valid, '8.4.1');
}


/********************************************************************
/* 8.5 - Chaque page Web a-t-elle un titre de page ?
********************************************************************/

/**
 * Test 8.5.1 : Chaque page Web a-t-elle un titre de page (balise title) ?
 */
repository["8.5.1"] = function(rule) {
    return rule("8.5.1", $).select("head:not(:has(>title))").noelement().trigger();
}


/********************************************************************
/* 8.6 - Pour chaque page Web ayant un titre de page, ce titre est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["8.6.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 8.7 - Dans chaque page Web, chaque changement de langue est-il indiqué dans le code source (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["8.7.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 8.8 - Dans chaque page Web, chaque changement de langue est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["8.8.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["8.8.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 8.9 - Dans chaque page Web, les balises ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["8.9.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 8.10 - Dans chaque page Web, les changements du sens de lecture sont-ils signalés ?
********************************************************************/

/**
 *
 */
repository["8.10.1"] = function(rule) {
    return null;
}


/********************************************************************
 * 9 - Structuration de l&#39;information
 ********************************************************************/


/********************************************************************
/* 9.1 - Dans chaque page Web, l&#39;information est-elle structurée par l&#39;utilisation appropriée de titres ?
********************************************************************/

/**
 *
 */
repository["9.1.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["9.1.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["9.1.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["9.1.4"] = function(rule) {
    return null;
}


/********************************************************************
/* 9.2 - Dans chaque page Web, la structure du document est-elle cohérente ?
********************************************************************/

/**
 *
 */
repository["9.2.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["9.2.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 9.3 - Dans chaque page Web, chaque liste est-elle correctement structurée ?
********************************************************************/

/**
 *
 */
repository["9.3.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["9.3.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["9.3.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 9.4 - Dans chaque page Web, la première occurrence de chaque abréviation permet-elle d&#39;en connaître la signification ?
********************************************************************/

/**
 *
 */
repository["9.4.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 9.5 - Dans chaque page Web, la signification de chaque abréviation est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["9.5.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 9.6 - Dans chaque page Web, chaque citation est-elle correctement indiquée ?
********************************************************************/

/**
 *
 */
repository["9.6.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["9.6.2"] = function(rule) {
    return null;
}


/********************************************************************
 * 10 - Présentation de l&#39;information
 ********************************************************************/


/********************************************************************
/* 10.1 - Dans le site Web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l&#39;information ?
********************************************************************/

/**
 *
 */
repository["10.1.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.1.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.1.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.2 - Dans chaque page Web, le contenu visible reste-t-il présent lorsque les feuilles de styles sont désactivées ?
********************************************************************/

/**
 *
 */
repository["10.2.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.3 - Dans chaque page Web, l&#39;information reste-t-elle compréhensible lorsque les feuilles de styles sont désactivées ?
********************************************************************/

/**
 *
 */
repository["10.3.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.4 - Dans chaque page Web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu&#39;à 200%, au moins ?
********************************************************************/

/**
 *
 */
repository["10.4.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.4.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.4.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.5 - Dans chaque page Web, les déclarations CSS de couleurs de fond d&#39;élément et de police sont-elles correctement utilisées ?
********************************************************************/

/**
 *
 */
repository["10.5.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.5.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.5.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.6 - Dans chaque page Web, chaque lien dont la nature n&#39;est pas évidente est-il visible par rapport au texte environnant ?
********************************************************************/

/**
 *
 */
repository["10.6.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.7 - Dans chaque page Web, pour chaque élément recevant le focus, la prise de focus est-elle visible ?
********************************************************************/

/**
 *
 */
repository["10.7.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.7.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.7.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.8 - Dans chaque page Web, le choix de la couleur de fond et de police du texte est-il contrôlable par l&#39;utilisateur ?
********************************************************************/

/**
 *
 */
repository["10.8.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.8.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.8.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.8.4"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.9 - Pour chaque page Web, le texte ne doit pas être justifié. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["10.9.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.10 - Pour chaque page Web, en affichage plein écran et avec une taille de police à 200%, chaque bloc de texte reste-t-il lisible sans l&#39;utilisation de la barre de défilement horizontal ?
********************************************************************/

/**
 *
 */
repository["10.10.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.11 - Pour chaque page Web, les blocs de texte ont-ils une largeur inférieure ou égale à 80 caractères (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["10.11.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.12 - Pour chaque page Web, l&#39;espace entre les lignes et les paragraphes est-il suffisant ?
********************************************************************/

/**
 *
 */
repository["10.12.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.12.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.13 - Pour chaque page Web, les textes cachés sont-ils correctement affichés pour être restitués par les technologies d&#39;assistance ?
********************************************************************/

/**
 *
 */
repository["10.13.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.13.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.13.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.14 - Dans chaque page Web, l&#39;information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["10.14.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.14.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.14.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.14.4"] = function(rule) {
    return null;
}


/********************************************************************
/* 10.15 - Dans chaque page Web, l&#39;information ne doit pas être donnée par la forme, taille ou position uniquement. Cette règle est-elle implémentée de façon pertinente ?
********************************************************************/

/**
 *
 */
repository["10.15.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.15.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.15.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["10.15.4"] = function(rule) {
    return null;
}


/********************************************************************
 * 11 - Formulaires
 ********************************************************************/


/********************************************************************
/* 11.1 - Chaque champ de formulaire a-t-il une étiquette ?
********************************************************************/

/**
 * Test 11.1.1 : Chaque champ de formulaire vérifie-t-il une de ces conditions ?
 * - Le champ de formulaire possède un attribut title ;
 * - Une étiquette (balise label) est associée au champ de formulaire ;
 * - Le champ de formulaire possède une propriété aria-label ;
 * - Le champ de formulaire possède une propriété aria-labelledby référençant un passage de texte identifié.
 */
repository["11.1.1"] = function(rule, context) {
    return rule
        .select(champsFormulaire.join(','))
        .withattribute('title', "11.1.1_1")
        .withattribute('aria-labelledby', "11.1.1_2")
        .withattribute('aria-label', "11.1.1_3")
        .addfailonelement(function(element, $) {
          return context.$('label[for=' + $(element).attr('id') + ']').length === 1;
        }, "11.1.1_4");
}

/**
 * Test 11.1.2 : Chaque champ de formulaire, associé à une étiquette (balise label), vérifie-t-il ces conditions ?
 * - Le champ de formulaire possède un attribut id ;
 * - La valeur de l’attribut id est unique ;
 * - La balise label possède un attribut for ;
 * - La valeur de l’attribut for est égale à la valeur de l’attribut id du champ de formulaire associé.
 */
repository["11.1.2"] = function(rule) {
    return null;
}

/**
 * Test 11.1.3 : Chaque champ de formulaire associé à une étiquette via la propriété ARIA aria-labelledby, vérifie-t-il ces conditions ?
 * - L’étiquette possède un attribut id ;
 * - La valeur de l’attribut id est unique ;
 * - Les valeurs de la propriété ARIA aria-labelledby sont égales à la valeur des attributs id des passages de textes utilisés pour créer l’étiquette ;
 * - L’étiquette liée par la propriété ARIA aria-labelledby est visible à la prise de focus au moins.
 */
repository["11.1.3"] = function(rule) {
    return null;
}

/**
 * Test 11.1.4 : Chaque champ de formulaire qui utilise une propriété ARIA aria-label doit être accompagné d’un passage de texte visible et accolé au champ permettant de comprendre la nature de la saisie attendue. Cette règle est-elle respectée ?
 */
repository["11.1.4"] = function(rule) {
    return null;
}

/**
 * Test 11.1.5 : Chaque champ de formulaire qui utilise un attribut title comme étiquette, vérifie-t-il une de ces conditions ?
 * - L’attribut placeholder est absent ;
 * - L’attribut placeholder est identique à l’attribut title.
 */
repository["11.1.5"] = function(rule) {
    var champs = []
    champsFormulaire.forEach(function(c) {
        champs.push(c + ":not([title=''])");
    });
    return rule
        .select(champs.join(','))
        .ifpresentequals('placeholder', 'title', "11.1.5.1");
}

/********************************************************************
/* 11.2 - Chaque étiquette associée à un champ de formulaire est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["11.2.1"] = function(rule) {
    var champs = []
    champsFormulaire.forEach(function(c) {
        champs.push(c + ":not([title=''])");
    });
    return null;
}

/**
 *
 */
repository["11.2.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.2.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.2.4"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.3 - Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?
********************************************************************/

/**
 *
 */
repository["11.3.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.3.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.4 - Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés ?
********************************************************************/

/**
 *
 */
repository["11.4.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.5 - Dans chaque formulaire, les informations de même nature sont-elles regroupées, si nécessaire ?
********************************************************************/

/**
 *
 */
repository["11.5.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.6 - Dans chaque formulaire, chaque regroupement de champs de formulaire a-t-il une légende ?
********************************************************************/

/**
 *
 */
repository["11.6.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.7 - Dans chaque formulaire, chaque légende associée à un groupement de champs de formulaire est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["11.7.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.8 - Dans chaque formulaire, chaque liste de choix est-elle structurée de manière pertinente ?
********************************************************************/

/**
 *
 */
repository["11.8.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.8.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.8.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.9 - Dans chaque formulaire, l&#39;intitulé de chaque bouton est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["11.9.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.9.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.10 - Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente ?
********************************************************************/

/**
 *
 */
repository["11.10.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.10.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.10.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.10.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.10.5"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.10.6"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.10.7"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.10.8"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.10.9"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.11 - Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?
********************************************************************/

/**
 *
 */
repository["11.11.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.11.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.12 - Pour chaque formulaire, les données à caractère financier, juridique ou personnel peuvent-elles être modifiées, mises à jour ou récupérées par l&#39;utilisateur ?
********************************************************************/

/**
 *
 */
repository["11.12.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.12.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.13 - Pour chaque formulaire, toutes les données peuvent-elles être modifiées, mises à jour ou récupérées par l&#39;utilisateur ?
********************************************************************/

/**
 *
 */
repository["11.13.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.13.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.14 - Pour chaque formulaire, des aides à la saisie sont-elles présentes ?
********************************************************************/

/**
 *
 */
repository["11.14.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.14.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.14.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.14.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.14.5"] = function(rule) {
    return null;
}

/**
 *
 */
repository["11.14.6"] = function(rule) {
    return null;
}


/********************************************************************
/* 11.15 - Pour chaque formulaire, chaque aide à la saisie est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["11.15.1"] = function(rule) {
    return null;
}


/********************************************************************
 * 12 - Navigation
 ********************************************************************/


/********************************************************************
/* 12.1 - Chaque ensemble de pages dispose-t-il de deux systèmes de navigation différents, au moins (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["12.1.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.2 - Dans chaque ensemble de pages, le menu ou les barres de navigation sont-ils toujours à la même place (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["12.2.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository[""] = function(rule) {
    return null;
}


/********************************************************************
/* 12.3 - Dans chaque ensemble de pages, le menu et les barres de navigation ont-ils une présentation cohérente (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["12.3.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.3.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.4 - La page &quot;plan du site&quot; est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["12.4.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.4.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.4.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.5 - Dans chaque ensemble de pages, la page &quot;plan du site&quot; est-elle atteignable de manière identique ?
********************************************************************/

/**
 *
 */
repository["12.5.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.5.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.5.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.6 - Dans chaque ensemble de pages, le moteur de recherche est-il atteignable de manière identique ?
********************************************************************/

/**
 *
 */
repository["12.6.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.6.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.6.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.7 - Dans chaque page d&#39;une collection de pages, des liens facilitant la navigation sont-ils présents ?
********************************************************************/

/**
 *
 */
repository["12.7.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.8 - Dans chaque page web, un fil d&#39;Ariane est-il présent (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["12.8.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.9 - Dans chaque page Web, le fil d&#39;Ariane est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["12.9.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.10 - Dans chaque page Web, les groupes de liens importants (menu, barre de navigation...) et la zone de contenu sont-ils identifiés hors cas particuliers ?
********************************************************************/

/**
 *
 */
repository["12.10.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.10.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.10.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.10.4"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.11 - Dans chaque page Web, des liens d&#39;évitement ou d&#39;accès rapide aux groupes de liens importants et à la zone de contenu sont-ils présents hors cas particuliers ?
********************************************************************/

/**
 *
 */
repository["12.11.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.11.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.11.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.11.4"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.12 - Dans chaque page Web, la page en cours de consultation est-elle indiquée dans le menu de navigation ?
********************************************************************/

/**
 *
 */
repository["12.12.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.13 - Dans chaque page Web, l&#39;ordre de tabulation est-il cohérent ?
********************************************************************/

/**
 *
 */
repository["12.13.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["12.13.2"] = function(rule) {
    return null;
}


/********************************************************************
/* 12.14 - Dans chaque page Web, la navigation ne doit pas contenir de piège au clavier. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["12.14.1"] = function(rule) {
    return null;
}


/********************************************************************
 * 13 - Consultation
 ********************************************************************/


/********************************************************************
/* 13.1 - Pour chaque page Web, l&#39;utilisateur a-t-il le contrôle de chaque limite de temps modifiant le contenu (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["13.1.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.1.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.1.3"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.1.4"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.1.5"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.2 - Dans chaque page Web, pour chaque ouverture de nouvelle fenêtre, l&#39;utilisateur est-il averti ?
********************************************************************/

/**
 *
 */
repository["13.2.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.2.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.2.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.3 - Dans chaque page Web, l&#39;ouverture d&#39;une nouvelle fenêtre ne doit pas être déclenchée sans action de l&#39;utilisateur. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["13.3.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.4 - Dans chaque page Web, une tâche ne doit pas requérir de limite de temps pour être réalisée, sauf si elle se déroule en temps réel ou si cette limite de temps est essentielle. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["13.4.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.5 - Dans chaque page Web, lors d&#39;une interruption de session authentifiée, les données saisies par l&#39;utilisateur sont-elles récupérées après ré-authentification ?
********************************************************************/

/**
 *
 */
repository["13.5.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.6 - Dans chaque page Web, pour chaque fichier en téléchargement, des informations relatives à sa consultation sont-elles présentes (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["13.6.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.6.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.6.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.7 - Dans chaque page Web, chaque document bureautique en téléchargement possède-t-il, si nécessaire, une version accessible ?
********************************************************************/

/**
 *
 */
repository["13.7.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.8 - Pour chaque document bureautique ayant une version accessible, cette version offre-t-elle la même information ?
********************************************************************/

/**
 *
 */
repository["13.8.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.9 - Dans chaque page Web, les expressions inhabituelles, les expressions idiomatiques ou le jargon sont-ils explicités ?
********************************************************************/

/**
 *
 */
repository["13.9.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.10 - Dans chaque page Web, pour chaque expression inhabituelle ou limitée, idiomatique ou de jargon ayant une définition, cette définition est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["13.10.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.11 - Dans chaque page Web, chaque contenu cryptique (art ascii, émoticon, syntaxe cryptique) a-t-il une alternative ?
********************************************************************/

/**
 *
 */
repository["13.11.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.12 - Dans chaque page Web, pour chaque contenu cryptique (art ascii, émoticon, syntaxe cryptique) ayant une alternative, cette alternative est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["13.12.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.13 - Dans chaque page Web, pour chaque mot dont le sens ne peut être compris sans en connaître la prononciation, celle-ci est-elle indiquée ?
********************************************************************/

/**
 *
 */
repository["13.13.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.14 - Dans chaque page Web, chaque texte qui nécessite un niveau de lecture plus avancé que le premier cycle de l&#39;enseignement secondaire a-t-il une version alternative ?
********************************************************************/

/**
 *
 */
repository["13.14.1"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.15 - Dans chaque page Web, les changements brusques de luminosité ou les effets de flash sont-ils correctement utilisés ?
********************************************************************/

/**
 *
 */
repository["13.15.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.15.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.15.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.16 - Dans chaque page Web, les changements brusques de luminosité ou les effets de flash ont-ils une fréquence inférieure ou égale à 3 par seconde ?
********************************************************************/

/**
 *
 */
repository["13.16.1"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.16.2"] = function(rule) {
    return null;
}

/**
 *
 */
repository["13.16.3"] = function(rule) {
    return null;
}


/********************************************************************
/* 13.17 - Dans chaque page Web, chaque contenu en mouvement ou clignotant est-il contrôlable par l&#39;utilisateur ?
********************************************************************/

/**
 * Test 13.17.1 : Dans chaque page Web, chaque contenu en mouvement, déclenché automatiquement, vérifie-t-il une de ces conditions ?
 * - La durée du mouvement est inférieure ou égale à 5 secondes ;
 * - L’utilisateur peut arrêter et relancer le mouvement ;
 * - L’utilisateur peut afficher et masquer le contenu en mouvement ;
 * - L’utilisateur peut afficher la totalité de l’information sans le mouvement.
 */
repository["13.17.1"] = function(rule) {
    return null;
}

/**
 * Test 13.17.2 : Dans chaque page Web, chaque contenu clignotant, déclenché automatiquement, vérifie-t-il une de ces conditions ?
 * - La durée du clignotement est inférieure ou égale à 5 secondes ;
 * - L’utilisateur peut arrêter et relancer le clignotement ;
 * - L’utilisateur peut afficher et masquer le contenu clignotant ;
 * - L’utilisateur peut afficher la totalité de l’information sans le clignotement.
 */
repository["13.17.2"] = function(rule) {
    return null;
}

module.exports = repository;
