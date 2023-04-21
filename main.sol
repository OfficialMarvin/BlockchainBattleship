// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// struct for each players game state
struct GameState {
    uint8[][] board;
    bool isTurn;
    address playerAddress;
}
//struct for messages sent by players
struct Message {
        address sender;
        uint timestamp;
        string text;
}
// define contract
contract Battleship {
    GameState public player1;
    GameState public player2;
    Message[] public chatHistory;
	event GameOver(address winner);
	
	function sendMessage(string memory text) public {
        require(msg.sender == player1.playerAddress || msg.sender == player2.playerAddress, "Only players can send messages");
        require(bytes(text).length > 0, "Message is empty");
        chatHistory.push(Message(msg.sender, block.timestamp, text));
    }

    function getChatHistory() public view returns (Message[] memory) {
        return chatHistory;
    }
   
    function setGameBoard(uint8[][] memory board) public {

        // check whose turn and set board and turns accordingly
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

        // make address of caller players addy
        if (player1.playerAddress == address(0)) {
            player1.playerAddress = msg.sender;
        } else {
            player2.playerAddress = msg.sender;
        }
    }

    // for making moves
    function makeMove(uint8 x, uint8 y) public {
        // check if players turn
        require((msg.sender == address(player1.playerAddress) && player1.isTurn) || (msg.sender == address(player2.playerAddress) && player2.isTurn), "Not your turn");

        // determine who is making move
        GameState storage gameState;
        if (msg.sender == address(player1.playerAddress)) {
            gameState = player2;
        } else {
            gameState = player1;
        }

        // check if move iin bound
        require(x < 5 && y < 5, "Move out of bounds");

        // check if move made already
        require(gameState.board[x][y] < 2, "Move already made");

        // update array based on hit or miss
        if (gameState.board[x][y] == 1) {
            gameState.board[x][y] = 3; // Hit (3)
        } else {
            gameState.board[x][y] = 2; // Miss (2)
        }
        checkForWinner();
        // switch turns
        player1.isTurn = !player1.isTurn;
        player2.isTurn = !player2.isTurn;
    }

    // get player 1s board
    function getPlayer1Board() public view returns (uint8[][] memory) {
        return player1.board;
    }

    // get player 2s board
    function getPlayer2Board() public view returns (uint8[][] memory) {
        return player2.board;
    }
    function checkForWinner() public {
    // check if player 1 has ships
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
    
    // if player 1 has no ships, player 2 wins
    if (!player1HasShips) {
        // send contract balance to player 2
        payable(player2.playerAddress).transfer(address(this).balance);
        emit GameOver(player2.playerAddress);
        // reset game
        reset();
        return;
    }

    // check if player 2 has ships
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
    
    // if player 2 has no ships, player 1 wins
    if (!player2HasShips) {
        // send contract balance to player 1
        payable(player1.playerAddress).transfer(address(this).balance);
        emit GameOver(player1.playerAddress);
        // reset
        reset();
        return;
    }
}

// reset function
function reset() public {
    player1.board = new uint8[][](0);
    player2.board = new uint8[][](0);
    player1.isTurn = true;
    player2.isTurn = false;
    player1.playerAddress = address(0);
    player2.playerAddress = address(0);
    delete chatHistory;
}

}
