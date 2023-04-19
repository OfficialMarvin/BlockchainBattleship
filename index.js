// 5x5 grid for board
const gridSize = 5;
let grid = [];
for (let i = 0; i < gridSize; i++) {
  grid[i] = new Array(gridSize).fill(0);
}
// place ship on grid
const placeShip = (x, y) => {
  if (grid[x][y] === 0) {
    grid[x][y] = 1;
    return true;
  } else {
    return false;
  }
}
// prompt & let user place 3 ships
function setup(){
for (let i = 1; i < 4; i++) {
    let x = prompt('Enter the x coordinate for your ship number ' + i);
    let y = prompt('Enter the y coordinate for your ship number ' + i);
    placeShip(x, y);
}}
// setup svg elements
const cellSize = 100;
const svg = document.getElementById('gridcontainter');
const enemysvg = document.getElementById('gridcontainter2');
// draw grid correct size
function drawGrid(grid) {   
    for (let y = 0; y < grid.length; y++) {   
        for (let x = 0; x < grid[y].length; x++) {   
            if (grid[y][x] < 4) {   
                drawShip(x * cellSize, y * cellSize, grid[y][x] );}}}}
// add svg ships to grid
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
    }
drawGrid(grid);
console.log(grid);
console.log(window.ethereum);
const provider = new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/ef929a0b34fa45c6b8758c57145b96b5');
let web3;
let egrid = [];
const contractAddress = '0xbc58b0120aa46684912c77735e31b3424aa9b8d9';
if (typeof window.ethereum !== 'undefined') {
  try {
    await window.ethereum.enable();
    web3 = new Web3(window.ethereum); //initialize web3
    console.log('Connected to Ethereum successfully!');
    const userAddress = await web3.eth.getCoinbase();
    console.log(userAddress);
    const response = await fetch('https://raw.githubusercontent.com/OfficialMarvin/BlockchainBattleship/main/abi.json'); //abi from github
    const data = await response.json();
    const myContract = new web3.eth.Contract(data, contractAddress); //connect to blockchain
    console.log(myContract);
    const coinbase = await web3.eth.getCoinbase();
    const coinbaseString = coinbase.toString(); //get user address
    let player1 = await myContract.methods.player1().call();
    let player2 = await myContract.methods.player2().call();
    let player1Board = await myContract.methods.getPlayer1Board().call();
    let player2Board = await myContract.methods.getPlayer2Board().call(); //pull players, boards, and addresses from chain
    const isPlayer1 = player1.playerAddress.toLowerCase() === coinbase.toLowerCase(); //var to see if user p1 or p2
    // if start board has not been set then setup for either player
    if (isPlayer1 && player1Board.length == 0){
      setup();
      myContract.methods.setGameBoard(grid).send({ from: coinbaseString, gas: 1000000 });
    console.log("player1 grid sent");}
    if (!isPlayer1 && player2Board.length == 0){
      setup();
      myContract.methods.setGameBoard(grid).send({ from: coinbaseString, gas: 1000000 });
      console.log("player2 grid sent");}
    // main recursive game loop
    async function pullnUpdate() {
      let player1Board = await myContract.methods.getPlayer1Board().call();
      let player2Board = await myContract.methods.getPlayer2Board().call();
      if (isPlayer1) {
        grid = player1Board;
        egrid = player2Board;
        drawGrid(grid);
        drawEGrid(egrid);
        if (player2Board.length == 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking again
        console.log("Player 2 board pulled");
        console.log(egrid);}
      } else { //set player and enemy board according to player number, update arrays
        grid = player2Board;
        egrid = player1Board;
        drawGrid(grid);
        drawEGrid(egrid);
        if (player1Board.length == 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking again
        console.log("Player 1 board pulled");
        console.log(egrid);}
      }
      console.log("start boards set");
      player1Board = await myContract.methods.getPlayer1Board().call();
      player2Board = await myContract.methods.getPlayer2Board().call();
      player1 = await myContract.methods.player1().call();
      player2 = await myContract.methods.player2().call();
      console.log("player 1 turn: " + player1.isTurn.toString());
      console.log("is player 1: " + isPlayer1.toString());
  
      if (isPlayer1 && player1.isTurn){ //let player1 attack if it is their turn 
        console.log("player 1 attack time")
        let x = prompt('Enter the x coordinate for your attack');
        let y = prompt('Enter the y coordinate for your attack');
        let tx = await myContract.methods.makeMove(x,y).send({ from: coinbaseString, gas: 1000000 });
        console.log(player1.isTurn);
        player1.isTurn = false;
        await tx.wait(); // wait for the transaction to be confirmed
  setTimeout(async () => {
    await pullnUpdate(); // recursive board update after 3 seconds delay
  }, 3000);
        console.log("tx wait over")

      }
      else if (isPlayer1 == false && player2.isTurn){ //let player2 attack if it is their turn 
        console.log("player 2 attack time")
        let x = prompt('Enter the x coordinate for your attack');
        let y = prompt('Enter the y coordinate for your attack');
        let tx = await myContract.methods.makeMove(x,y).send({ from: coinbaseString, gas: 1000000 });
        player2.isTurn = false;
        await tx.wait(); // wait for the transaction to be confirmed
        setTimeout(async () => {
          await pullnUpdate(); // recursive board update after 3 seconds delay
        }, 3000);
        console.log("tx wait over")
      }
      else {
        const waitingMessage = document.createElement('div');
        waitingMessage.id = 'waiting-message';
        waitingMessage.innerText = 'Waiting for the next player to move...';
        document.body.appendChild(waitingMessage);
        const waitForTurn = async () => {
          if ((isPlayer1 && player2.isTurn) || (!isPlayer1 && player1.isTurn)) { //wait if not turn
            document.body.removeChild(waitingMessage);
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking again
            // pull boards from chain to update player structure
            player1Board = await myContract.methods.getPlayer1Board().call();
            player2Board = await myContract.methods.getPlayer2Board().call();
            // read turns from chain
            player1 = await myContract.methods.player1().call();
            player2 = await myContract.methods.player2().call();
            await waitForTurn();
          }
        };
        await waitForTurn();
      }
    }
    await pullnUpdate(); // call loop as first run, rest is recursive
  } catch (error) {
    console.error(error);
  }
} else {
  console.log('Please install MetaMask to connect to the Ethereum network'); // incase metamask not detected
}
//Build enemy grid same way but do not show ships:
function drawEGrid(egrid) {   
  for (let y = 0; y < egrid.length; y++) {   
      for (let x = 0; x < egrid[y].length; x++) {   
          if (egrid[y][x] < 4) {   
              drawEShip(x * cellSize, y * cellSize, egrid[y][x] );}}}}

function drawEShip(x, y, s) {
if (s < 2){ // if 0 or 1 then make a blank sea square to not show ship
  const sea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  sea.setAttribute('x', x);
  sea.setAttribute('y', y);
  sea.setAttribute('width', cellSize);
  sea.setAttribute('height', cellSize);
  sea.setAttribute('fill', '#0080FF');
  enemysvg.appendChild(sea);}
if (s == 3) { // if 3 then make a sea square with red boat 
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

async function makeMove(playerIndex, x, y) { //to send moves to contract
  await myContract.methods.makeMove(x, y).send({ from: playerIndex });
}
