var express = require('express');
var server = express();

server.get('/', function(req, res, next) {
    res.status(200).send('test test 123');
});

server.get('*', function(req, res, next) {
    res.status(404).send('404');
});

server.listen(3000,function() {
    console.log('listening on port 3000');
});
