
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
// displays the chat history from the contract
async function displayChatHistory() {
  const chatHistory = await myContract.methods.getChatHistory().call();
  const chatContainer = document.getElementById("chat-container");
  chatContainer.innerHTML = "";

  chatHistory.forEach(chat => {
    const timestamp = new Date(chat.timestamp * 1000);
    const message = `${timestamp.toLocaleString()}: ${chat.message}`;
    const formattedMessage = "0x"+message.slice(0, 2) + message.slice(39,42) + ': ' + message.slice(168);
    const chatDiv = document.createElement("div");
    chatDiv.innerText = formattedMessage;
    chatContainer.appendChild(chatDiv);
  });
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
const contractAddress = '0x5F1E312f7d22029993fB3081535c3eFbEB2626a1';
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

     
    /*
    myContract.events.GameOver(function(error, result) {
      if (!error) {
        if (result.returnValues.winner === myContract.methods.player1().call().playerAddress) {
          alert("Player 1 wins!"); // display popup indicating player 1 wins
        } else {
          alert("Player 2 wins!"); // display popup indicating player 2 wins
        }
      }
    });
    */

    function addMessage(message) {
      const messageString = String(message);
      const messages = messageString.split(',');
      let formattedMessages = [];
      for (let i = 0; i < messages.length; i=i+3) {
      const prefix = messages[i].slice(0, 5);
      const suffix = messages[i+2];
      formattedMessages.push(prefix + ': ' + suffix);
      }
      const formattedMessage = formattedMessages.join();
      const messagesElement = document.querySelector('.messages');
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.textContent = formattedMessage;
      messagesElement.appendChild(messageElement);
      console.log("message string "+ formattedMessage);
    }
  
    // Define a function to retrieve the latest message from the smart contract and add it to the chatbox
    function updateMessages() {
      myContract.methods.getChatHistory().call(function(error, result) {
        if (error) {
          console.error(error);
        } else {
          if (!(result.length == 0)){
            console.log("why add: " + typeof result);
          addMessage(result);}
        }
      });
    }
  
    // Define a function to send a message to the smart contract and update the chatbox
    function sendMessage(message) {
      myContract.methods.sendMessage(message + "\n").send({from: userAddress}, function(error, transactionHash) {
        if (error) {
          console.error(error);
        } else {
          console.log('Transaction hash:', transactionHash);
          addMessage(message);
        }
      });
    }
  
    // Handle form submit event to send a message
    const submitButton = document.querySelector('.btn-send');
    submitButton.addEventListener('click', function() {
    event.preventDefault();
    const inputElement = document.querySelector('.input-message');
    const message = (inputElement.value.trim()).toString();
    if (message !== '') {
    sendMessage(message);
    console.log(message);
    inputElement.value = '';
    }
    });
  
    // Update messages on page load
    updateMessages();





    console.log(myContract);
    console.log("test attempted");
    //displayChatHistory();
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
      const waitingMessage2 = document.createElement('div');
      waitingMessage2.id = 'waiting-message';
      waitingMessage2.innerText = 'Sending board & waiting for opponent';
      document.body.appendChild(waitingMessage2);
      await new Promise(resolve => setTimeout(resolve, 45000));
      document.body.removeChild(waitingMessage);
    console.log("player1 grid sent");}
    if (!isPlayer1 && player2Board.length == 0){
      setup();
      myContract.methods.setGameBoard(grid).send({ from: coinbaseString, gas: 1000000 });
      const waitingMessage2 = document.createElement('div');
      waitingMessage2.id = 'waiting-message';
      waitingMessage2.innerText = 'Sending board & waiting for opponent';
      document.body.appendChild(waitingMessage2);
      await new Promise(resolve => setTimeout(resolve, 45000));
      document.body.removeChild(waitingMessage2);
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
        console.log("BOARD LENGTH p2: " + player2Board.length.toString());
        console.log("Player 2 board pulled");
        console.log(egrid);}
       else { //set player and enemy board according to player number, update arrays
        grid = player2Board;
        egrid = player1Board;
        drawGrid(grid);
        drawEGrid(egrid);
        console.log("BOARD LENGTH p1: " + player1Board.length.toString());
        console.log("Player 1 board pulled");
        console.log(egrid);}
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
        myContract.methods.makeMove(x,y).send({ from: coinbaseString, gas: 1000000 });
        console.log(player1.isTurn);
        player1.isTurn = false;
        const waitingMessage = document.createElement('div');
        waitingMessage.id = 'waiting-message';
        waitingMessage.innerText = 'Wait 25 seconds to send move on chain...';
        document.body.appendChild(waitingMessage);
        await new Promise(resolve => setTimeout(resolve, 25000));
        document.body.removeChild(waitingMessage);
        console.log("tx wait over");
        pullnUpdate();
      }
      else if (isPlayer1 == false && player2.isTurn){ //let player2 attack if it is their turn 
        console.log("player 2 attack time")
        let x = prompt('Enter the x coordinate for your attack');
        let y = prompt('Enter the y coordinate for your attack');
        myContract.methods.makeMove(x,y).send({ from: coinbaseString, gas: 1000000 });
        player2.isTurn = false;
        const waitingMessage = document.createElement('div');
        waitingMessage.id = 'waiting-message';
        waitingMessage.innerText = 'Wait 25 seconds to send move on chain...';
        document.body.appendChild(waitingMessage);
        await new Promise(resolve => setTimeout(resolve, 30000));
        document.body.removeChild(waitingMessage);
        console.log("tx wait over");
        pullnUpdate();
      }
      else if ((isPlayer1 && player2.isTurn) || (!isPlayer1 && player1.isTurn)){
        console.log("hit else")
        const waitingMessage2 = document.createElement('div');
        waitingMessage2.id = 'waiting-message';
        waitingMessage2.innerText = 'Waiting for the next player to move...';
        document.body.appendChild(waitingMessage2);
        const waitForTurn = async () => {
          if ((isPlayer1 && player1.isTurn) || (!isPlayer1 && player2.isTurn)) { //wait if not turn
            console.log("wait message gone")
            document.body.removeChild(waitingMessage2);
          } else {
            await new Promise(resolve => setTimeout(resolve, 10000)); // wait for 10 second before checking again
            /*
            // pull boards from chain to update player structure
            player1Board = await myContract.methods.getPlayer1Board().call();
            player2Board = await myContract.methods.getPlayer2Board().call();
            // read turns from chain
            player1 = await myContract.methods.player1().call();
            player2 = await myContract.methods.player2().call();
            */
            location.reload();
            //await waitForTurn();
          }
        };
        await waitForTurn();
      };
    };
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
