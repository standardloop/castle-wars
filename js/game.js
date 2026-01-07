// DEF GLOBAL START
const GAMESTATE = Object.freeze({
  MENU: 0,
  SINGLE_PLAYER: 1,
  TWO_PLAYER: 2,
  CARD_DECK: 3,
  INSTRUCTIONS: 4,
  CREDITS: 5,
  PAUSE: 6,
  GAME_OVER_SCREEN: 7,
});

const ACTUAL_GAMESTATE = Object.freeze({
  PLAYER_1_TURN: 1,
  PLAYER_2_TURN: 2,
  PLAYER_1_WIN: 3,
  PLAYER_2_WIN: 4,
});

let canvas;
let ctx;
let dpr;

const handAmount = 8;
let grassStart;

const castleSizeToWin = 100;

let currAnimation;
let gameState = GAMESTATE.MENU;
let actualGameState = ACTUAL_GAMESTATE.PLAYER_1_TURN;
let isRunning = true;

let player1;
let player2;
// let lastTime = 0;

// DEF GLOBAL END

function DrawMenu() {
  //console.log("DrawMenu")
  isRunning = true;
  drawBackground();
  drawClouds();
  DrawTitle();
  DrawCastle("blue", 50, "left");
  DrawCastle("red", 50, "right");
  DrawMenuButtons();
}

const brickWidth = 225 / 25;
const brickHeight = 75 / 25;

const castleWidth = 10;

function DrawTitle() {
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
          case "Instructions":
            //gameState = GAMESTATE.INSTRUCTIONS;
            alert(`Not yet implemented`);
            break;
          case "Credits":
            //gameState = GAMESTATE.CREDITS;
            alert(`Not yet implemented`);
            break;
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

  if (checkIfPlayerWon()) {
    return;
  } else {
    let cardDup = card;
    removeCardFromHand(player, card);
    addCardToGlobalDeck(cardDup);
    resourceMakersMakeResources(player);
    switchTurns();
  }
}

function checkIfPlayerWon() {
  let player;
  let enemy;
  if (actualGameState === ACTUAL_GAMESTATE.PLAYER_1_TURN) {
    player = player1;
    enemy = player2;
  } else if (actualGameState === ACTUAL_GAMESTATE.PLAYER_2_TURN) {
    player = player2;
    enemy = player1;
  }
  if (
    player.number === 1 &&
    enemy.number === 2 &&
    (enemy.stats["Castle"] <= 0 || player.stats["Castle"] >= castleSizeToWin)
  ) {
    actualGameState = ACTUAL_GAMESTATE.PLAYER_1_WIN;
    //alert("Player 1 wins!!!"); // FIXME, alert is before seeing tower at 100
  } else if (
    player.number === 2 &&
    enemy.number === 1 &&
    (enemy.stats["Castle"] <= 0 || player.stats["Castle"] >= castleSizeToWin)
  ) {
    actualGameState = ACTUAL_GAMESTATE.PLAYER_2_WIN;
    //alert("Player 2 wins!!!");
  }
  return (
    actualGameState === ACTUAL_GAMESTATE.PLAYER_1_WIN ||
    actualGameState === ACTUAL_GAMESTATE.PLAYER_2_WIN
  );
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

function canPlayerPlayCard(stats, card) {
  if (stats[card.cost.resource] < card.cost.amount) {
    return false;
  } else {
    return true;
  }
}

// BUTTON END

// TODO, handle pixel scaling and blurry text

function DrawGame() {
  if (
    gameState === GAMESTATE.SINGLE_PLAYER ||
    gameState === GAMESTATE.TWO_PLAYER
  ) {
    drawBackground();
    drawClouds();
    drawWhoIsPlaying();
    player1.draw();
    player2.draw();
  }
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

function initGame() {
  actualGameState = ACTUAL_GAMESTATE.PLAYER_1_TURN;
  gameState = GAMESTATE.MENU;
  globalDeck = createDefaultDeck();
  shuffleDeck(globalDeck);
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
      DrawGame();
      if (
        actualGameState === ACTUAL_GAMESTATE.PLAYER_1_WIN ||
        actualGameState === ACTUAL_GAMESTATE.PLAYER_2_WIN
      ) {
        alert("game over!");
        initGame();
        initCanvas();
        //gameState = GAMESTATE.GAME_OVER_SCREEN;
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
  initGame();
  initCanvas();
  gameLoop();
};

function getCardFromDeck(player) {
  player.hand.push(globalDeck.pop());
}

function startingHand(player) {
  for (let i = 0; i < handAmount; i++) {
    getCardFromDeck(player);
  }
}

function DrawCardDeck() {
  drawBackground();
  drawClouds();
  DrawCastle("blue", 50, "left");
  DrawCastle("red", 50, "right");
  drawCards();
}
