var player = document.getElementById("player-one");
var numPlayer = 1;
var turn = 0;
var playerData = {name: player.dataset.name, room: player.dataset.room, color: player.dataset.color};
var socket = io.connect('http://localhost:3000');
socket.emit('player', playerData);



// event listeners
document.getElementById("forfeit-button").addEventListener("click", sendForfeit);
document.getElementById("submitmsg").addEventListener("click", sendMessage);
document.getElementById("draw-button").addEventListener("click", votetoDraw);
document.getElementById("usermsg").addEventListener("keypress", pressEnter);
var num
var buttonarray = document.querySelectorAll("chip-button");
for (var i = 0; i < buttonarray.length; i++) {
	num = i;
	buttonarray[i].addEventListener("click", putToken(num));
}

socket.on('newPlayer', function(newPlayerData) {
	numPlayer = 2;
	console.log(newPlayerData);
	document.getElementById("player-two").dataset[0] = newPlayerData.name;
	document.getElementById("player-two").dataset[1] = newPlayerData.room;
	document.getElementById("player-two").dataset[2] = newPlayerData.color;
	document.getElementById("player-two").children[0].innerText = newPlayerData.name;
	updateStatus(1);
});

socket.on('chatMessage', function(content) {
	var liElement = document.createElement("li");
	var textNode = document.createTextNode(content.author + " says : " + content.text);
	liElement.appendChild(textNode);
	console.log(liElement);
	document.getElementById("chatbox").appendChild(liElement);
})

socket.on('fullColumn', function(content) {
	disableColumn(content);
})


socket.on('playerForfeit', function(content) {
	window.alert(content + ' has forfeit the game. Game over.');
	socket.disconnect();
	updateStatus(0);
})

function sendForfeit() {
	socket.emit("forfeit", playerData);
	window.location = "http://localhost:3000";
}

socket.on('disconnectedPlayer', function() {
	updateStatus(0);
	numPlayer = 1;
})


socket.on('newToken', function(content) {
	//Add a function to drop a token here
	turn = content.turn;
	switchTurn();
	console.log(content);
	document.getElementById("board").children[content.x].children[5-content.y].style.backgroundColor = content.color;
})

socket.on('startGame', function() {
	turn = 1;
	switchTurn();
})

function pressEnter(event) {
    if (event.which == 13 || event.keyCode == 13) {
    	sendMessage();
    	return true;
    }
    return false;
};

function updateStatus(state) {
	if (state) {
		document.getElementById("player-two").children[1].innerText = "Connected";
		document.getElementById("player-two").children[1].style.color = "green";
	} else {
		document.getElementById("player-two").children[0].innerText = "[...]";
		document.getElementById("player-two").children[1].innerText = "Not connected";
		document.getElementById("player-two").children[1].style.color = "red";
	}
}

function votetoDraw() {
	socket.emit('drawrequest');
}

socket.on('draw', function() {
	//window.confirm("Other player votes for a Draw!");
	if(confirm("Other player votes for a Draw!")){
		socket.emit('drawfullfillreq');
		window.location = "http://localhost:3000";
	}
});

socket.on('drawfullfill', function(){
	window.location = "http://localhost:3000";
});

function sendMessage() {
	var message = document.getElementById("usermsg").value;
	if (message) {
		socket.emit('emittedMessage', {author : playerData.name, text: message});
		document.getElementById("usermsg").value = '';
	} else {
		window.alert("Input is empty !");
	}
}

function switchTurn(){
	var turnMarker = document.getElementById("turn-marker");
	if(turn == numPlayer) {
		turnMarker.style.backgroundColor="green";
		turnMarker.innerText="Your turn !";
		for(let i = 0; i <= 6; i++) {
			enableColumn(i);
		}
	} else {
		for(let i = 0; i <= 6; i++) {
			disableColumn(i); 
		}
		turnMarker.style.backgroundColor="red";
		turnMarker.innerText="Not your turn !";
	}
}

function putToken(token) {
	// console.log(event.target.id);
	console.log("lol");
	socket.emit('putToken', {column : token, player : playerData.name, room: playerData.room});
}

function disableColumn(num) {
	var column = document.getElementById(String(num));
	column.style.backgroundColor="grey";
	column.disabled = true;
	column.removeEventListener("click", putToken);
}

function enableColumn(num) {
	var column = document.getElementById(String(num));
	column.style.backgroundColor="lightgreen";
	column.disabled = false;
	column.addEventListener("click", putToken);
}