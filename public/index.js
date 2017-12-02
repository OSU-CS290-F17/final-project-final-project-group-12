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

document.getElementById("color").value = randomColor();