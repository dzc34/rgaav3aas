var express = require('express');
var bodyParser = require("body-parser");
var config = require('config');
var engines = require('engines');

var evaluate = require("./lib/service");

var app = express();

var partials = {
    layout: 'layout'
};

app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.engine('html', engines.hogan);

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.text({
    type: 'text/html'
}));

app.post('/rgaav3/:format/:test', function(request, response) {
    var content = request.body;
    var format = request.params.format;
    var test = request.params.test;

    if(test === "all") {
      test = null;
    }

    evaluate(test, content, function(result) {
        response.setHeader("Content-type", "application/json");
        response.end(JSON.stringify(result));
    });
});

app.listen(app.get('port'), function() {
    console.log("Le service RGAA V3 est démarré est prêt à l'utilisation sur le port : " + app.get('port'));
});
