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
