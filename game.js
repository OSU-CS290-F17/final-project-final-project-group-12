/**
Game

Properties
    GameID
    Gameboard
    Player1
    Player2
    Turn
    lastMove
Functions
    turnHandler
        Adds the incoming move to the board
        Update the gameboard in db
        Sets lastMove to the move that just came in
        Change the turn from player-x to player-y
        Run sendLastMove
    gameWon
        Check to see if either player has 4 in a row straight or diagonally
        If all slots are filled return ‘draw’ emit
        Return false if the game is still going or return the victor’s name
    sendLastMove
        Emit lastmove to the clients for rendering

 */


function playAgame(){
	var turn = 0;
	var board = 
		[
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0]
		]
	while(turn < 42){
		board = addMove(board, turn%2 + 1); //addMove will add a move to the board, where we will give addMove the input board, player (the player whose turn it is);
		
		var winner = checkForWin(board);
		if(winner)
			return winner;


	}
	return 0; // 42 moves have been made and there is no winner, therefore this game is a draw. Return zero.
}

function addMove(board, player){
	


	return board;
}
