import { Game } from "./src/game.js";

let game;
let currAnimation;
const numOfClouds = 10;

// main function
window.onload = () => {
  game = new Game("gameCanvas", numOfClouds);
  gameLoop();
};

// recreate the canvas on redraw
// we don't want to change any player state
window.addEventListener("resize", () => {
  cancelAnimationFrame(currAnimation);
  game = new Game("gameCanvas", numOfClouds);
  requestAnimationFrame(gameLoop);
});

function gameLoop() {
  game.clear();
  game.draw();
  currAnimation = requestAnimationFrame(gameLoop);
}
