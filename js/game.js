import { DrawMenu } from "./src/menu.js"

const GAMESTATE = Object.freeze({
  MENU: 0,
  PLAYING: 1,
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameState = GAMESTATE.MENU;

function gameLoop() {
    if (gameState === GAMESTATE.MENU) {
        DrawMenu(canvas, ctx);
    } else if (gameState === GAMESTATE.PLAYING) {
        DrawGame();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
