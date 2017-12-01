var express = require('express');
var server = express();
var handlebars = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;
var socketio = require('socket.io').listen(4000).sockets;
var urlDb = "mongodb://localhost:27017/mydb";

//var io = require('socket.io').listen(server);
//var users = [];
//var connections = [];


MongoClient.connect(urlDb, function(err, db) {
  if (err) throw err;
  db.collection("rooms").deleteMany({}, function(err, obj) {
    console.log(obj.result.n + " document(s) deleted");
		for (let i=1; i <= 500; i++ ) {
			db.collection("rooms").insertOne({numRoom : i, players_Number: 0, players: [], color: []}, function(err, obj) {
				console.log(obj.result.n + "document(s) added");
			});
			console.log(i +" element updated");
		}
		db.close();
	});


  //chat thingy hopefully
  socketio.on('connection', function(socket){
    let chat = db.collection('chats');
    //sending chat status
    sendStatus = function(s){
      socket.emit(s);
    }

    //gets chats from collection also limit number of chats
    chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
      if(err) throw err;
      //emit result
      socket.emit('output',res);
    });
    socket.on('input',function(data){
      let name = data.name;
      let message = data.message;
      //checking checkInput
      if(name == '' || message == ''){
        //send Error
        sendStatus('Please enter name or message!!')
      }
      else{
        //insert
        chat.insert({name: name, message: message}, function(){
          socketio.emit('output', [data]);
          sendStatus({message: 'Message sent', clear: true});
        });
      }
    });
    //handling clear
    socket.on('clear', function(data){
      //remove all chats from collection
      chat.remove({},function(){
        socket.emit('cleared');
      });
    });
  });

});

/*MongoClient.connect(urlDb, function(err, db) {
	if (err) throw err;
	console.log("Database created !");
	var settings = {numRoom: 235, player_Number: 1, players: ['Pierre'], color: '#ffffff'};
	db.collection("rooms").insertOne(settings,
		function(err, res) {
			if (err) throw err;
			console.log("1 document inserted");
			db.close();
	});
});*/

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
	MongoClient.connect(urlDb, function(err, db) {
		if (err) throw err;
		db.collection("rooms").find().toArray(function (err, result) {
			if (err) throw err;
			console.log(result);
			db.close();
		});
	});
    res.status(404).send('404');
});

server.post("/four", function(req,res) {
	var settings;

	MongoClient.connect(urlDb, function(err, db) {
		if (err) throw err
		var query = {numRoom: parseInt(req.body.room)};
		console.log(query);
		db.collection("rooms").find(query).toArray(function(err, result) {
			if (err) throw err;
			console.log(result[0]);
			settings = {room: parseInt(req.body.room), player: req.body.player, color: req.body.color};
			console.log(settings);
		    if (result[0].players_Number <= 2) {
		    	result[0].players.push(req.body.player);
		    	result[0].color.push(req.body.color);
		    	db.collection("rooms").update({numRoom: parseInt(req.body.room)}, {$set: {players: result[0].players, players_Number: result[0].players_Number+1, color: result[0].color}}     );
		    	res.status(200).render('four.handlebars', settings);
			} else {
		    	var	error = {error: true, text: 'The room #' + req.body.room + ' is full !'};
		    	res.status(200).render('index', error);
		    }
		    db.collection("rooms").find({numRoom: parseInt(req.body.room)}).toArray(function(err2, result2){
				console.log(result2);
		    	db.close();
			});
	});

});

});


/*io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	//Disconnect
	socket.on('disconnect', function(data){
		if(!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});

	//Send Message
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	// New User
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}

});*/


server.listen(3000, function() {
    console.log('server listening on port 3000');
});
