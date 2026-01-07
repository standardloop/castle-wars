import { GameCanvas } from "./src/canvas.js";

let gameCanvas;
let currAnimation;
const numOfClouds = 10;

// main function
window.onload = () => {
  gameCanvas = new GameCanvas("gameCanvas", numOfClouds);
  gameLoop();
};

// recreate the canvas on redraw
// we don't want to change any player state
window.addEventListener("resize", () => {
  cancelAnimationFrame(currAnimation);
  gameCanvas = new GameCanvas("gameCanvas", numOfClouds);
  requestAnimationFrame(gameLoop);
});

function gameLoop() {
  gameCanvas.clear();
  gameCanvas.draw();
  currAnimation = requestAnimationFrame(gameLoop);
}
