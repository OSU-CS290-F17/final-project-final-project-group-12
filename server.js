var express = require('express');
var app = express();
var server = require('http').Server(app);
var handlebars = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;
//var socketio = require('socket.io').sockets;
var urlDb = "mongodb://localhost:27017/mydb";
//var gameEngine = require("./game.js");
//var io = require('socket.io').listen(server);


var io = require('socket.io').listen(app.listen(3111, function() {
    console.log('server listening on port 3111');
}));

MongoClient.connect(urlDb, function(err, db) {
  if (err) throw err;
  db.collection("rooms").deleteMany({}, function(err, obj) {
    console.log(obj.result.n + " document(s) deleted");
	for (let i=1; i <= 500; i++ ) {
		db.collection("rooms").insertOne({numRoom : i, players_Number: 0, players: [], colors: [], board: [[], [],[],[],[],[],[]], turn: 1}, function(err, obj) {
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
 });

io.on('connection', function (socket) {
	var player;
	socket.on('player', function(session){
		player = session;
		socket.join(player.room);
		console.log(player.name + " has just entered the room " + player.room);
		addPlayer(player, function() {
			if (player.room != 1)
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
		if (player) {
			console.log(player.name + " has just left the room " + player.room);
			socket.to(player.room).emit("disconnectedPlayer");
			var content = {author: "Server", text: "The other player just disconnected !"};
			socket.in(player.room).emit('chatMessage', content);
			removePlayer(player);
		}
	});
	socket.on('emittedMessage', function(content) {
		console.log(content)
		io.in(player.room).emit('chatMessage', content);
	})
	socket.on('putToken', function(content) {
		console.log(content);
		addToken(content);
	})

	socket.on('forfeit', function(content) {
		console.log(content.name, "has forfeit the game in room:", content.room);
		socket.to(content.room).broadcast.emit('playerForfeit', content.name);
	})
  socket.on('drawrequest', function(){
    console.log("player wants a call a draw");
    socket.in(player.room).emit('chatMessage', {author:player.name, text:"votes for a Draw!"});
    socket.broadcast.to(player.room).emit('draw');
  })
  socket.on('drawfullfillreq', function(){
    socket.broadcast.to(player.room).emit('drawfullfill');
  })
	function addToken(settings) {
		var query = {numRoom: parseInt(settings.room)};
		MongoClient.connect(urlDb, function(err,db) {
			db.collection("rooms").find(query).toArray(function(err, result) {
				if (result[0].board[settings.column].length < 6) {
					console.log(result);
					result[0].board[settings.column][result[0].board[settings.column].length] = result[0].players.indexOf(settings.player)+1;
					db.collection("rooms").update(query, {$set: {board: result[0].board}});
					io.in(player.room).emit('newToken', {x : settings.column, color: result[0].colors[result[0].players.indexOf(settings.player)], y: result[0].board[settings.column].length-1});
					db.close();
				}
			});
		});
	}
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
};

function removePlayer(player) {
	MongoClient.connect(urlDb, function(err, db) {
		if (err) throw err;
		var query = {numRoom: parseInt(player.room)};
		db.collection("rooms").find(query).toArray(function(err, result) {
			console.log("Removing : " + JSON.stringify(result));
			if(result[0].players_Number == 1) {
				result[0].players = [];
				result[0].colors = [];
				result[0].board = [[],[],[],[],[],[],[]];
			} else {
				result[0].players.splice(result[0].players.indexOf(player.name),1);
				result[0].colors.splice(result[0].players.indexOf(player.name),1);
			}
			result[0].players_Number--;
			db.collection("rooms").update(query, {$set: {players: result[0].players, players_Number: result[0].players_Number, colors: result[0].colors, board: result[0].board}}, function() {
				db.collection("rooms").find(query).toArray(function(err2, result2) {
					console.log(result[0]);
					db.close();
				});
			});
		});
	});
}

bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

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


app.get('*', function(req, res, next) {
    res.status(404).render('404');
});

app.use(express.static('public'));

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
				console.log("here");
				settings.otherPlayer = {name: result[0].players[0], color: result[0].colors[0]};
		    	res.status(200).render('four.handlebars', settings);
			} else {
		    	var	error = {error: true, text: 'The room #' + req.body.room + ' is full !'};
		    	res.status(200).render('index', error);
		    }
			db.close();
		});

	});
});
