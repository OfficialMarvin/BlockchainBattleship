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
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "x",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "y",
				"type": "uint8"
			}
		],
		"name": "makeMove",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8[][]",
				"name": "board",
				"type": "uint8[][]"
			}
		],
		"name": "setGameBoard",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "player1",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isTurn",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "playerAddress",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "player2",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isTurn",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "playerAddress",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const web3 = new Web3(window.ethereum);
const ethereumButton = document.querySelector('.enableEthereumButton');

ethereumButton.addEventListener('click', () => {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    ethereumButton.addEventListener('click', () => {
      //Check if we have Web3 provider
      if (typeof window.ethereum !== 'undefined') {
          // Request account access
          window.ethereum.request({ method: 'eth_requestAccounts' })
            .then((accounts) => {
              console.log(accounts);
            })
            .catch((error) => {
              console.error(error);
            });
       } else {
           console.log("Web3 provider not found");
       }
    });
});
const playerAddress = window.ethereum.selectedAddress;
const contractAddress = '0xbbc292f8dad352900dd04d9d69a40a713b185049'; //Replace with your own Contract Address
const myContract = new web3.eth.Contract(contractABI, contractAddress);
myContract.methods.makeMove(2, 2).send({from: playerAddress})
.then((result) => {
console.log(result);
})
.catch((error) =>{
console.error(error);
});

// Send the grid to the smart contract
const sendGridToContract = async () => {
  const contractAddress = '0xbbc292f8dad352900dd04d9d69a40a713b185049'; //contract address

  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  // Convert the grid to a string and send it to the contract
  const gridString = grid.toString();
  const tx = await contract.methods.setGameBoard(gridString).send({ from: playerAddress, gas: 100000 });
}
