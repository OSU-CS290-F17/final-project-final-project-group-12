var player = document.getElementById("player-one");
var playerData = {name: player.dataset.name, room: player.dataset.room, color: player.dataset.color};
var socket = io.connect('http://localhost:3000');
socket.emit('player', playerData);
document.getElementById("submitmsg").addEventListener("click", sendMessage);
document.getElementById("usermsg").addEventListener("keypress", pressEnter);
for (button of document.getElementsByClassName("chip-button")) {
	button.addEventListener("click", putToken);
}

var chipArray = document.querySelectorAll('.chip-button');

for(var i = 0; i < chipArray.length; i++){
	chipArray[i].addEventListener('click', function(event){
		console.log("== Column pressed: ", i);
		var columnArray = document.querySelectorAll('.board-column');
		chipFall(columnArray[i]);
	});
}

socket.on('newPlayer', function(newPlayerData) {
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
	var column = document.getElementById(content);
	column.style.background.Color="grey";
	column.removeEventListener("click", putToken);
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
		document.getElementById("player-two").children[1].innerText = "Not connected";
		document.getElementById("player-two").children[1].style.color = "red";
	}
}

function sendMessage() {
	var message = document.getElementById("usermsg").value;
	if (message) {
		var liElement = document.createElement("li");
		var textNode = document.createTextNode(playerData.name + " says : " + message);
		liElement.appendChild(textNode);
		console.log(liElement);	
		document.getElementById("chatbox").appendChild(liElement);
		
		socket.emit('emittedMessage', {author : playerData.name, text: message});
		document.getElementById("usermsg").value = '';
	} else {
		window.alert("Input is empty !");
	}
}

function putToken(button) {
	var content = playerData;
	var token = parseInt(button.id);
	socket.emit('putToken', {token : token, player : player.name});
}

function dropAChip(event, columnNumber){
	console.log("== Column pressed: ", columnNumber);
	var columnArray = document.querySelectorAll('.board-column');
	chipFall(columnArray[columnNumber]);


}

function chipFall(columnObject){
	var singleColumn = columnObject.querySelectorAll('.chip-slot');
	var objectToChange = singleColumn[singleColumn.length - 1];
	objectToChange.classList.add('chip-{{1 or 2 here}}');
	objectToChange.classList.remove('chip-slot');
}
