// Create a 5x5 grid
const gridSize = 5;
let grid = [];
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
const cellSize = 100;
const svg = document.getElementById('gridcontainter');
const enemysvg = document.getElementById('gridcontainter2');


function drawGrid() {   
    for (let y = 0; y < grid.length; y++) {   
        for (let x = 0; x < grid[y].length; x++) {   
            if (grid[y][x] < 4) {   
                drawShip(x * cellSize, y * cellSize, grid[y][x] );}}}}


function drawShip(x, y, s) {
if (s == 0){ // if 0 then make a blank sea square
    const sea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    sea.setAttribute('x', x);
    sea.setAttribute('y', y);
    sea.setAttribute('width', cellSize);
    sea.setAttribute('height', cellSize);
    sea.setAttribute('fill', '#0080FF');
    svg.appendChild(sea);}
if (s == 1) { // if 1 then make a sea square with boat polygon on top
    const sea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    sea.setAttribute('x', x);
    sea.setAttribute('y', y);
    sea.setAttribute('width','100');
    sea.setAttribute('height','100'); 
    sea.setAttribute("fill", "#0080FF");
    const boat = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const pointsString = `${50 + x},${5 + y} ${75 + x},${30 + y} ${75 + x},${95 + y} ${25 + x},${95 + y} ${25 + x},${30+ y}`;
    boat.setAttribute("points", pointsString);
    boat.style.fill="#808080";
    boat.style.stroke="black";
    svg.appendChild(sea);
    svg.appendChild(boat);}
}
drawGrid();
console.log(grid);
console.log(window.ethereum);
const provider = new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/ef929a0b34fa45c6b8758c57145b96b5');
let web3;
let egrid = [];


const contractAddress = '0x7Bd57c0Ece2220Bdc6AB8E3Ecb4e8d8Fa808DD64';
if (typeof window.ethereum !== 'undefined') {
  try {
    await window.ethereum.enable();
    web3 = new Web3(window.ethereum);
    console.log('Connected to Ethereum successfully!');
    const userAddress = await web3.eth.getCoinbase();
    console.log(userAddress);
    const response = await fetch('https://raw.githubusercontent.com/OfficialMarvin/BlockchainBattleship/main/abi.json');
    const data = await response.json();
    const myContract = new web3.eth.Contract(data, contractAddress);
    console.log(myContract); //Connected to blockchain
    const coinbase = await web3.eth.getCoinbase();
    const coinbaseString = coinbase.toString();
    myContract.methods.setGameBoard(grid).send({ from: coinbaseString, gas: 1000000 })
      .then((receipt) => {
        console.log(grid);
        console.log(receipt);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("first grid sent"); //sent initial grid
    let player1 = await myContract.methods.player1().call();
    let player2 = await myContract.methods.player2().call();
    const isPlayer1 = player1.playerAddress.toLowerCase() === coinbase.toLowerCase();

    async function pullnUpdate() {
      let egrid = [];
      let player1Board = [];
      let player2Board = [];
      if (isPlayer1) {
        while (player2Board == []) {
          player1Board = await myContract.methods.getPlayer1Board().call();
          player2Board = await myContract.methods.getPlayer2Board().call();
          await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking again
        }
        grid = player1Board;
        egrid = player2Board;
        console.log("Player 2 board pulled");
      } else {
        while (player1Board == []) {
          player1Board = await myContract.methods.getPlayer1Board().call();
          player2Board = await myContract.methods.getPlayer2Board().call();
          await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking again
        }
        grid = player2Board
        egrid = player1Board;
        console.log("Player 1 board pulled");
      }
    
      // Update grids
      drawGrid()
      drawEGrid(egrid);
      console.log(egrid);

    if (isPlayer1 && player1.isTurn){
      let x = prompt('Enter the x coordinate for your attack');
      let y = prompt('Enter the y coordinate for your attack');
      myContract.methods.makeMove(x,y).send({ from: coinbaseString, gas: 1000000 })
    }
    if (isPlayer1 == false && player2.isTurn){
      let x = prompt('Enter the x coordinate for your attack');
      let y = prompt('Enter the y coordinate for your attack');
      myContract.methods.makeMove(x,y).send({ from: coinbaseString, gas: 1000000 })
    }}
    let gridHasOnes = true;
let egridHasOnes = true;

// Check if either grid or egrid has any 1's
while (gridHasOnes || egridHasOnes) {
  gridHasOnes = false;
  egridHasOnes = false;

  // Check if grid has any 1's
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 1) {
        gridHasOnes = true;
        break;
      }
    }
    if (gridHasOnes) {
      break;
    }
  }

  // Check if egrid has any 1's
  for (let i = 0; i < egrid.length; i++) {
    for (let j = 0; j < egrid[i].length; j++) {
      if (egrid[i][j] === 1) {
        egridHasOnes = true;
        break;
      }
    }
    if (egridHasOnes) {
      break;
    }
  }

  // If either grid or egrid has any 1's, call pullnUpdate()
  if (gridHasOnes || egridHasOnes) {
    await pullnUpdate();
  }
}

  } catch (error) {
    console.error(error);
  }
} else {
  console.log('Please install MetaMask to connect to the Ethereum network');
}


//Build enemy grid same way but do not show boats:

function drawEGrid(egrid) {   
  for (let y = 0; y < egrid.length; y++) {   
      for (let x = 0; x < egrid[y].length; x++) {   
          if (egrid[y][x] < 4) {   
              drawEShip(x * cellSize, y * cellSize, egrid[y][x] );}}}}


function drawEShip(x, y, s) {
if (s < 2){ // if 0 or 1 then make a blank sea square
  const sea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  sea.setAttribute('x', x);
  sea.setAttribute('y', y);
  sea.setAttribute('width', cellSize);
  sea.setAttribute('height', cellSize);
  sea.setAttribute('fill', '#0080FF');
  enemysvg.appendChild(sea);}
if (s == 3) { // if 3 then make a sea square with red boat polygon on top
  const sea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  sea.setAttribute('x', x);
  sea.setAttribute('y', y);
  sea.setAttribute('width','100');
  sea.setAttribute('height','100'); 
  sea.setAttribute("fill", "#0080FF");
  const boat = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  const pointsString = `${50 + x},${5 + y} ${75 + x},${30 + y} ${75 + x},${95 + y} ${25 + x},${95 + y} ${25 + x},${30+ y}`;
  boat.setAttribute("points", pointsString);
  boat.style.fill="#FF0000";
  boat.style.stroke="black";
  enemysvg.appendChild(sea);
  enemysvg.appendChild(boat);}
if (s == 2){ //if 2 make yellow miss square
  const sea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  sea.setAttribute('x', x);
  sea.setAttribute('y', y);
  sea.setAttribute('width', cellSize);
  sea.setAttribute('height', cellSize);
  sea.setAttribute('fill', '#0080FF');
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x + cellSize/2);
  circle.setAttribute('cy', y + cellSize/2);
  circle.setAttribute('r', cellSize/4);
  circle.setAttribute('fill', 'yellow');
  
  enemysvg.appendChild(sea);
  enemysvg.appendChild(circle);}
}



async function makeMove(playerIndex, x, y) {
  await myContract.methods.makeMove(x, y).send({ from: playerIndex });
}