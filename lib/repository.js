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
 *
 */
repository["1.1.1"] = function($, content) {
    return rule('1.1.1', $).select("img:not([alt])").noelement().addplaceholders(['src']).trigger().result;
}

/**
 *
 */
repository["1.1.2"] = function($, content) {
    return rule('1.1.2', $).select("area:not([alt])").noelement().addplaceholders(['src']).trigger().result;
}

/**
 *
 */
repository["1.1.3"] = function($, content) {
    return rule('1.1.3', $).select("input[type=image]:not([alt])").noelement().addplaceholders(['src']).trigger().result;
}

/**
 *
 */
repository["1.1.4"] = function($, content) {
    return rule('1.1.4', $).select("img[ismap]:not([usemap])").noelement().addplaceholders(['src']).trigger().result;
}


/********************************************************************
/* 1.2 - Pour chaque image de décoration ayant une alternative textuelle, cette alternative est-elle vide ?
********************************************************************/

/**
 *
 */
repository["1.2.1"] = function($, content) {
    return rule('1.2.1', $).select("area[href]").notundefinedattribute('alt', undefined).notnullattribute('href').addplaceholders(['href']).trigger().result;
}

/**
 *
 */
repository["1.2.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.2.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.2.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.2.5"] = function($, content) {
    return null;
}


/********************************************************************
/* 1.3 - Pour chaque image porteuse d&#39;information ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["1.3.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.3.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.3.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.3.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.3.5"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.3.6"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.3.7"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.3.8"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.3.9"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.3.10"] = function($, content) {
    return null;
}


/********************************************************************
/* 1.4 - Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d&#39;identifier la nature et la fonction de l&#39;image ?
********************************************************************/

/**
 *
 */
repository["1.4.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.4.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.4.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.4.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.4.5"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.4.6"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.4.7"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.4.8"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.4.9"] = function($, content) {
    return null;
}


/********************************************************************
/* 1.5 - Pour chaque image utilisée comme CAPTCHA, une solution d&#39;accès alternatif au contenu ou à la fonction du CAPTCHA est-elle présente ?
********************************************************************/

/**
 *
 */
