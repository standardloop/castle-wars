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
let currAnimation;
let gameState = GAMESTATE.MENU;
let isRunning = true;
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
function createClouds() {
  for (let i = 0; i < numOfClouds; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.4; // upper half
    const speed = (Math.random() * 1) * 0.3;
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
            this.y = Math.random() * canvas.height * 0.6;
            this.speed = (Math.random() * 1) * 0.3;
        }
    }
}

// CLOUDS END

// CASTLE START

const brickHeight = 100;
const brickWidth = 10;

// todo
function drawBrick(color, size, location) {

}

// fixme
function DrawCastle(color, bricksHigh, side) {

  ctx.fillStyle = color
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let sidePosition;
  if (side == "left") {
      sidePosition = canvas.width * 0.20;
  } else {
      sidePosition = canvas.width * 0.70
  }

  let castleStart = canvas.height / 1.3;

  for (let layersY = 0; layersY < bricksHigh; layersY++) {
    for (let layersX = 0; layersX < 100; layersX++) {
      ctx.fillRect(sidePosition, (castleStart) - brickHeight - layersY, layersX - brickWidth, brickHeight);
      //ctx.strokeRect(sidePosition, (castleStart) - brickHeight - layersY, layersX - brickWidth, brickHeight);
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
  ctx.fillRect(0, 0, canvas.width, canvas.height / 1.3);
  ctx.fillStyle = '#009900'; 
  ctx.fillRect(0, canvas.height / 1.3, canvas.width, canvas.height / 2);

  // drawBorder();
}

// BUTTON START
let menuButtons = [];

class Button {
    constructor(text, x, y, width, height) {
        Object.assign(this, { text, x, y, width, height });
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
              break;
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
  createClouds(canvas);
}

window.addEventListener('resize', function() {
  cancelAnimationFrame(currAnimation);
  init();
  requestAnimationFrame(gameLoop);
});

function DrawGame(typeOfGame) {
  if (typeOfGame === GAMESTATE.SINGLE_PLAYER) {
    drawBackground();
    drawClouds();
    DrawCastle('blue', 50, 'left');
    DrawCastle('grey', 50, 'right');
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
    default:
      break;
  }
  currAnimation = requestAnimationFrame(gameLoop);
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  init();
  gameLoop();
  // }
}

