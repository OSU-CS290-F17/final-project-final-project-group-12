function checkInput() {
	var text = "";
	if (!document.getElementById("playerId")) {
		text = "Missing player name";
	}
	if (!document.getElementById("roomId")) {
		text += "\nMissing room number";
	}
	if (!text)
		document.getElementById("settings").submit();
	else
		window.alert(text);
}