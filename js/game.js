// DEF GLOBAL START
const GAMESTATE = Object.freeze({
  MENU: 0,
  SINGLE_PLAYER: 1,
  TWO_PLAYER: 2,
  CARD_DECK: 3,
  INSTRUCTIONS: 4,
  CREDITS: 5,
  PAUSE: 6,
});

let canvas;
let ctx;
let clouds = [];
const numOfClouds = 10;
const cloudColor = '#FFFFFF'; // White clouds
const handAmount = 1;
let grassStart;

let currAnimation;
let gameState = GAMESTATE.MENU;
let isRunning = true;
let globalDeck = [];

let player1;
let player2;
// let lastTime = 0;

// DEF GLOBAL END

function DrawMenu() {
  //console.log("DrawMenu")
  isRunning = true;
  drawBackground();
  drawClouds();
  drawTitle();
  DrawCastle('blue', 50, 'left');
  DrawCastle('red', 50, 'right');
  DrawMenuButtons();
}

// CLOUDS START
function initClouds() {
  for (let i = 0; i < numOfClouds; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.5; // upper half
    const speed = getRandomArbitrary(0.1, 0.3);
    const size = (Math.random() * 30) + 15;
    clouds.push(new Cloud(x, y, speed, size));
  }
}

function clearClouds() {
  clouds = []
}

function drawClouds() {
  clouds.forEach(cloud => {
    cloud.update();
    cloud.draw();
  });
}

class Cloud {
    constructor(x, y, speed, size) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = size;
    }

    draw() {
        ctx.fillStyle = cloudColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.8, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.4, this.y - this.size * 0.4, this.size * 0.4, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 1.2, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        this.x += this.speed;
        if (this.x > canvas.width + this.size * 1.5) {
            this.x = -this.size * 1.5;
            this.y = Math.random() * canvas.height * 0.5;
            this.speed = getRandomArbitrary(0.1, 0.3);
        }
    }
}

