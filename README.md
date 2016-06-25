# rgaav3aas

Ce projet a été établi pour aider toute personne soucieuse de vérifier la conformité d'un contenu web au référentiel général d'accessibilité pour les administrations RGAA V3.

Ce projet fournit une api exposée sous forme de services RESTful.

Dans l'état actuel, voici la liste des tests automatisés :

* 1.1.1
* 1.1.2
* 1.1.3
* 1.1.4
* 1.2.1
* 2.1.1
* 5.8.1
* 8.1.1
* 8.1.2
* 8.1.3
* 8.3.1
* 8.4.1
* 8.5.1

## Installer le projet
```
$ git clone https://github.com/ahmedalami/rgaav3aas
$ cd rgaav3aas
$ npm install
```

## Démarrer le serveur
```
$ PORT=8888 node index
```

## Lancer une vérification
*Lancer la vérification de la conformité basé sur tous les tests automatisables RGAA. Le résulat est renvoyé sous format JSON.*
```
$ curl -X POST -H "Content-Type: text/html" -F "data=@test.html" http://localhost:4000/rgaav3/json/all
```

*Lancer la vérification de la conformité basé sur tous les test 1.1.1. Le résulat est renvoyé sous format JSON.*
```
$ curl -X POST -H "Content-Type: text/html" -F "data=@test.html" http://localhost:4000/rgaav3/json/1.1.1
```
