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



(function(){
	var element = function(id){
		return document.getElementById(id);
	}

	var status = element('status');
	var chats = element('Mainchatbox');
	var names = element('Mainnamemsg');
	var messages = element('Mainusermsg');
	//dont need that clear button
	//setting status
	var statusDefault; //= status.textContent;
	var setStatus = function(s){
		//set status
		status.textcontent = s;
		if(s != statusDefault){
			var delay = setTimeout(function(){
				setstatus(statusDefault);
			}, 4000); // waits 4 seconds before going back to default
		}
	}
		//connecting to socket.io
	var socket = io.connect('mongodb://localhost:27017/mydb:4000');
	if(socket !== undefined){
		//connection is good
		console.log('Socket connected to server');

		//output
		socket.on('output',function(data){
			console.log(data);
			if(data.length){
				for(var x;x<data.length;x++){
					//building chat on screen
					var message = document.createElement('div');
					message.setAttribute('class','chat-message');
					message.textContent = data[x].name+": "+data[x].message;
					chats.appendChild(message);
					chats.insertBefore(message,chats.firstChild);
				}
			}
		});

		//status
		socket.on('status',function(data){
			setStatus((typeof data === 'object')?data.message:data);
			//if clear, clear data
			if(data.clear){
				messages.value = '';
			}
		});

		//input
		messages.addEventListener('keydown',function(event){
			if(event.which == 13 ){//&& event.shiftKey == false){
				//emit text
				socket.emit('input',{name:names.value,message:messages.value});
				event.preventDefault();
			}
		});
	}
})();