
var chipArray = document.querySelectorAll('.chip-button');

for(var i = 0; i < chipArray.length; i++){
	chipArray[i].addEventListener('onclick' dropAChip(i));
}



function dropAChip(columnNumber){
	var columnArray = document.querySelectorAll('.board-column');
	chipFall(columnArray[column]);


}

function chipFall(column){



}
