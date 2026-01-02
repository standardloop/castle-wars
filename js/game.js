import { DrawMenu } from "./src/menu.js"

const GAMESTATE = Object.freeze({
  MENU: 0,
  PLAYING: 1,
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameState = GAMESTATE.MENU;
const cloudImage = new Image();
cloudImage.src = "images/cloud-1.png"

function gameLoop() {
  if (gameState === GAMESTATE.MENU) {
    DrawMenu(canvas, ctx, cloudImage);
  }
  //requestAnimationFrame(gameLoop);
}

gameLoop();
