pragma solidity ^0.8.0;
// Define the struct for each player's game state
struct GameState {
    uint8[][] board;
    bool isTurn;
    address playerAddress;
}

// Define the contract
contract Battleship {
    GameState public player1;
    GameState public player2;

    function setGameBoard(uint8[][] memory board) public {
    //Check if the board is valid, i.e., if it has dimensions of 5x5
        require(board.length == 5 && board[0].length == 5, "Board dimensions not valid");

    //Check which player's turn it is and set their game state accordingly with the provided board
        if (player1.isTurn) {
            require(player1.board.length == 0, "Player1's game board already set");
            player1.board = board;
            player2.isTurn = true;
        } else {
            require(player2.board.length == 0, "Player2's game board already set");
            player2.board = board;
            player1.isTurn = true;
        }
    
    //Set the address of the caller as the current player's address
    if(msg.sender==address(0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB)){
      //set to an example Ethereum address for testing purposes only.
      //replace this with your own ethereum public key in string format like: '0x123456789012345678901234567890'
        
      	if (player1.playerAddress == address(0)) {
	         	player1.playerAddress= msg.sender;         
      		}
  	     	else{
          		player2.playerAddress=msg.sender;           
        	}      
    } 
    
}

    // Function for a player to make a move
    function makeMove(uint8 x, uint8 y) public {
        // Check that it is the player's turn
        require((msg.sender == address(player1.playerAddress) && player1.isTurn) || (msg.sender == address(player2.playerAddress) && player2.isTurn), "Not your turn");

        // Determine which player is making the move
        GameState storage gameState;
        if (msg.sender == address(player1.playerAddress)) {
            gameState = player2;
        } else {
            gameState = player1;
        }

        // Check that the move is within the bounds of the board
        require(x < 5 && y < 5, "Move out of bounds");

        // Check that the move has not already been made
        require(gameState.board[x][y] < 2, "Move already made");

        // Check if the move was a hit or a miss and update the board
        if (gameState.board[x][y] == 1) {
            gameState.board[x][y] = 3; // Hit (3)
        } else {
            gameState.board[x][y] = 2; // Miss (2)
        }

        
        // Switch the turn to the other player
        player1.isTurn = !player1.isTurn;
        player2.isTurn = !player2.isTurn;
    }
}
