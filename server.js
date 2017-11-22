var express = require('express');
var server = express();
var handlebars = require('express-handlebars');
bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.engine('handlebars', handlebars({ defaultLayout: 'main' }));
server.set('view engine', 'handlebars');

server.get('/', function(req, res, next) {
    res.status(200).render('index.handlebars');
});

server.get('/four', function(req, res, next) {
    res.status(200).render('four.handlebars');
})

server.use(express.static('public'));

server.get('*', function(req, res, next) {
    res.status(404).send('404');
});

server.post("/four", function(req,res) {
	var settings = {player: req.body.player, room: req.body.room, color: req.body.color};
	console.log(settings);
	res.status(200).render('four.handlebars', settings);
});

server.listen(3000, function() {
    console.log('server listening on port 3000');
});

//todo send css and js files.

