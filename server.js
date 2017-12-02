var express = require('express');
var app = express();
var server = require('http').Server(app);
var handlebars = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;
var socketio = require('socket.io').listen(4000).sockets;
var urlDb = "mongodb://localhost:27017/mydb";
//var io = require('socket.io').listen(server);


var io = require('socket.io').listen(app.listen(3000, function() {
    console.log('server listening on port 3000');
})); 
var port = 3050;

//var io = require('socket.io').listen(server);
//var users = [];
//var connections = [];


MongoClient.connect(urlDb, function(err, db) {
  if (err) throw err;
  db.collection("rooms").deleteMany({}, function(err, obj) {
    console.log(obj.result.n + " document(s) deleted");
	for (let i=1; i <= 500; i++ ) {
		db.collection("rooms").insertOne({numRoom : i, players_Number: 0, players: [], colors: []}, function(err, obj) {
			//console.log(obj.result.n + "document(s) added");
			
		//console.log(i +" element updated");
		});
	}
	for (let i=1; i <= 10; i++ ) {
		db.collection("highscores").insertOne({name: "John Doe", score : i*500}, function(err2, obj2) {
			console.log(obj2.result.n + "document(s) added");
		});
	}
		//console.log(i +" element updated");
	
	db.close();
	});

io.on('connection', function (socket) {
	var player;
	socket.on('player', function(session){
		player = session;
		socket.join(player.room);
		console.log(player.name + " has just entered the room " + player.room);
		addPlayer(player, function() {
			MongoClient.connect(urlDb, function(err, db) {
				db.collection("rooms").find({numRoom: parseInt(player.room)}).toArray(function(err, result) {
					console.log(result[0]);
					if (result[0].players_Number == 2) {
						console.log("emitted");
						socket.to(player.room).emit("newPlayer", player);
					}
					db.close();
				});	
			});
		});	
	});
	socket.on('disconnect', function() {
		console.log(player.name + " has just left the room " + player.room);
		removePlayer(player);
	});
	socket.on('emittedMessage', function(content) {
		console.log(content)
		socket.in(player.room).emit('chatMessage', content);	
	})
});

function addPlayer(player, next) {
	MongoClient.connect(urlDb, function(err, db) {
		if (err) throw err;
		var query = {numRoom: parseInt(player.room)};
		db.collection("rooms").find(query).toArray(function(err, result) {
			result[0].players.push(player.name);
			result[0].colors.push(player.color);
			result[0].players_Number++;
			db.collection("rooms").update(query, {$set: {players: result[0].players, players_Number: result[0].players_Number, colors: result[0].colors}}, function() {
				db.collection("rooms").find(query).toArray(function(err2, result2) {
					console.log(result[0]);
					db.close();
					next();
				});	
			});
		});
	});
}

function removePlayer(player) {
	MongoClient.connect(urlDb, function(err, db) {
		if (err) throw err;
		var query = {numRoom: parseInt(player.room)};
		db.collection("rooms").find(query).toArray(function(err, result) {
			console.log("Removing : " + JSON.stringify(result));
			if(result[0].players_Number == 1) {
				result[0].players = [];
				result[0].colors = [];
			} else {
				result[0].players.splice(result.indexOf(player.name),1);
				result[0].colors.splice(result.indexOf(player.name),1);
			}
			result[0].players_Number--;
			db.collection("rooms").update(query, {$set: {players: result[0].players, players_Number: result[0].players_Number, colors: result[0].colors}}, function() {
				db.collection("rooms").find(query).toArray(function(err2, result2) {
					console.log(result[0]);
					db.close();
				});
			});
		});
	});
}

/*MongoClient.connect(urlDb, function(err, db) {

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

/*

MongoClient.connect(urlDb, function(err, db) {
	if (err) throw err;
	console.log("Database created !");
	var settings = {numRoom: 235, player_Number: 1, players: ['Pierre'], color: '#ffffff'};
	db.collection("rooms").insertOne(settings,
		function(err, res) {
			if (err) throw err;
			console.log("1 document inserted");
			db.close();
	});
});
*/


bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

server.get('/', function(req, res, next) {
    res.status(200).render('index');
});

server.get('/four', function(req, res, next) {
    res.status(200).render('four');
})

app.get('/', function(req, res, next) {
	var highscores = [];
	MongoClient.connect(urlDb, function(err, db) {
		db.collection("highscores").find().toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			highscores = result.slice(0,5);
			db.close();
			context = {scores : highscores};
    		res.status(200).render('index.handlebars', context);
		});	
	})
});

app.get('/four', function(req, res, next) {
    res.status(200).render('four.handlebars');
})

app.use(express.static('public'));

/*app.get('*', function(req, res, next) {
    res.status(404).send('404');
});*/

app.post("/four", function(req,res) {
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
		    if (result[0].players_Number == 0) {
		    	res.status(200).render('four.handlebars', settings);
			} else if (result[0].players_Number == 1) {
				settings.otherPlayer = {name: result[0].players[0], color: result[0].colors[0]};
		    	res.status(200).render('four.handlebars', settings);
			} else {
		    	var	error = {error: true, text: 'The room #' + req.body.room + ' is full !'};
		    	res.status(200).render('index', error);
		    }
		    /*db.collection("rooms").find({numRoom: parseInt(req.body.room)}).toArray(function(err2, result2){
				console.log(result2);
		    	db.close();
			});*/
			db.close();
		});
	
	});

});
			});
	});

});

});

server.listen(port, function() {
    console.log('server listening on port ', port);

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
