var express = require('express');
var server = express();

server.get('/', function(req, res, next) {
    res.status(200).send('test');
});

server.listen(3000, function() {
    console.log('server listening on port 3000');
})