<<<<<<< HEAD
var player = document.getElementById("player-one");
var playerData = {name: player.dataset.name, room: player.dataset.room, color: player.dataset.color};
var socket = io.connect('http://localhost:3000');
socket.emit('player', playerData);
document.getElementById("submitmsg").addEventListener("click", sendMessage);

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


=======

var chipArray = document.querySelectorAll('.chip-button');

for(var i = 0; i < chipArray.length; i++){
	chipArray[i].addEventListener('click', function(event){
		console.log("== Column pressed: ", i);
		var columnArray = document.querySelectorAll('.board-column');
		chipFall(columnArray[i]);
	});
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
>>>>>>> master
