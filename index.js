// Create a 5x5 grid
const gridSize = 5;
const grid = [];
for (let i = 0; i < gridSize; i++) {
  grid[i] = new Array(gridSize).fill(0);
}

// Allow the user to place 1x1 ships on the grid
const placeShip = (x, y) => {
  if (grid[x][y] === 0) {
    grid[x][y] = 1;
    return true;
  } else {
    return false;
  }
}

// Allow user to place 3 ships
for (let i = 1; i < 4; i++) {
    let x = prompt('Enter the x coordinate for your ship number ' + i);
    let y = prompt('Enter the y coordinate for your ship number ' + i);
    placeShip(x, y);
}

console.log(grid);

// Send the grid to the smart contract
const sendGridToContract = async () => {
  const contractAbi = [ /* ABI here */ ];
  const contractAddress = '0x123456'; //contract address

  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  // Convert the grid to a string and send it to the contract
  const gridString = grid.toString();
  const tx = await contract.methods.setGameBoard(gridString).send({ from: playerAddress, gas: 100000 });
}
