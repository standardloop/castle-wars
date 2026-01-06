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

const castleSizeToWin = 100;

let currAnimation;
let gameState = GAMESTATE.MENU;
let actualGameState = ACTUAL_GAMESTATE.PLAYER_1_TURN;
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
  DrawCastle("blue", 50, "left");
  DrawCastle("red", 50, "right");
  DrawMenuButtons();
}

// CLOUDS START
function initClouds() {
  for (let i = 0; i < numOfClouds; i++) {
    const x = Math.random() * getCanvasWidth();
    const y = Math.random() * getCanvasHeight() * 0.5; // upper half
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
      this.y = Math.random() * getCanvasHeight() * 0.5;
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

function DrawCastle(color, bricksHigh, side) {
  // console.log("DrawCastle")
  ctx.fillStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (side == "left") {
    sidePositionX = getCanvasWidth() * 0.2;
  } else {
    sidePositionX = getCanvasWidth() * 0.8;
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

  const x = getCanvasWidth() * 0.5;
  const y = getCanvasHeight() * 0.2;

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
  let x = getCanvasWidth() * 0.5 - 60;
  let y = getCanvasHeight() * (0.32 + 0.1 * buttonIndex) - 25;

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

addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (gameState === GAMESTATE.MENU) {
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
          case "Two Player":
            gameState = GAMESTATE.TWO_PLAYER;
            player1 = new Player("left", "human", 1, "blue");
            startingHand(player1);
            player2 = new Player("right", "human", 2, "red");
            startingHand(player2);
            break;
          // TODO
          case "Card Deck":
            gameState = GAMESTATE.CARD_DECK;
          default:
            break;
        }
        isRunning = false;
      }
    });
  } else if (
    gameState === GAMESTATE.SINGLE_PLAYER ||
    gameState === GAMESTATE.TWO_PLAYER
  ) {
    // check all cards
    if (actualGameState === ACTUAL_GAMESTATE.PLAYER_1_TURN) {
      player1.hand.forEach((card) => {
        if (card.inBounds(mouseX, mouseY)) {
          if (event.shiftKey) {
            let cardDup = card;
            removeCardFromHand(player1, card);
            addCardToGlobalDeck(cardDup);
            console.log(`Player 1 discarded ${card.name}!`);
            resourceMakersMakeResources(player1);
            switchTurns();
          } else {
            if (canPlayerPlayCard(player1.stats, card)) {
              playCard(card);
            } else {
              alert(
                `Clicked ${card.name}, but card cannot be played, hold "Shift" and then click to discard!`,
              );
            }
          }
        }
      });
    } else if (
      actualGameState === ACTUAL_GAMESTATE.PLAYER_2_TURN &&
      player2.kind === "human"
    ) {
      player2.hand.forEach((card) => {
        if (card.inBounds(mouseX, mouseY)) {
          if (event.shiftKey) {
            let cardDup = card;
            removeCardFromHand(player2, card);
            addCardToGlobalDeck(cardDup);
            console.log(`Player 2 discarded ${card.name}!`);
            resourceMakersMakeResources(player2);
            switchTurns();
          } else {
            if (canPlayerPlayCard(player2.stats, card)) {
              playCard(card);
            } else {
              alert(
                `Clicked ${card.name}, but card cannot be played, hold "Shift" and then click to discard!`,
              );
            }
          }
        }
      });
    }
  }
});

// FIXME, magic and hardcoded for now
function cardXPosToIndex(card) {
  if (card.x === null) {
    alert("CRASH");
    return null;
  } else if (card.x === 0) {
    return 0;
  }
  const cardPadding = 5;
  return card.x / (card.rectWidth + cardPadding);
}

