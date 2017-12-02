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
