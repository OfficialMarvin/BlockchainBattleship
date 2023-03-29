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
const cellSize = 50;
const svg = document.getElementById('gridcontainter');


function drawGrid() {   
    for (let y = 0; y < grid.length; y++) {   
        for (let x = 0; x < grid[y].length; x++) {   
            if (grid[y][x] === 1) {   
                drawShip(x * cellSize, y * cellSize);}}}}


function drawShip(x, y) {
  const ship = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  ship.setAttribute('x', x);
  ship.setAttribute('y', y);
  ship.setAttribute('width', cellSize);
  ship.setAttribute('height', cellSize);
  ship.setAttribute('fill', '#848482');
  svg.appendChild(ship);
}
drawGrid();
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