function playCard(card) {
  let player;
  let enemy;
  if (actualGameState === ACTUAL_GAMESTATE.PLAYER_1_TURN) {
    player = player1;
    enemy = player2;
  } else if (actualGameState === ACTUAL_GAMESTATE.PLAYER_2_TURN) {
    player = player2;
    enemy = player1;
  }
  console.log(`Player ${player.number} played card ${card.name}`);
  card.effect.self.forEach((effect) => {
    player.stats[effect.resource] += effect.amount;
    // cover case with Reserve card, in future, make this a gamesetting.
    if (player.stats["Fence"] < 0) {
      player.stats["Fence"] = 0;
    }
  });

  card.effect.enemy.forEach((effect) => {
    if (effect.resource === "Health") {
      if (enemy.stats["Fence"] >= effect.amount) {
        enemy.stats["Fence"] -= effect.amount;
      } else {
        enemy.stats["Fence"] -= effect.amount;
        enemy.stats["Castle"] += enemy.stats["Fence"];
        enemy.stats["Fence"] = 0;
      }
    } else {
      enemy.stats[effect.resource] -= effect.amount;
      if (enemy.stats[effect.resource] < 0) {
        enemy.stats[effect.resource] = 0;
      }
    }
  });

  // Thief and Curse cards
  card.effect.transfer.forEach((effect) => {
    let amountSupposedToDeduct = effect.amount;
    if (enemy.stats[effect.resource] < amountSupposedToDeduct) {
      amountSupposedToDeduct = enemy.stats[effect.resource];
      enemy.stats[effect.resource] = 0;
    } else {
      enemy.stats[effect.resource] -= effect.amount;
      player.stats[effect.resource] += effect.amount;
    }
  });

  player.stats[card.cost.resource] -= card.cost.amount;
  if (
    player.number === 1 &&
    enemy.number === 2 &&
    (enemy.stats["Castle"] <= 0 || player.stats["Castle"] >= castleSizeToWin)
  ) {
    actualGameState = ACTUAL_GAMESTATE.PLAYER_1_WIN;
    alert("Player 1 wins!!!"); // FIXME, alert is before seeing tower at 100
  } else if (
    player.number === 2 &&
    enemy.number === 1 &&
    (enemy.stats["Castle"] <= 0 || player.stats["Castle"] >= castleSizeToWin)
  ) {
    actualGameState = ACTUAL_GAMESTATE.PLAYER_2_WIN;
    alert("Player 2 wins!!!");
  }

  let cardDup = card;
  removeCardFromHand(player, card);
  addCardToGlobalDeck(cardDup);
  resourceMakersMakeResources(player);
  switchTurns();
}

// FIXME so dirty
function removeCardFromHand(player, card) {
  let index = cardXPosToIndex(card);
  shuffleDeck(globalDeck);
  player.hand[index] = globalDeck.pop();
}

function addCardToGlobalDeck(card) {
  card.x = null;
  card.y = null;
  globalDeck.push(card);
}

function switchTurns() {
  if (actualGameState === ACTUAL_GAMESTATE.PLAYER_1_TURN) {
    actualGameState = ACTUAL_GAMESTATE.PLAYER_2_TURN;
  } else if (actualGameState === ACTUAL_GAMESTATE.PLAYER_2_TURN) {
    actualGameState = ACTUAL_GAMESTATE.PLAYER_1_TURN;
  }
}

function resourceMakersMakeResources(player) {
  player.stats["Bricks"] += player.stats["Builders"];
  player.stats["Weapons"] += player.stats["Soldiers"];
  player.stats["Crystals"] += player.stats["Magic"];
}

// maybe we should pass playerHand here lol;
function canPlayerPlayCard(stats, card) {
  // let player;

  // if (actualGameState === ACTUAL_GAMESTATE.PLAYER_1_TURN) {
  //   player = player1;
  // } else if (actualGameState === ACTUAL_GAMESTATE.PLAYER_2_TURN) {
  //   player = player2;
  // }
  // WIP
  if (stats[card.cost.resource] < card.cost.amount) {
    return false;
  } else {
    return true;
  }
}

// BUTTON END

// TODO, handle pixel scaling and blurry text
function setupHighDPICanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
}

function init() {
  // const bound = canvas.getBoundingClientRect();
  // canvas.width = bound.width;
  // canvas.height = bound.height;
  setupHighDPICanvas();
  clearClouds();
  clearMenuButtons();
  initClouds();
  grassStart = getCanvasHeight() / 1.3;
  // if (gameState == GAMESTATE.MENU) {

  // }
  //createClouds(canvas);
}

