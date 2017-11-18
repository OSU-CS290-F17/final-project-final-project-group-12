var express = require('express');
var server = express();
var handlebars = require('express-handlebars');

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

server.listen(3000, function() {
    console.log('server listening on port 3000');
});

//todo send css and js files.

