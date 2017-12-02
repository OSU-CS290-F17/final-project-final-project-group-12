function checkInput() {
	var text = "";
	if (!document.getElementById("playerId").value) {
		text = "Missing player name";
	}
	if (!document.getElementById("roomId").value) {
		text += "\nMissing room number";
	}
	if (!text)
		document.getElementById("form").submit();
	else
	 	window.alert(text);
}


var player = document.getElementById("player-one");
var playerData = {name: 'Guest', room: '1', color: "blue"};
var socket = io.connect('http://localhost:3000');


document.getElementById("Mainsubmitmsg").onclick = function(){
	playerData.name = document.getElementById("Mainnamemsg").value;
}

//function running(){
//if(playerData.name != NULL){
	socket.emit('player', playerData);

document.getElementById("Mainusermsg").addEventListener("keypress", pressEnter);

socket.on('chatMessage', function(content) {
	var liElement = document.createElement("li");
	liElement.setAttribute("id","ChatColor")
	var textNode = document.createTextNode(content.author + " says : " + content.text);
	liElement.appendChild(textNode);
	console.log(liElement);
	document.getElementById("Mainchatbox").appendChild(liElement);
})

function pressEnter(event) {
    if (event.which == 13 || event.keyCode == 13) {
			if(playerData != ''){
    		sendMessage();
    		return true;
			}
			else{
				window.alert("Enter a name");
			}
    }
    return false;
};
//}
//}();

function sendMessage() {
	var message = document.getElementById("Mainusermsg").value;
	if (message) {
		var liElement = document.createElement("li");
		var textNode = document.createTextNode(playerData.name + " says : " + message);
		liElement.appendChild(textNode);
		console.log(liElement);
		document.getElementById("Mainchatbox").appendChild(liElement);

		socket.emit('emittedMessage', {author : playerData.name, text: message});
		document.getElementById("Mainusermsg").value = '';
	} else {
		window.alert("Input is empty !");
	}
}