window.addEventListener("resize", function () {
  cancelAnimationFrame(currAnimation);
  init();
  requestAnimationFrame(gameLoop);
});

function drawFence(side, bricksHigh) {
  const fenceWidth = 2;
  ctx.fillStyle = "red";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (side == "left") {
    sidePositionX = getCanvasWidth() * 0.4;
  } else {
    sidePositionX = getCanvasWidth() * 0.6;
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
  if (
    typeOfGame === GAMESTATE.SINGLE_PLAYER ||
    typeOfGame === GAMESTATE.TWO_PLAYER
  ) {
    drawBackground();
    drawClouds();
    drawWhoIsPlaying();
    player1.draw();
    player2.draw();
  }
}

function getCanvasHeight() {
  return canvas.height / 2;
}

function getCanvasWidth() {
  return canvas.width / 2;
}

function drawWhoIsPlaying() {
  let playerText;
  if (actualGameState === ACTUAL_GAMESTATE.PLAYER_1_TURN) {
    playerText = "Player 1";
  } else if (actualGameState === ACTUAL_GAMESTATE.PLAYER_2_TURN) {
    // fixme switch to enum
    if (player2.kind === "human") {
      playerText = "Player 2";
    } else if (player2.kind === "cpu") {
      playerText = "CPU";
    }

    // FIXME add support for CPU ?;
  }

  ctx.fillStyle = "#000000ff";
  ctx.font = "40px Times New Roman";
  let textX = getCanvasWidth() / 2;
  let textY = getCanvasHeight() / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(playerText, textX, textY);
}

function gameLoop() {
  // const deltaTime = timeStamp - lastTime;
  // lastTime = timeStamp;
  ctx.clearRect(0, 0, getCanvasWidth(), getCanvasHeight());
  switch (gameState) {
    case GAMESTATE.MENU:
      DrawMenu();
      break;
    // single player and two player are same except for cpu choosing turns.
    case GAMESTATE.TWO_PLAYER:
    case GAMESTATE.SINGLE_PLAYER:
      DrawGame(gameState);
      if (
        actualGameState === ACTUAL_GAMESTATE.PLAYER_1_WIN ||
        actualGameState === ACTUAL_GAMESTATE.PLAYER_2_WIN
      ) {
        // FIXME, switch to INIT
        actualGameState = ACTUAL_GAMESTATE.PLAYER_1_TURN;
        gameState = GAMESTATE.MENU;
        init();
        globalDeck = createDefaultDeck();
        shuffleDeck(globalDeck);
      }
      if (
        gameState === GAMESTATE.SINGLE_PLAYER &&
        actualGameState === ACTUAL_GAMESTATE.PLAYER_2_TURN &&
        player2.kind === "cpu"
      ) {
        // play for CPU
        cpuPlay();
      }
      break;
    case GAMESTATE.CARD_DECK:
      DrawCardDeck();
      break;
    default:
      break;
  }
  currAnimation = requestAnimationFrame(gameLoop);
}

// trivial cpu
// selects a card at random, if can play, play, if can't then discard
function cpuPlay() {
  let randomIndexToPlay = Math.floor(Math.random() * 8);
  let card = player2.hand[randomIndexToPlay];
  if (canPlayerPlayCard(player2.stats, card)) {
    playCard(card);
  } else {
    let cardDup = card;
    removeCardFromHand(player2, card);
    addCardToGlobalDeck(cardDup);
    console.log(`cpu discarded ${card.name}!`);
    resourceMakersMakeResources(player2);
    switchTurns();
  }
}

window.onload = () => {
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
    this.stats = {
      Builders: 2,
      Bricks: 5,
      Soldiers: 2,
      Weapons: 5,
      Magic: 2,
      Crystals: 5,
      Castle: 30,
      Fence: 10,
    };
    this.statRectWidth = 50;
    this.statRectHeight = 50;
  }
  draw() {
    DrawCastle(this.color, this.stats["Castle"], this.side);
    drawFence(this.side, this.stats["Fence"]);
    this.drawPlayerStats();
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
      let cardStart = 0;
      for (let card = 0; card < this.hand.length; card++) {
        let cardCanBePlayedBool = canPlayerPlayCard(
          this.stats,
          this.hand[card],
        );
        this.hand[card].draw(cardStart, cardCanBePlayedBool);
        cardStart += this.hand[card].rectWidth + 5; // FIXME card padding;
      }
    }
  }
  drawPlayerStats() {
    let positionX;
    if (this.side == "left") {
      positionX = getCanvasWidth() * 0.1;
    } else {
      positionX = getCanvasWidth() * 0.9;
    }
    let positionY = getCanvasHeight();
    for (let playerStatRect = 1; playerStatRect <= 4; playerStatRect++) {
      positionY = getCanvasHeight() * (playerStatRect / 10);
      switch (playerStatRect) {
        case 1:
          this.drawStat(
            positionX,
            positionY,
            { name: "Builders", amount: this.stats["Builders"] },
            { name: "Bricks", amount: this.stats["Bricks"] },
            "red",
          );
          break;
        case 2:
          this.drawStat(
            positionX,
            positionY,
            { name: "Soldiers", amount: this.stats["Soldiers"] },
            { name: "Weapons", amount: this.stats["Weapons"] },
            "green",
          );
          break;
        case 3:
          this.drawStat(
            positionX,
            positionY,
            { name: "Magic", amount: this.stats["Magic"] },
            { name: "Crystals", amount: this.stats["Crystals"] },
            "blue",
          );
          break;
        case 4:
          this.drawStat(
            positionX,
            positionY,
            { name: "Castle", amount: this.stats["Castle"] },
            { name: "Fence", amount: this.stats["Fence"] },
            "grey",
          );
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

function createDefaultDeck() {
  let defaultDeck = [];

  addBricksCards(defaultDeck);
  addWeaponsCards(defaultDeck);
  addCrystalsCards(defaultDeck);

  shuffleDeck(defaultDeck);

  return defaultDeck;
}

function addBricksCards(defaultDeck) {
  const cardType = CARD_TYPES.BRICKS;
  const resourceName = "Bricks";
  const wallCards = 3;
  for (let i = 0; i < wallCards; i++) {
    defaultDeck.push(
      new Card(
        "Wall",
        { resource: resourceName, amount: 1 },
        {
          self: [{ resource: "Fence", amount: 3 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const baseCards = 3;
  for (let i = 0; i < baseCards; i++) {
    defaultDeck.push(
      new Card(
        "Base",
        { resource: resourceName, amount: 1 },
        {
          self: [{ resource: "Castle", amount: 2 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const defenceCards = 3;
  for (let i = 0; i < defenceCards; i++) {
    defaultDeck.push(
      new Card(
        "Defence",
        { resource: resourceName, amount: 3 },
        {
          self: [{ resource: "Fence", amount: 6 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const reserveCards = 3;
  for (let i = 0; i < reserveCards; i++) {
    defaultDeck.push(
      new Card(
        "Reserve",
        { resource: resourceName, amount: 3 },
        {
          self: [
            { resource: "Fence", amount: -4 },
            { resource: "Castle", amount: 8 },
          ],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const towerCards = 3;
  for (let i = 0; i < towerCards; i++) {
    defaultDeck.push(
      new Card(
        "Tower",
        { resource: resourceName, amount: 6 },
        {
          self: [{ resource: "Castle", amount: 5 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const schoolCards = 3;
  for (let i = 0; i < schoolCards; i++) {
    defaultDeck.push(
      new Card(
        "School",
        { resource: resourceName, amount: 8 },
        {
          self: [{ resource: "Builders", amount: 1 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const wainCards = 2;
  for (let i = 0; i < wainCards; i++) {
    defaultDeck.push(
      new Card(
        "Wain",
        { resource: resourceName, amount: 10 },
        {
          self: [{ resource: "Castle", amount: 8 }],
          enemy: [{ resource: "Castle", amount: 4 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const fenceCards = 2;
  for (let i = 0; i < fenceCards; i++) {
    defaultDeck.push(
      new Card(
        "Fence",
        { resource: resourceName, amount: 12 },
        {
          self: [{ resource: "Fence", amount: 22 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const fortCards = 2;
  for (let i = 0; i < fortCards; i++) {
    defaultDeck.push(
      new Card(
        "Fort",
        { resource: resourceName, amount: 18 },
        {
          self: [{ resource: "Castle", amount: 20 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const babylonCards = 2;
  for (let i = 0; i < babylonCards; i++) {
    defaultDeck.push(
      new Card(
        "Babylon",
        { resource: resourceName, amount: 39 },
        {
          self: [{ resource: "Castle", amount: 32 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
}

function addWeaponsCards(defaultDeck) {
  const cardType = CARD_TYPES.WEAPONS;
  const resourceName = "Weapons";
  const archerCards = 3;
  for (let i = 0; i < archerCards; i++) {
    defaultDeck.push(
      new Card(
        "Archer",
        { resource: resourceName, amount: 1 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 2 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const knightCards = 3;
  for (let i = 0; i < knightCards; i++) {
    defaultDeck.push(
      new Card(
        "Knight",
        { resource: resourceName, amount: 1 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 3 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const riderCards = 3;
  for (let i = 0; i < riderCards; i++) {
    defaultDeck.push(
      new Card(
        "Rider",
        { resource: resourceName, amount: 2 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 4 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const platoonCards = 3;
  for (let i = 0; i < platoonCards; i++) {
    defaultDeck.push(
      new Card(
        "Platoon",
        { resource: resourceName, amount: 4 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 6 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const recruitCards = 3;
  for (let i = 0; i < recruitCards; i++) {
    defaultDeck.push(
      new Card(
        "Recruit",
        { resource: resourceName, amount: 8 },
        {
          self: [{ resource: "Soldiers", amount: 1 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const attackCards = 2;
  for (let i = 0; i < attackCards; i++) {
    defaultDeck.push(
      new Card(
        "Attack",
        { resource: resourceName, amount: 10 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 12 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const saboteurCards = 2;
  for (let i = 0; i < saboteurCards; i++) {
    defaultDeck.push(
      new Card(
        "Saboteur",
        { resource: resourceName, amount: 12 },
        {
          self: [],
          enemy: [
            { resource: "Bricks", amount: 4 },
            { resource: "Crystals", amount: 4 },
            { resoucre: "Weapons", amount: 4 },
          ],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const thiefCards = 2;
  for (let i = 0; i < thiefCards; i++) {
    defaultDeck.push(
      new Card(
        "Thief",
        { resource: resourceName, amount: 15 },
        {
          self: [],
          enemy: [],
          transfer: [
            { resource: "Bricks", amount: 5 },
            { resource: "Crystals", amount: 5 },
            { resource: "Weapons", amount: 5 },
          ],
        },
        cardType,
      ),
    );
  }
  const swatCards = 2;
  for (let i = 0; i < swatCards; i++) {
    defaultDeck.push(
      new Card(
        "Swat",
        { resource: resourceName, amount: 18 },
        {
          self: [],
          enemy: [{ resource: "Castle", amount: 10 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const bansheeCards = 2;
  for (let i = 0; i < bansheeCards; i++) {
    defaultDeck.push(
      new Card(
        "Banshee",
        { resource: resourceName, amount: 28 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 32 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
}

function addCrystalsCards(defaultDeck) {
  const cardType = CARD_TYPES.CRYSTALS;
  const resourceName = "Crystals";
  const conjureBricksCards = 3;
  for (let i = 0; i < conjureBricksCards; i++) {
    defaultDeck.push(
      new Card(
        "Conjure bricks",
        { resource: resourceName, amount: 4 },
        {
          self: [{ resource: "Bricks", amount: 8 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const conjureCrystalsCards = 3;
  for (let i = 0; i < conjureCrystalsCards; i++) {
    defaultDeck.push(
      new Card(
        "Conjure crystals",
        { resource: resourceName, amount: 4 },
        {
          self: [{ resource: "Crystals", amount: 8 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const conjureWeaponsCards = 3;
  for (let i = 0; i < conjureWeaponsCards; i++) {
    defaultDeck.push(
      new Card(
        "Conjure weapons",
        { resource: resourceName, amount: 4 },
        {
          self: [{ resource: "Weapons", amount: 8 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const crushBricksCards = 3;
  for (let i = 0; i < crushBricksCards; i++) {
    defaultDeck.push(
      new Card(
        "Crush bricks",
        { resource: resourceName, amount: 4 },
        {
          self: [],
          enemy: [{ resource: "Bricks", amount: 8 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const crushCrystalsCards = 3;
  for (let i = 0; i < crushCrystalsCards; i++) {
    defaultDeck.push(
      new Card(
        "Crush crystals",
        { resource: resourceName, amount: 4 },
        {
          self: [],
          enemy: [{ resource: "Crystals", amount: 8 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const crushWeaponsCards = 3;
  for (let i = 0; i < crushWeaponsCards; i++) {
    defaultDeck.push(
      new Card(
        "Crush weapons",
        { resource: resourceName, amount: 4 },
        {
          self: [],
          enemy: [{ resource: "Weapons", amount: 8 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const sorcererCards = 3;
  for (let i = 0; i < sorcererCards; i++) {
    defaultDeck.push(
      new Card(
        "Sorcerer",
        { resource: resourceName, amount: 8 },
        {
          self: [{ resource: "Magic", amount: 1 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const dragonCards = 2;
  for (let i = 0; i < dragonCards; i++) {
    defaultDeck.push(
      new Card(
        "Dragon",
        { resource: resourceName, amount: 21 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 25 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const pixiesCards = 2;
  for (let i = 0; i < pixiesCards; i++) {
    defaultDeck.push(
      new Card(
        "Pixies",
        { resource: resourceName, amount: 22 },
        {
          self: [{ resource: "Castle", amount: 22 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const curseCard = 2;
  for (let i = 0; i < curseCard; i++) {
    defaultDeck.push(
      new Card(
        "Curse",
        { resource: resourceName, amount: 45 },
        {
          self: [],
          enemy: [],
          transfer: [
            { resource: "Builders", amount: 1 },
            { resource: "Bricks", amount: 1 },
            { resource: "Soldiers", amount: 1 },
            { resource: "Weapons", amount: 1 },
            { resource: "Crystals", amount: 1 },
            { resource: "Magic", amount: 1 },
            { resource: "Castle", amount: 1 },
            { resource: "Fence", amount: 1 },
          ],
        },
        cardType,
      ),
    );
  }
}

const CARD_TYPES = Object.freeze({
  BRICKS: 0,
  WEAPONS: 1,
  CRYSTALS: 2,
});

class Card {
  // "Wain"
  // {resource: "Bricks", amount:10}
  // {self: [{castle: 8}], enemy: [{castle: 4}]}
  constructor(name, cost, effect, kind) {
    this.name = name;
    this.cost = cost;
    this.effect = effect;
    this.kind = kind;
    this.rectWidth = 5 * 10;
    this.rectHeight = 7 * 10;

    this.x;
    this.y;
  }

  // canPlay is bool
  draw(x, canPlay) {
    let color;
    switch (this.kind) {
      case CARD_TYPES.BRICKS:
        color = "red";
        break;
      case CARD_TYPES.WEAPONS:
        color = "green";
        break;
      case CARD_TYPES.CRYSTALS:
        color = "blue";
        break;
      default:
        color = "grey";
        break;
    }
    if (!canPlay) {
      color = "grey";
    }

    const y = grassStart;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.rectWidth, this.rectHeight);

    ctx.fillStyle = "#000000ff";
    ctx.font = "10px Times New Roman";
    let textY = y + this.rectHeight / 2;
    let textX = x + this.rectWidth / 2;
    const spaceChar = " ";
    if (this.name.includes(spaceChar)) {
      let allWordsInName = this.name.split(spaceChar);
      for (let i = 0; i < allWordsInName.length; i++) {
        ctx.fillText(allWordsInName[i], textX, textY + i * 10);
      }
    } else {
      ctx.fillText(this.name, textX, textY);
    }
    this.x = x;
    this.y = y;
  }
  inBounds(mouseX, mouseY) {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.rectWidth &&
      mouseY > this.y &&
      mouseY < this.y + this.rectHeight
    );
  }
}

// DECK END
