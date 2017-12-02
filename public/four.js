
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