repository["1.5.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.5.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 1.6 - Chaque image porteuse d&#39;information a-t-elle, si nécessaire, une description détaillée ?
********************************************************************/

/**
 *
 */
repository["1.6.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.6.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.6.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.6.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.6.5"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.6.6"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.6.7"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.6.8"] = function($, content) {
    return null;
}


/********************************************************************
/* 1.7 - Pour chaque image porteuse d&#39;information ayant une description détaillée, cette description est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["1.7.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.7.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.7.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.7.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.7.5"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.7.6"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.7.7"] = function($, content) {
    return null;
}


/********************************************************************
/* 1.8 - Chaque image texte porteuse d&#39;information, en l&#39;absence d&#39;un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["1.8.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.8.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.8.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.8.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.8.5"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.8.6"] = function($, content) {
    return null;
}


/********************************************************************
/* 1.9 - Chaque image texte porteuse d&#39;information, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["1.9.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.9.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.9.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.9.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.9.5"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.9.6"] = function($, content) {
    return null;
}


/********************************************************************
/* 1.10 - Chaque légende d&#39;image est-elle, si nécessaire, correctement reliée à l&#39;image correspondante ?
********************************************************************/

/**
 *
 */
repository["1.10.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.10.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.10.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.10.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["1.10.5"] = function($, content) {
    return null;
}


/********************************************************************
 * 2 - Cadres
 ********************************************************************/


/********************************************************************
/* 2.1 - Chaque cadre en ligne a-t-il un titre de cadre ?
********************************************************************/

/**
 * Chaque cadre en ligne (balise iframe) a-t-il un attribut title ?
 */
repository["2.1.1"] = function($, content) {
    return rule('2.1.1', $).select("iframe:not([title])").noelement().addplaceholders(['src']).trigger().result;
}


/********************************************************************
/* 2.2 - Pour chaque cadre en ligne ayant un titre de cadre, ce titre de cadre est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["2.2.1"] = function($, content) {
    return null;
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
repository["3.1.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.1.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.1.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.1.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.1.5"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.1.6"] = function($, content) {
    return null;
}


/********************************************************************
/* 3.2 - Dans chaque page Web, l&#39;information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle implémentée de façon pertinente ?
********************************************************************/

/**
 *
 */
repository["3.2.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.2.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.2.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.2.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.2.5"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.2.6"] = function($, content) {
    return null;
}


/********************************************************************
/* 3.3 - Dans chaque page Web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["3.3.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.3.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.3.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.3.4"] = function($, content) {
    return null;
}


/********************************************************************
/* 3.4 - Dans chaque page Web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il amélioré (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["3.4.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.4.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.4.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["3.4.4"] = function($, content) {
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
repository["4.1.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.1.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.1.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.2 - Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audio-description synchronisée, celles-ci sont-elles pertinentes (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.2.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.2.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.2.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.3 - Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.3.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.3.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.4 - Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?
********************************************************************/

/**
 *
 */
repository["4.4.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.5 - Chaque média temporel en direct a-t-il, si nécessaire, des sous-titres synchronisés ou une transcription textuelle (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.5.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.5.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.6 - Pour chaque média temporel en direct ayant des sous-titres synchronisés ou une transcription textuelle, ceux-ci sont-ils pertinents ?
********************************************************************/

/**
 *
 */
repository["4.6.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.6.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.7 - Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audio-description synchronisée (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.7.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.7.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.8 - Pour chaque média temporel pré-enregistré ayant une audio-description synchronisée, celle-ci est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["4.8.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.8.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.9 - Chaque média temporel pré-enregistré a-t-il, si nécessaire, une interprétation en langue des signes (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.9.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.9.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.10 - Pour chaque média temporel pré-enregistré ayant une interprétation en langue des signes, celle-ci est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["4.10.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.10.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.11 - Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audio-description étendue synchronisée (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.11.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.11.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.12 - Pour chaque média temporel pré-enregistré ayant une audio-description étendue synchronisée, celle-ci est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["4.12.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.12.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.13 - Chaque média temporel synchronisé ou seulement vidéo a-t-il, si nécessaire, une transcription textuelle (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.13.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.13.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.14 - Pour chaque média temporel synchronisé ou seulement vidéo, ayant une transcription textuelle, celle-ci est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["4.14.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.14.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.15 - Chaque média temporel est-il clairement identifiable (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.15.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.15.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.16 - Chaque média non temporel a-t-il, si nécessaire, une alternative (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.16.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.16.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.17 - Pour chaque média non temporel ayant une alternative, cette alternative est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["4.17.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.18 - Chaque son déclenché automatiquement est-il contrôlable par l&#39;utilisateur ?
********************************************************************/

/**
 *
 */
repository["4.18.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.19 - Pour chaque média temporel seulement audio pré-enregistré, les dialogues sont-ils suffisamment audibles (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.19.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.20 - La consultation de chaque média temporel est-elle, si nécessaire, contrôlable par le clavier et la souris ?
********************************************************************/

/**
 *
 */
repository["4.20.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.20.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.20.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.21 - La consultation de chaque média non temporel est-elle contrôlable par le clavier et la souris ?
********************************************************************/

/**
 *
 */
repository["4.21.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.21.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 4.22 - Chaque média temporel et non temporel est-il compatible avec les technologies d&#39;assistance (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["4.22.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["4.22.2"] = function($, content) {
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
repository["5.1.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 5.2 - Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["5.2.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 5.3 - Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?
********************************************************************/

/**
 *
 */
repository["5.3.1"] = function($, content) {
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
repository["5.5.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 5.6 - Pour chaque tableau de données, chaque en-tête de colonnes et chaque en-tête de lignes sont-ils correctement déclarés ?
********************************************************************/

/**
 *
 */
repository["5.6.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["5.6.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 5.7 - Pour chaque tableau de données, la technique appropriée permettant d&#39;associer chaque cellule avec ses en-têtes est-elle utilisée ?
********************************************************************/

/**
 *
 */
repository["5.7.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["5.7.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["5.7.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["5.7.4"] = function($, content) {
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
repository["5.8.1"] = function($, content) {
    return rule('5.8.1', $).select("table." + markers['layout-table-class']).addnochildren(['caption', 'th', 'thead', 'tfoot'], '5.8.1.1').addnochildwithattributes('td', ['scope', 'headers', 'colgroup', 'axis'], '5.8.1.2').trigger().result;
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
repository["6.1.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.1.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.1.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.1.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.1.5"] = function($, content) {
    return null;
}


/********************************************************************
/* 6.2 - Pour chaque lien ayant un titre de lien, celui-ci est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["6.2.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.2.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.2.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.2.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.2.5"] = function($, content) {
    return null;
}


/********************************************************************
/* 6.3 - Chaque intitulé de lien seul est-il explicite hors contexte (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["6.3.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.3.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.3.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.3.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.3.5"] = function($, content) {
    return null;
}


/********************************************************************
/* 6.4 - Pour chaque page web, chaque lien identique a-t-il les mêmes fonction et destination ?
********************************************************************/

/**
 *
 */
repository["6.4.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.4.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.4.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.4.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["6.4.5"] = function($, content) {
    return null;
}


/********************************************************************
/* 6.5 - Dans chaque page Web, chaque lien, à l&#39;exception des ancres, a-t-il un intitulé ?
********************************************************************/

/**
 *
 */
repository[""] = function($, content) {
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
repository["7.1.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["7.1.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["7.1.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["7.1.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["7.1.5"] = function($, content) {
    return null;
}

/**
 *
 */
repository["7.1.6"] = function($, content) {
    return null;
}


/********************************************************************
/* 7.2 - Pour chaque script ayant une alternative, cette alternative est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["7.2.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["7.2.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 7.3 - Chaque script est-il contrôlable par le clavier et la souris (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["7.3.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["7.3.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["7.3.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["7.3.4"] = function($, content) {
    return null;
}


/********************************************************************
/* 7.4 - Pour chaque script qui initie un changement de contexte, l&#39;utilisateur est-il averti ou en a-t-il le contrôle ?
********************************************************************/

/**
 *
 */
repository["7.4.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 7.5 - Chaque script qui provoque une alerte non sollicitée est-il contrôlable par l&#39;utilisateur (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["7.5.1"] = function($, content) {
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
repository["8.1.1"] = function($, content) {
    var jsdom = require("node-jsdom").jsdom;
    var document = jsdom(content);
    var window = document.defaultView;

    return getResult(window.document.doctype !== null, '8.1.1');
}

/**
 *
 */
repository["8.1.2"] = function($, content) {
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
repository["8.1.3"] = function($, content) {
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
repository["8.2.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["8.2.2"] = function($, content) {
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
repository["8.3.1"] = function($, content) {
    return getResult($('html[xml\\:lang]').length + ($("html[lang]")).length > 0, '8.3.1');
}


/********************************************************************
/* 8.4 - Pour chaque page Web ayant une langue par défaut, le code de langue est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["8.4.1"] = function($, content) {
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
repository["8.5.1"] = function($, content) {
    return rule("8.5.1", $).select("head:not(:has(>title))").noelement().trigger().result;
}


/********************************************************************
/* 8.6 - Pour chaque page Web ayant un titre de page, ce titre est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["8.6.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 8.7 - Dans chaque page Web, chaque changement de langue est-il indiqué dans le code source (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["8.7.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 8.8 - Dans chaque page Web, chaque changement de langue est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["8.8.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["8.8.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 8.9 - Dans chaque page Web, les balises ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["8.9.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 8.10 - Dans chaque page Web, les changements du sens de lecture sont-ils signalés ?
********************************************************************/

/**
 *
 */
repository["8.10.1"] = function($, content) {
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
repository["9.1.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["9.1.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["9.1.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["9.1.4"] = function($, content) {
    return null;
}


/********************************************************************
/* 9.2 - Dans chaque page Web, la structure du document est-elle cohérente ?
********************************************************************/

/**
 *
 */
repository["9.2.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["9.2.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 9.3 - Dans chaque page Web, chaque liste est-elle correctement structurée ?
********************************************************************/

/**
 *
 */
repository["9.3.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["9.3.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["9.3.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 9.4 - Dans chaque page Web, la première occurrence de chaque abréviation permet-elle d&#39;en connaître la signification ?
********************************************************************/

/**
 *
 */
repository["9.4.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 9.5 - Dans chaque page Web, la signification de chaque abréviation est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["9.5.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 9.6 - Dans chaque page Web, chaque citation est-elle correctement indiquée ?
********************************************************************/

/**
 *
 */
repository["9.6.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["9.6.2"] = function($, content) {
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
repository["10.1.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.1.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.1.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.2 - Dans chaque page Web, le contenu visible reste-t-il présent lorsque les feuilles de styles sont désactivées ?
********************************************************************/

/**
 *
 */
repository["10.2.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.3 - Dans chaque page Web, l&#39;information reste-t-elle compréhensible lorsque les feuilles de styles sont désactivées ?
********************************************************************/

/**
 *
 */
repository["10.3.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.4 - Dans chaque page Web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu&#39;à 200%, au moins ?
********************************************************************/

/**
 *
 */
repository["10.4.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.4.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.4.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.5 - Dans chaque page Web, les déclarations CSS de couleurs de fond d&#39;élément et de police sont-elles correctement utilisées ?
********************************************************************/

/**
 *
 */
repository["10.5.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.5.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.5.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.6 - Dans chaque page Web, chaque lien dont la nature n&#39;est pas évidente est-il visible par rapport au texte environnant ?
********************************************************************/

/**
 *
 */
repository["10.6.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.7 - Dans chaque page Web, pour chaque élément recevant le focus, la prise de focus est-elle visible ?
********************************************************************/

/**
 *
 */
repository["10.7.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.7.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.7.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.8 - Dans chaque page Web, le choix de la couleur de fond et de police du texte est-il contrôlable par l&#39;utilisateur ?
********************************************************************/

/**
 *
 */
repository["10.8.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.8.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.8.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.8.4"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.9 - Pour chaque page Web, le texte ne doit pas être justifié. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["10.9.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.10 - Pour chaque page Web, en affichage plein écran et avec une taille de police à 200%, chaque bloc de texte reste-t-il lisible sans l&#39;utilisation de la barre de défilement horizontal ?
********************************************************************/

/**
 *
 */
repository["10.10.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.11 - Pour chaque page Web, les blocs de texte ont-ils une largeur inférieure ou égale à 80 caractères (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["10.11.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.12 - Pour chaque page Web, l&#39;espace entre les lignes et les paragraphes est-il suffisant ?
********************************************************************/

/**
 *
 */
repository["10.12.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.12.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.13 - Pour chaque page Web, les textes cachés sont-ils correctement affichés pour être restitués par les technologies d&#39;assistance ?
********************************************************************/

/**
 *
 */
repository["10.13.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.13.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.13.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.14 - Dans chaque page Web, l&#39;information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["10.14.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.14.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.14.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.14.4"] = function($, content) {
    return null;
}


/********************************************************************
/* 10.15 - Dans chaque page Web, l&#39;information ne doit pas être donnée par la forme, taille ou position uniquement. Cette règle est-elle implémentée de façon pertinente ?
********************************************************************/

/**
 *
 */
repository["10.15.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.15.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.15.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["10.15.4"] = function($, content) {
    return null;
}


/********************************************************************
 * 11 - Formulaires
 ********************************************************************/


/********************************************************************
/* 11.1 - Chaque champ de formulaire a-t-il une étiquette ?
********************************************************************/

/**
 *
 */
repository["11.1.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.1.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.1.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.2 - Chaque étiquette associée à un champ de formulaire est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["11.2.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.2.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.2.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.2.4"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.3 - Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?
********************************************************************/

/**
 *
 */
repository["11.3.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.3.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.4 - Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés ?
********************************************************************/

/**
 *
 */
repository["11.4.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.5 - Dans chaque formulaire, les informations de même nature sont-elles regroupées, si nécessaire ?
********************************************************************/

/**
 *
 */
repository["11.5.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.6 - Dans chaque formulaire, chaque regroupement de champs de formulaire a-t-il une légende ?
********************************************************************/

/**
 *
 */
repository["11.6.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.7 - Dans chaque formulaire, chaque légende associée à un groupement de champs de formulaire est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["11.7.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.8 - Dans chaque formulaire, chaque liste de choix est-elle structurée de manière pertinente ?
********************************************************************/

/**
 *
 */
repository["11.8.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.8.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.8.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.9 - Dans chaque formulaire, l&#39;intitulé de chaque bouton est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["11.9.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.9.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.10 - Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente ?
********************************************************************/

/**
 *
 */
repository["11.10.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.10.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.10.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.10.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.10.5"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.10.6"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.10.7"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.10.8"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.10.9"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.11 - Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?
********************************************************************/

/**
 *
 */
repository["11.11.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.11.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.12 - Pour chaque formulaire, les données à caractère financier, juridique ou personnel peuvent-elles être modifiées, mises à jour ou récupérées par l&#39;utilisateur ?
********************************************************************/

/**
 *
 */
repository["11.12.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.12.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.13 - Pour chaque formulaire, toutes les données peuvent-elles être modifiées, mises à jour ou récupérées par l&#39;utilisateur ?
********************************************************************/

/**
 *
 */
repository["11.13.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.13.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.14 - Pour chaque formulaire, des aides à la saisie sont-elles présentes ?
********************************************************************/

/**
 *
 */
repository["11.14.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.14.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.14.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.14.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.14.5"] = function($, content) {
    return null;
}

/**
 *
 */
repository["11.14.6"] = function($, content) {
    return null;
}


/********************************************************************
/* 11.15 - Pour chaque formulaire, chaque aide à la saisie est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["11.15.1"] = function($, content) {
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
repository["12.1.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.2 - Dans chaque ensemble de pages, le menu ou les barres de navigation sont-ils toujours à la même place (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["12.2.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository[""] = function($, content) {
    return null;
}


/********************************************************************
/* 12.3 - Dans chaque ensemble de pages, le menu et les barres de navigation ont-ils une présentation cohérente (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["12.3.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.3.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.4 - La page &quot;plan du site&quot; est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["12.4.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.4.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.4.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.5 - Dans chaque ensemble de pages, la page &quot;plan du site&quot; est-elle atteignable de manière identique ?
********************************************************************/

/**
 *
 */
repository["12.5.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.5.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.5.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.6 - Dans chaque ensemble de pages, le moteur de recherche est-il atteignable de manière identique ?
********************************************************************/

/**
 *
 */
repository["12.6.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.6.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.6.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.7 - Dans chaque page d&#39;une collection de pages, des liens facilitant la navigation sont-ils présents ?
********************************************************************/

/**
 *
 */
repository["12.7.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.8 - Dans chaque page web, un fil d&#39;Ariane est-il présent (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["12.8.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.9 - Dans chaque page Web, le fil d&#39;Ariane est-il pertinent ?
********************************************************************/

/**
 *
 */
repository["12.9.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.10 - Dans chaque page Web, les groupes de liens importants (menu, barre de navigation...) et la zone de contenu sont-ils identifiés hors cas particuliers ?
********************************************************************/

/**
 *
 */
repository["12.10.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.10.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.10.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.10.4"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.11 - Dans chaque page Web, des liens d&#39;évitement ou d&#39;accès rapide aux groupes de liens importants et à la zone de contenu sont-ils présents hors cas particuliers ?
********************************************************************/

/**
 *
 */
repository["12.11.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.11.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.11.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.11.4"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.12 - Dans chaque page Web, la page en cours de consultation est-elle indiquée dans le menu de navigation ?
********************************************************************/

/**
 *
 */
repository["12.12.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.13 - Dans chaque page Web, l&#39;ordre de tabulation est-il cohérent ?
********************************************************************/

/**
 *
 */
repository["12.13.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["12.13.2"] = function($, content) {
    return null;
}


/********************************************************************
/* 12.14 - Dans chaque page Web, la navigation ne doit pas contenir de piège au clavier. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["12.14.1"] = function($, content) {
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
repository["13.1.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.1.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.1.3"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.1.4"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.1.5"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.2 - Dans chaque page Web, pour chaque ouverture de nouvelle fenêtre, l&#39;utilisateur est-il averti ?
********************************************************************/

/**
 *
 */
repository["13.2.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.2.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.2.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.3 - Dans chaque page Web, l&#39;ouverture d&#39;une nouvelle fenêtre ne doit pas être déclenchée sans action de l&#39;utilisateur. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["13.3.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.4 - Dans chaque page Web, une tâche ne doit pas requérir de limite de temps pour être réalisée, sauf si elle se déroule en temps réel ou si cette limite de temps est essentielle. Cette règle est-elle respectée ?
********************************************************************/

/**
 *
 */
repository["13.4.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.5 - Dans chaque page Web, lors d&#39;une interruption de session authentifiée, les données saisies par l&#39;utilisateur sont-elles récupérées après ré-authentification ?
********************************************************************/

/**
 *
 */
repository["13.5.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.6 - Dans chaque page Web, pour chaque fichier en téléchargement, des informations relatives à sa consultation sont-elles présentes (hors cas particuliers) ?
********************************************************************/

/**
 *
 */
repository["13.6.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.6.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.6.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.7 - Dans chaque page Web, chaque document bureautique en téléchargement possède-t-il, si nécessaire, une version accessible ?
********************************************************************/

/**
 *
 */
repository["13.7.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.8 - Pour chaque document bureautique ayant une version accessible, cette version offre-t-elle la même information ?
********************************************************************/

/**
 *
 */
repository["13.8.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.9 - Dans chaque page Web, les expressions inhabituelles, les expressions idiomatiques ou le jargon sont-ils explicités ?
********************************************************************/

/**
 *
 */
repository["13.9.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.10 - Dans chaque page Web, pour chaque expression inhabituelle ou limitée, idiomatique ou de jargon ayant une définition, cette définition est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["13.10.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.11 - Dans chaque page Web, chaque contenu cryptique (art ascii, émoticon, syntaxe cryptique) a-t-il une alternative ?
********************************************************************/

/**
 *
 */
repository["13.11.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.12 - Dans chaque page Web, pour chaque contenu cryptique (art ascii, émoticon, syntaxe cryptique) ayant une alternative, cette alternative est-elle pertinente ?
********************************************************************/

/**
 *
 */
repository["13.12.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.13 - Dans chaque page Web, pour chaque mot dont le sens ne peut être compris sans en connaître la prononciation, celle-ci est-elle indiquée ?
********************************************************************/

/**
 *
 */
repository["13.13.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.14 - Dans chaque page Web, chaque texte qui nécessite un niveau de lecture plus avancé que le premier cycle de l&#39;enseignement secondaire a-t-il une version alternative ?
********************************************************************/

/**
 *
 */
repository["13.14.1"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.15 - Dans chaque page Web, les changements brusques de luminosité ou les effets de flash sont-ils correctement utilisés ?
********************************************************************/

/**
 *
 */
repository["13.15.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.15.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.15.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.16 - Dans chaque page Web, les changements brusques de luminosité ou les effets de flash ont-ils une fréquence inférieure ou égale à 3 par seconde ?
********************************************************************/

/**
 *
 */
repository["13.16.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.16.2"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.16.3"] = function($, content) {
    return null;
}


/********************************************************************
/* 13.17 - Dans chaque page Web, chaque contenu en mouvement ou clignotant est-il contrôlable par l&#39;utilisateur ?
********************************************************************/

/**
 *
 */
repository["13.17.1"] = function($, content) {
    return null;
}

/**
 *
 */
repository["13.17.2"] = function($, content) {
    return null;
}

module.exports = repository;
