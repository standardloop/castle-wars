import { Game } from "./src/game.js";

let game;
let currAnimation;
const numOfClouds = 10;

// main function
window.onload = () => {
  game = new Game("gameCanvas", numOfClouds);
  gameLoop();
};

// draw new canvis with updated width and height
// we don't want to change any player state
window.addEventListener("resize", () => {
  cancelAnimationFrame(currAnimation);
  game.handleResizeEvent();
  requestAnimationFrame(gameLoop);
});

function gameLoop() {
  game.clear();
  game.draw();
  currAnimation = requestAnimationFrame(gameLoop);
}

addEventListener("click", (event) => {
  game.handleClickEvent(event);
});
