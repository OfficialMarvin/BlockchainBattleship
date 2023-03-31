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
}

const contractAddress = '0x3e4a3e6c3b446fD7a59c3dAdc2ba0db9a80Fec62';

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
      await sendGrid(web3);
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log('Please install MetaMask to connect to the Ethereum network');
  }
}

connectEth();


async function makeMove(playerIndex, x, y) {
  await myContract.methods.makeMove(x, y).send({ from: playerIndex });
}