function coinFlip() {
  const result = Math.random();
  if (result < 0.5) {
    return -1;
  } else {
    return 1;
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// CLOUDS END

// CASTLE START

const brickWidth = (225 / 25);
const brickHeight = (75 / 25);

const castleWidth = 10

// TODO
function drawBrick(x, y, width, height, drawBorder) {
  ctx.fillRect(x, y, width, height);
  if (drawBorder) {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
    ctx.closePath();
  }
}

// fixme
function DrawCastle(color, bricksHigh, side) {
  // console.log("DrawCastle")
  ctx.fillStyle = color
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (side == "left") {
      sidePositionX = canvas.width * 0.20;
  } else {
      sidePositionX = canvas.width * 0.80;
      flipper = -1;
  }

  let castleStartY = grassStart;
  //drawBrick(sidePositionX, (castleStartY) - brickHeight, brickWidth * flipper, brickHeight, true);
  for (let layersY = 1; layersY <= bricksHigh; layersY++) {
    for (let layersX = 1; layersX <= castleWidth; layersX++) {
      drawBrick(sidePositionX + (layersX * brickWidth * flipper), (castleStartY) - (brickHeight * layersY), brickWidth, brickHeight, true);
    }
    
  }
}
// CASTLE END

function drawTitle() {
    const text = 'Castle Wars';
    const fontSize = '80px';
    const fontFace = 'Times New Roman';
    const textColor = '#000000ff';
    const borderWidth = 2;

    ctx.font = `${fontSize} ${fontFace}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = canvas.width * 0.5;
    const y = canvas.height * 0.2;

    ctx.strokeStyle = textColor;
    ctx.lineWidth = borderWidth;
    // FIXME, 3d effect
    for(let i = 0; i < 1; i++) {
      ctx.strokeText(text, x, y);
    }
}

// Handle in CSS?
function drawBorder() {
  // ctx.beginPath()
  // ctx.strokeStyle = 'brown';
  // ctx.lineWidth = 13;
  // ctx.rect(0, 0, canvas.width, canvas.height);
  // ctx.stroke();
  // ctx.closePath()
}

function drawBackground() {

  ctx.fillStyle = '#87CEEB'; 
  ctx.fillRect(0, 0, canvas.width, grassStart);
  ctx.fillStyle = '#009900'; 
  ctx.fillRect(0, grassStart, canvas.width, canvas.height / 2);

  // drawBorder();
}

// BUTTON START
let menuButtons = [];

function clearMenuButtons() {
  menuButtons = []
}

class Button {
    constructor(text, x, y, width, height) {
        this.text = text; 
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
  
    draw() {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(225, 225, 225, 0.5)';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = '#000000';
      ctx.font = '20px Times New Roman';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }
    inBounds(mouseX, mouseY) {
        return mouseX > this.x && mouseX < this.x + this.width &&
               mouseY > this.y && mouseY < this.y + this.height;
    }
}
function drawMenuButtons(buttonName, buttonIndex) {

  let x = canvas.width * 0.5 - 60;
  let y = canvas.height * (0.32 + (0.1 * buttonIndex)) - 25;

  let width = 120;
  let height= 50;
  menuButtons.push(new Button(buttonName, x, y, width, height));
}


function DrawMenuButtons() {

  let buttons = ["Single Player", "Two Player", "Card Deck", "Instructions", "Credits"]
  
  for(let button = 0; button < buttons.length; button++) {
    drawMenuButtons(buttons[button], button);
  }
  menuButtons.forEach(button => button.draw());
}

addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    menuButtons.forEach(button => {
        if (button.inBounds(mouseX, mouseY) && isRunning) {
          //alert(`Clicked ${button.text} button!`);
          switch (button.text) {
            case 'Single Player':
              gameState = GAMESTATE.SINGLE_PLAYER;
              player1 = new Player('left', 'human', 'red');
              startingHand(player1);
              player2 = new Player('right', 'cpu', 'grey');
              startingHand(player2);
              break;
            case 'Card Deck':
              gameState = GAMESTATE.CARD_DECK;
            default:
              break;
          }
          isRunning = false;
        }
    });
});

// BUTTON END

// TODO, handle pixel scaling and blurry text
function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  clearClouds();
  clearMenuButtons()
  initClouds()
  grassStart = canvas.height / 1.3;
  // if (gameState == GAMESTATE.MENU) {

  // }
  //createClouds(canvas);
}

window.addEventListener('resize', function() {
  cancelAnimationFrame(currAnimation);
  init();
  requestAnimationFrame(gameLoop);
});

const fenceWidth = 2;
function drawFence(side, bricksHigh) {
  ctx.fillStyle = 'red'
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (side == "left") {
      sidePositionX = canvas.width * 0.40;
  } else {
      sidePositionX = canvas.width * 0.60
      flipper = -1;
  }

  let fenceStartY = grassStart;

  for (let layersY = 1; layersY < bricksHigh; layersY++) {
    for (let layersX = 1; layersX <= fenceWidth; layersX++) {
      drawBrick(sidePositionX + (layersX * brickWidth * flipper), (fenceStartY) - (brickHeight * layersY), brickWidth, brickHeight, true);
      //ctx.strokeRect(sidePosition, (castleStart) - brickHeight - layersY, layersX - brickWidth, brickHeight);
    }
  }
}

function DrawGame(typeOfGame) {
  if (typeOfGame === GAMESTATE.SINGLE_PLAYER) {
    drawBackground();
    drawClouds();
    drawPlayerAndCPU();
  }
}

function drawPlayerAndCPU() {
  player1.draw();
  player2.draw();
}

function gameLoop() {
  // const deltaTime = timeStamp - lastTime;
  // lastTime = timeStamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  switch (gameState) {
    case GAMESTATE.MENU:
      DrawMenu();
      break;
    case GAMESTATE.SINGLE_PLAYER:
      DrawGame(GAMESTATE.SINGLE_PLAYER);
      break;
    case GAMESTATE.CARD_DECK:
      DrawCardDeck();
      break;
    default:
      break;
  }
  currAnimation = requestAnimationFrame(gameLoop);
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  init();
  globalDeck = createDefaultDeck();
  shuffleDeck(globalDeck);
  gameLoop();
  // }
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function drawCard(player) {
  player.hand.push(globalDeck.pop());
}

function startingHand(player) {
  for(let i = 0; i < handAmount; i++) {
    drawCard(player);
  }
}

class PlayerStats {
  constructor(side) {
    this.side = side;
    // brick
    this.builders = {
      name: "Builders",
      amount: 2,
    }
    this.bricks = {
      name: "Bricks",
      amount: 5,
    }
    // weapons;
    this.soldiers = {
      name: "Soldiers",
      amount: 2,
    }
    this.weapons = {
      name: "Weapons",
      amount: 5,
    }
    // crystal
    this.magic = {
      name: "Magic",
      amount: 2,
    }
    this.crystals = {
      name: "Crystals",
      amount: 5,
    }
    //castle
    this.castle = {
      name: "Castle",
      amount: 30,
    }
    this.fence = {
      name: "Fence",
      amount: 10,
    }
  }
  draw() {
    let sidePositionX;
    if (this.side == "left") {
        sidePositionX = canvas.width * 0.10;
    } else {
        sidePositionX = canvas.width * 0.90
    }
    for(let playerStatRect = 1; playerStatRect <= 4; playerStatRect++) {
      switch (playerStatRect) {
        case 1:
          drawStat(0,0,0,0,this.builders, this.bricks);
          break;
        case 2:
          drawStat(0,0,0,0,this.soldiers, this.weapons);
          break;
        case 3:
          drawStat(0,0,0,0,this.magic, this.crystals);
          break;
        case 4:
          drawStat(0,0,0,0,this.castle, this.fence);
          break;
        default:
          break;
      }
    }
  }
}

// PLAYER START
class Player {
  // 'left'
  // 'human' | 'cpu'
  constructor(side, kind, color) {
    this.side = side;
    this.kind = kind;
    this.color = color;
    this.hand = [];
    this.playerStats = new PlayerStats(this.side);
  }
  draw() {

    DrawCastle(this.color, this.playerStats.castle.amount, this.side);
    drawFence(this.side, this.playerStats.fence.amount);
    this.playerStats.draw()
    if(this.kind === 'player') {
      // drawCardsFaceUp
    } else if (this.kind === 'cpu') {
      // drawCardsFaceDown
    }
  }
}

function drawStat(x, y, width, height, stat1, stat2) {
  // ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "#FF0000"; // Set the fill color to red
  ctx.fillRect(10, 20, 150, 100); // Draw a filled rectangle at (10, 20) with width 150, height 100

  // 2. Add the text (drawn on top of the rectangle)
  ctx.fillStyle = "#FFFFFF"; // Set the text color to white
  ctx.font = "20px Arial"; // Define the font style and size
  ctx.fillText(stat1, 20, 75); // Draw "Hello World" at (20, 75)
}

//
// DECK START

// TODO add ability for custom


// const CARDS = Object.freeze({
//   WALL: 0,
//   BASE: 1,
//   DEFENCE: 2,
//   RESERVE: 3,
//   TOWER: 4,
//   SCHOOL: 5,
//   WAIN: 6,
//   FENCE: 7,
//   FORT: 8,
//   BABYLON: 9,
// });

function DrawCardDeck() {
    drawBackground();
    drawClouds();
    DrawCastle('blue', 50, 'left');
    DrawCastle('red', 50, 'right');
    drawCards();
}

function drawCards() {
  //
}

function createDefaultDeck() {
  let defaultDeck = [];
  const wallCards = 3;
  for(let i = 0; i < wallCards; i++) {
    defaultDeck.push(new Card("Wall", {"brick": -1}, {"self": {"fence": 3}}));
  }
  const baseCards = 3;
  for(let i = 0; i < baseCards; i++) {
    defaultDeck.push(new Card("Base", {"brick": -1}, {"self": {"castle": 2}}));
  }
  // const defenceCards = 3;
  // const reserveCards = 3;
  // const towerCards = 3;
  return defaultDeck;
}


class Card {
  // "Wain"
  // {brick: -10}
  // {self: {castle: 8}, enemy: {castle: -4}}
  constructor(name, cost, effect) {
    this.name = name;
    this.cost = cost;
    this.effect = effect
  }

  draw() {

  }
}

// DECK END