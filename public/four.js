
var chipArray = document.querySelectorAll('.chip-button');

for(var i = 0; i < chipArray.length; i++){
	chipArray[i].addEventListener('onclick' dropAChip(i));
}



function dropAChip(columnNumber){
	var columnArray = document.querySelectorAll('.board-column');
	chipFall(columnArray[column]);


}

function chipFall(columnObject){
	var singleColumn = columnObject.querySelectorAll('.chip-slot');
	var objectToChange = singleColumn[singleColumn.length - 1];
	var objectToChange.classList.add('chip-one');
	var objectToChange.classList.remove('chip-slot');
}
