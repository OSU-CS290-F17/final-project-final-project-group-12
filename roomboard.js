
/*
boardstate shoudld be an array where:

[[] [] [] [] [] [] []]


Each of the mini-elemets should contain a value: 0 if unoccupied
						 1 if owned by player 1 
  0 1 2 3 4 5 6					 2 if owned by player 2
  v v v v v v v
[ * * * * * * * ]
  * * * * * * *
  * * * * * * *
  * * * * * * *
  * * * * * * *
  * * * * * * *
 

playerNumber is the number of the player (1 or 2) who is making the move.


colummNumber is the column of the play, as identified above.


*/

function registerAMove(playerNumber, columnNumber, boardstate){
	for(var i = 5; i >= 0; i--){
		if(boardstate[columnNumber][i] == 0)
			boardstate[columnNumber][i] = playerNumber;
	}
	return boardstate;
}
