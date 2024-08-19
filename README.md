# Blockchain Battleship 🚢

**Blockchain Battleship** is a decentralized version of the classic Battleship game, allowing two players to battle it out on the Ethereum blockchain. The game includes a chat feature, turn-based gameplay, and an interactive front-end.

## 🛠️ Tech Stack

- **Solidity:** Smart contract for game logic and state management.
- **Web3.js:** JavaScript library for blockchain interaction.
- **HTML/CSS/JavaScript:** Front-end for game and chat interface.

## 🚀 Quick Start

### 1. Deploy the Smart Contract

- **Use Remix:**
  - Copy the Solidity code from the provided `Battleship.sol`.
  - Deploy it on a testnet like Sepolia or Goerli.
  - Copy the deployed contract address.

### 2. Update the Front-End

- **Edit `index.js`:**
  - Replace `const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';` with your deployed contract address.

### 3. Serve the Front-End

- **Fork the Repo:**
  - Clone or fork the repository.
  - Open `index.html` in your browser.

### 4. Play the Game

- **MetaMask Required:** Connect to the correct network, set up your game board, and start playing against another player.
- **In-Game Chat:** Communicate with your opponent using the built-in chat feature.

## 📜 Smart Contract Overview

- **`setGameBoard`:** Sets up the player's game board.
- **`makeMove`:** Allows a player to make a move against the opponent's board.
- **`sendMessage`:** Sends a message in the game chat.
- **`getChatHistory`:** Retrieves the chat history.
- **`checkForWinner`:** Checks for a winner after each move.

## 🌟 Contributions

- Fork, improve, and submit a pull request on GitHub.

## 📝 License

Licensed under the MIT License.

---

Good luck and may the best captain win! 🎯
