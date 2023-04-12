// SPDX-License-Identifier: MIT
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

        // Check which player's turn it is and set their game state accordingly with the provided board
        if (player1.isTurn) {
            require(player1.board.length == 0, "Player1's game board already set");
            player1.board = board;
            player1.isTurn = false;
            player2.isTurn = true;
        } else {
            require(player2.board.length == 0, "Player2's game board already set");
            player2.board = board;
            player2.isTurn = false;
            player1.isTurn = true;
        }

        // Set the address of the caller as the current player's address
        if (player1.playerAddress == address(0)) {
            player1.playerAddress = msg.sender;
        } else {
            player2.playerAddress = msg.sender;
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
        checkForWinner();
        // Switch the turn to the other player
        player1.isTurn = !player1.isTurn;
        player2.isTurn = !player2.isTurn;
    }

    // Getter function for player 1's game board
    function getPlayer1Board() public view returns (uint8[][] memory) {
        return player1.board;
    }

    // Getter function for player 2's game board
    function getPlayer2Board() public view returns (uint8[][] memory) {
        return player2.board;
    }
    function checkForWinner() public {
    // Check if player 1 has any remaining ships
    bool player1HasShips = false;
    for (uint8 i = 0; i < 5; i++) {
        for (uint8 j = 0; j < 5; j++) {
            if (player1.board[i][j] == 1) {
                player1HasShips = true;
                break;
            }
        }
        if (player1HasShips) {
            break;
        }
    }
    
    // If player 1 has no more ships, declare player 2 the winner and reset the contract
    if (!player1HasShips) {
        // Transfer the contract balance to player 2
        payable(player2.playerAddress).transfer(address(this).balance);
        // Reset the game
        reset();
        return;
    }

    // Check if player 2 has any remaining ships
    bool player2HasShips = false;
    for (uint8 i = 0; i < 5; i++) {
        for (uint8 j = 0; j < 5; j++) {
            if (player2.board[i][j] == 1) {
                player2HasShips = true;
                break;
            }
        }
        if (player2HasShips) {
            break;
        }
    }
    
    // If player 2 has no more ships, declare player 1 the winner and reset the contract
    if (!player2HasShips) {
        // Transfer the contract balance to player 1
        payable(player1.playerAddress).transfer(address(this).balance);
        // Reset the game
        reset();
        return;
    }
}

// Reset the game
function reset() private {
    player1.board = new uint8[][](5);
    player2.board = new uint8[][](5);
    player1.isTurn = true;
    player2.isTurn = false;
    player1.playerAddress = address(0);
    player2.playerAddress = address(0);
}

}
