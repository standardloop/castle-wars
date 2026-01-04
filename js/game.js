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

const ACTUAL_GAMESTATE = Object.freeze({
  DEALING: 0,
  PLAYER_1_TURN: 1,
  PLAYER_2_TURN: 2,
  PLAYER_1_WIN: 3,
  PLAYER_2_WIN: 4,
  GAME_PAUSE: 5,
});

let canvas;
let ctx;
let clouds = [];
const numOfClouds = 10;
const cloudColor = "#FFFFFF"; // White clouds
const handAmount = 8;
let grassStart;

let currAnimation;
let gameState = GAMESTATE.MENU;
let actualGameState = ACTUAL_GAMESTATE.PLAYER_1_TURN;
let isRunning = true;
let globalDeck = [];
let turn = 0; // player1

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
  DrawCastle("blue", 50, "left");
  DrawCastle("red", 50, "right");
  DrawMenuButtons();
}

// CLOUDS START
function initClouds() {
  for (let i = 0; i < numOfClouds; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.5; // upper half
    const speed = getRandomArbitrary(0.1, 0.3);
    const size = Math.random() * 30 + 15;
    clouds.push(new Cloud(x, y, speed, size));
  }
}

function clearClouds() {
  clouds = [];
}

function drawClouds() {
  clouds.forEach((cloud) => {
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
    ctx.arc(
      this.x + this.size * 0.4,
      this.y - this.size * 0.4,
      this.size * 0.4,
      0,
      Math.PI * 2,
    );
    ctx.arc(
      this.x + this.size * 1.2,
      this.y - this.size * 0.3,
      this.size * 0.3,
      0,
      Math.PI * 2,
    );
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

const brickWidth = 225 / 25;
const brickHeight = 75 / 25;

const castleWidth = 10;

// TODO
function drawBrick(x, y, width, height, drawBorder) {
  ctx.fillRect(x, y, width, height);
  if (drawBorder) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
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
  ctx.fillStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (side == "left") {
    sidePositionX = canvas.width * 0.2;
  } else {
    sidePositionX = canvas.width * 0.8;
    flipper = -1;
  }

  let castleStartY = grassStart;
  //drawBrick(sidePositionX, (castleStartY) - brickHeight, brickWidth * flipper, brickHeight, true);
  for (let layersY = 1; layersY <= bricksHigh; layersY++) {
    for (let layersX = 1; layersX <= castleWidth; layersX++) {
      drawBrick(
        sidePositionX + layersX * brickWidth * flipper,
        castleStartY - brickHeight * layersY,
        brickWidth,
        brickHeight,
        true,
      );
    }
  }
}
// CASTLE END

function drawTitle() {
  const text = "Castle Wars";
  const fontSize = "80px";
  const fontFace = "Times New Roman";
  const textColor = "#000000ff";
  const borderWidth = 2;

  ctx.font = `${fontSize} ${fontFace}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const x = canvas.width * 0.5;
  const y = canvas.height * 0.2;

  ctx.strokeStyle = textColor;
  ctx.lineWidth = borderWidth;
  // FIXME, 3d effect
  for (let i = 0; i < 1; i++) {
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
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, grassStart);
  ctx.fillStyle = "#009900";
  ctx.fillRect(0, grassStart, canvas.width, canvas.height / 2);

  // drawBorder();
}

// BUTTON START
let menuButtons = [];

function clearMenuButtons() {
  menuButtons = [];
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
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(225, 225, 225, 0.5)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#000000";
    ctx.font = "20px Times New Roman";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }
  inBounds(mouseX, mouseY) {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    );
  }
}
function drawMenuButtons(buttonName, buttonIndex) {
  let x = canvas.width * 0.5 - 60;
  let y = canvas.height * (0.32 + 0.1 * buttonIndex) - 25;

  let width = 120;
  let height = 50;
  menuButtons.push(new Button(buttonName, x, y, width, height));
}

function DrawMenuButtons() {
  let buttons = [
    "Single Player",
    "Two Player",
    "Card Deck",
    "Instructions",
    "Credits",
  ];

  for (let button = 0; button < buttons.length; button++) {
    drawMenuButtons(buttons[button], button);
  }
  menuButtons.forEach((button) => button.draw());
}

addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  menuButtons.forEach((button) => {
    if (button.inBounds(mouseX, mouseY) && isRunning) {
      //alert(`Clicked ${button.text} button!`);
      switch (button.text) {
        case "Single Player":
          gameState = GAMESTATE.SINGLE_PLAYER;
          player1 = new Player("left", "human", 1, "blue");
          startingHand(player1);
          player2 = new Player("right", "cpu", 2, "grey");
          startingHand(player2);
          break;
        case "Card Deck":
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
  clearMenuButtons();
  initClouds();
  grassStart = canvas.height / 1.3;
  // if (gameState == GAMESTATE.MENU) {

  // }
  //createClouds(canvas);
}

window.addEventListener("resize", function () {
  cancelAnimationFrame(currAnimation);
  init();
  requestAnimationFrame(gameLoop);
});

const fenceWidth = 2;
function drawFence(side, bricksHigh) {
  ctx.fillStyle = "red";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (side == "left") {
    sidePositionX = canvas.width * 0.4;
  } else {
    sidePositionX = canvas.width * 0.6;
    flipper = -1;
  }

  let fenceStartY = grassStart;

  for (let layersY = 1; layersY < bricksHigh; layersY++) {
    for (let layersX = 1; layersX <= fenceWidth; layersX++) {
      drawBrick(
        sidePositionX + layersX * brickWidth * flipper,
        fenceStartY - brickHeight * layersY,
        brickWidth,
        brickHeight,
        true,
      );
      //ctx.strokeRect(sidePosition, (castleStart) - brickHeight - layersY, layersX - brickWidth, brickHeight);
    }
  }
}

function DrawGame(typeOfGame) {
  if (typeOfGame === GAMESTATE.SINGLE_PLAYER) {
    drawBackground();
    drawClouds();
    player1.draw();
    player2.draw();
  }
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

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  init();
  globalDeck = createDefaultDeck();
  shuffleDeck(globalDeck);
  gameLoop();
  // }
};

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function getCardFromDeck(player) {
  player.hand.push(globalDeck.pop());
}

function startingHand(player) {
  for (let i = 0; i < handAmount; i++) {
    getCardFromDeck(player);
  }
}

class Stat {
  constructor(category, name1, amount1, name2, amount2) {
    this.category = category;
    this.name1 = name1;
    this.amount1 = amount1;
    this.name2 = name2;
    this.amount2 = amount2;
  }
}

class PlayerStats {
  constructor(side) {
    // this.stats = [];
    this.side = side;
    // brick
    this.builders = {
      name: "Builders",
      amount: 2,
    };
    this.bricks = {
      name: "Bricks",
      amount: 5,
    };
    // weapons;
    this.soldiers = {
      name: "Soldiers",
      amount: 2,
    };
    this.weapons = {
      name: "Weapons",
      amount: 5,
    };
    // crystal
    this.magic = {
      name: "Magic",
      amount: 2,
    };
    this.crystals = {
      name: "Crystals",
      amount: 5,
    };
    //castle
    this.castle = {
      name: "Castle",
      amount: 30,
    };
    this.fence = {
      name: "Fence",
      amount: 10,
    };
    this.statRectWidth = 50;
    this.statRectHeight = 50;
  }
  draw() {
    let positionX;
    if (this.side == "left") {
      positionX = canvas.width * 0.1;
    } else {
      positionX = canvas.width * 0.9;
    }
    let positionY = canvas.height;
    for (let playerStatRect = 1; playerStatRect <= 4; playerStatRect++) {
      positionY = canvas.height * (playerStatRect / 10);
      switch (playerStatRect) {
        case 1:
          this.drawStat(
            positionX,
            positionY,
            this.builders,
            this.bricks,
            "red",
          );
          break;
        case 2:
          this.drawStat(
            positionX,
            positionY,
            this.soldiers,
            this.weapons,
            "green",
          );
          break;
        case 3:
          this.drawStat(
            positionX,
            positionY,
            this.magic,
            this.crystals,
            "blue",
          );
          break;
        case 4:
          this.drawStat(positionX, positionY, this.castle, this.fence, "grey");
          break;
        default:
          break;
      }
    }
  }
  drawStat(x, y, stat1, stat2, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.statRectWidth, this.statRectHeight);

    ctx.fillStyle = "#000000ff";
    ctx.font = "20px Times New Roman";
    ctx.fillText(stat1.name + " " + stat1.amount, x, y);
    ctx.fillText(stat2.name + " " + stat2.amount, x, y + 20);
  }
}

// PLAYER START
class Player {
  // 'left'
  // 'human' | 'cpu'
  constructor(side, kind, number, color) {
    this.side = side;
    this.kind = kind;
    this.number = number;
    this.color = color;
    this.hand = [];
    this.playerStats = new PlayerStats(this.side);
  }
  draw() {
    DrawCastle(this.color, this.playerStats.castle.amount, this.side);
    drawFence(this.side, this.playerStats.fence.amount);
    this.playerStats.draw();
    if (
      (actualGameState === ACTUAL_GAMESTATE.PLAYER_1_TURN &&
        this.number === 1) ||
      (actualGameState === ACTUAL_GAMESTATE.PLAYER_2_TURN && this.number === 2)
    ) {
      if (this.kind === "player") {
      } else if (this.kind === "cpu") {
        // drawCardsFaceDown
      }
      // drawCardsFaceUp
      // console.log(this.hand);
    }
  }
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
  DrawCastle("blue", 50, "left");
  DrawCastle("red", 50, "right");
  drawCards();
}

function drawCards() {
  //
}

function createDefaultDeck() {
  let defaultDeck = [];

  addBricksCards(defaultDeck);
  addWeaponsCards(defaultDeck);
  return defaultDeck;
}

function addWeaponsCards(defaultDeck) {
  const archerCards = 3;
  for (let i = 0; i < archerCards; i++) {
    defaultDeck.push(
      new Card("Archer", { weapons: -1 }, { enemy: [{ health: -2 }] }),
    );
  }
  const knightCards = 3;
  for (let i = 0; i < knightCards; i++) {
    defaultDeck.push(
      new Card("Knight", { weapons: -1 }, { enemy: [{ health: -3 }] }),
    );
  }
  const riderCards = 3;
  for (let i = 0; i < riderCards; i++) {
    defaultDeck.push(
      new Card("Rider", { weapons: -2 }, { enemy: [{ health: -4 }] }),
    );
  }
  const platoonCards = 3;
  for (let i = 0; i < platoonCards; i++) {
    defaultDeck.push(
      new Card("Platoon", { weapons: -4 }, { enemy: [{ health: -6 }] }),
    );
  }
  const recruitCards = 3;
  for (let i = 0; i < recruitCards; i++) {
    defaultDeck.push(
      new Card("Recruit", { weapons: -8 }, { self: [{ soldiers: 1 }] }),
    );
  }
  const attackCards = 2;
  for (let i = 0; i < attackCards; i++) {
    defaultDeck.push(
      new Card("Attack", { weapons: -10 }, { enemy: [{ health: -12 }] }),
    );
  }
  const saboteurCards = 2;
  for (let i = 0; i < saboteurCards; i++) {
    defaultDeck.push(
      new Card(
        "Saboteur",
        { weapons: -12 },
        { enemy: [{ bricks: -4 }, { crystals: -4 }, { weapons: -4 }] },
      ),
    );
  }
  const thiefCards = 2;
  for (let i = 0; i < thiefCards; i++) {
    defaultDeck.push(
      new Card(
        "Thief",
        { weapons: -15 },
        {
          self: [{ bricks: 5 }, { crystals: 5 }, { weapons: 5 }],
          enemy: [{ bricks: -5 }, { crystals: -5 }, { weapons: -5 }],
        },
      ),
    );
  }
  const swatCards = 2;
  for (let i = 0; i < swatCards; i++) {
    defaultDeck.push(
      new Card(
        "Swat",
        { weapons: -18 },
        {
          enemy: [{ castle: -10 }],
        },
      ),
    );
  }
  const bansheeCards = 2;
  for (let i = 0; i < bansheeCards; i++) {
    defaultDeck.push(
      new Card(
        "Banshee",
        { weapons: -28 },
        {
          enemy: [{ health: -32 }],
        },
      ),
    );
  }
}

function addBricksCards(defaultDeck) {
  const wallCards = 3;
  for (let i = 0; i < wallCards; i++) {
    defaultDeck.push(
      new Card("Wall", { bricks: -1 }, { self: [{ fence: 3 }] }),
    );
  }
  const baseCards = 3;
  for (let i = 0; i < baseCards; i++) {
    defaultDeck.push(
      new Card("Base", { bricks: -1 }, { self: [{ castle: 2 }] }),
    );
  }
  const defenceCards = 3;
  for (let i = 0; i < defenceCards; i++) {
    defaultDeck.push(
      new Card("Defence", { bricks: -3 }, { self: [{ fence: 6 }] }),
    );
  }
  const reserveCards = 3;
  for (let i = 0; i < reserveCards; i++) {
    defaultDeck.push(
      new Card(
        "Reserve",
        { bricks: -3 },
        { self: [{ fence: -4 }, { castle: 8 }] },
      ),
    );
  }
  const towerCards = 3;
  for (let i = 0; i < towerCards; i++) {
    defaultDeck.push(
      new Card("Tower", { bricks: -6 }, { self: [{ castle: 5 }] }),
    );
  }
  const schoolCards = 3;
  for (let i = 0; i < schoolCards; i++) {
    defaultDeck.push(
      new Card("School", { bricks: -8 }, { self: [{ builders: 1 }] }),
    );
  }
  const wainCards = 2;
  for (let i = 0; i < wainCards; i++) {
    defaultDeck.push(
      new Card(
        "Wain",
        { bricks: -10 },
        { self: [{ castle: 8 }], enemy: [{ castle: -4 }] },
      ),
    );
  }
  const fenceCards = 2;
  for (let i = 0; i < fenceCards; i++) {
    defaultDeck.push(
      new Card("Fence", { bricks: -12 }, { self: [{ fence: 22 }] }),
    );
  }
  const fortCards = 2;
  for (let i = 0; i < fortCards; i++) {
    defaultDeck.push(
      new Card("Fort", { bricks: -18 }, { self: [{ castle: 20 }] }),
    );
  }
  const babylonCards = 2;
  for (let i = 0; i < babylonCards; i++) {
    defaultDeck.push(
      new Card("Babylon", { bricks: -39 }, { self: [{ castle: 32 }] }),
    );
  }
}

class Card {
  // "Wain"
  // {bricks: -10}
  // {self: [{castle: 8}], enemy: [{castle: -4}]}
  constructor(name, cost, effect) {
    this.name = name;
    this.cost = cost;
    this.effect = effect;
  }

  draw() {}
}

// DECK END
