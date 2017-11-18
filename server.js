var express = require('express');
var server = express();

server.get('/', function(req, res, next) {
    res.status(200).send('test test 123');
});

server.get('/four', function(req, res, next) {
    res.status(200).send('four.html');
})
server.get('*', function(req, res, next) {
    res.status(404).send('404');
});

server.listen(3000, function() {
    console.log('server listening on port 3000');
});

console.log('test');
