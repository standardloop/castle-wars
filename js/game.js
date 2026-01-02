// DEF GLOBAL START
const GAMESTATE = Object.freeze({
  MENU: 0,
  PLAYING: 1,
});

let canvas;
let ctx;
let clouds = [];
const numOfClouds = 10;
const cloudColor = '#FFFFFF'; // White clouds
let currAnimation;
let gameState = GAMESTATE.MENU;
let ratio;
// let lastTime = 0;

// DEF GLOBAL END

function DrawMenu() {
  //console.log("DrawMenu")
  drawBackground();
  drawClouds();
  drawTitle();
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

function drawBackground() {
  ctx.fillStyle = '#87CEEB'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height / 1.3);
  ctx.fillStyle = '#009900'; 
  ctx.fillRect(0, canvas.height / 1.3, canvas.width, canvas.height / 2);
}

function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ratio = window.devicePixelRatio;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.getContext("2d").scale(ratio, ratio);
  clearClouds();
  createClouds(canvas);
}

window.addEventListener('resize', function() {
  cancelAnimationFrame(currAnimation);
  init();
  requestAnimationFrame(gameLoop);
});

function gameLoop() {
  // const deltaTime = timeStamp - lastTime;
  // lastTime = timeStamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameState === GAMESTATE.MENU) {
    DrawMenu();
  } else {
    
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

