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

async function fetchABI(web3) {
  const response = await fetch('https://raw.githubusercontent.com/OfficialMarvin/BlockchainBattleship/main/abi.json');
  const data = await response.json();
  const myContract = new web3.eth.Contract(data, contractAddress);
  console.log(myContract);
  const coinbase = await web3.eth.getCoinbase();
  const coinbaseString = coinbase.toString();
  myContract.methods.setGameBoard(grid).send({ from: coinbaseString, gas: 1000000 })
  .then((receipt) => {
    console.log(grid);
    console.log(receipt);
  })
  .catch((error) => {
    // Handle error
    console.error(error);
  });
  console.log("grid attempted send");
}

const contractAddress = '0x548eAA3DA0E4d8F305101a575d07AB2405f66A24';

async function sendGrid(web3) {
  await fetchABI(web3);
}

async function connectEth(){
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.enable();
      web3 = new Web3(window.ethereum);
      console.log('Connected to Ethereum successfully!');
      const userAddress = await web3.eth.getCoinbase();
      console.log(userAddress);
      sendGrid(web3);
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log('Please install MetaMask to connect to the Ethereum network');
  }
}

connectEth();

//Build enemy grid same way but do not show boats:
const egrid = [];
for (let i = 0; i < gridSize; i++) {
  egrid[i] = new Array(gridSize).fill(0);
}

function drawEGrid() {   
  for (let y = 0; y < egrid.length; y++) {   
      for (let x = 0; x < egrid[y].length; x++) {   
          if (egrid[y][x] < 4) {   
              drawEShip(x * cellSize, y * cellSize, egrid[y][x] );}}}}


function drawEShip(x, y, s) {
if (s < 2){ // if 0 then make a blank sea square
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
if (s == 2){
  const sea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  sea.setAttribute('x', x);
  sea.setAttribute('y', y);
  sea.setAttribute('width', cellSize);
  sea.setAttribute('height', cellSize);
  sea.setAttribute('fill', '#ECFF00');
  enemysvg.appendChild(sea);}
}
drawEGrid();


//PULL IN ENEMY GRID FROM CONTRACT THEN CREATE MAKEMOVE GAME LOOP DRAWING GRID AND EGRID AFTER EVERY TURN

async function makeMove(playerIndex, x, y) {
  await myContract.methods.makeMove(x, y).send({ from: playerIndex });
}
