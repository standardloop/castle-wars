import { DrawCastle } from "./castle.js";
import { PLAYER_NUMBERS } from "./player.js";

export class Menu {
  #canvasWidth;
  #canvasHeight;
  #ctx;
  #buttons;

  constructor(canvasWidth, canvasHeight, ctx) {
    this.#canvasWidth = canvasWidth;
    this.#canvasHeight = canvasHeight;
    this.#ctx = ctx;
    this.#buttons = [];
    this.#initButtons();
  }
  #drawTitle() {
    const text = "Castle Wars";
    const fontSize = "80px";
    const fontFace = "Times New Roman";
    const textColor = "#000000ff";
    const borderWidth = 2;

    this.#ctx.font = `${fontSize} ${fontFace}`;
    this.#ctx.textAlign = "center";
    this.#ctx.textBaseline = "middle";

    const x = this.#canvasWidth * 0.5;
    const y = this.#canvasHeight * 0.2;

    this.#ctx.strokeStyle = textColor;
    this.#ctx.lineWidth = borderWidth;
    // TODO, 3d effect
    for (let i = 0; i < 1; i++) {
      this.#ctx.strokeText(text, x, y);
    }
  }

  clearButtons() {
    this.#buttons = [];
  }

  #initButtons() {
    let menuButtonNames = [
      "Single Player",
      "Two Player",
      "Card Deck",
      "Instructions",
      "Credits",
    ];

    for (
      let menuButtonIndex = 0;
      menuButtonIndex < menuButtonNames.length;
      menuButtonIndex++
    ) {
      let x = this.#canvasWidth * 0.5 - 60;
      let y = this.#canvasHeight * (0.32 + 0.1 * menuButtonIndex) - 25;
      let menuButtonName = menuButtonNames[menuButtonIndex];
      let width = 120;
      let height = 50;
      this.#buttons.push(
        new Button(this.#ctx, menuButtonName, x, y, width, height),
      );
    }
  }

  #drawMenuButtons() {
    this.#buttons.forEach((button) => button.draw());
  }

  draw() {
    this.#drawTitle();
    this.#drawMenuButtons();
    // left
    DrawCastle(
      this.#ctx,
      this.#canvasWidth,
      this.#canvasHeight,
      "blue",
      50,
      PLAYER_NUMBERS.PLAYER_1,
    );
    // right
    DrawCastle(
      this.#ctx,
      this.#canvasWidth,
      this.#canvasHeight,
      "red",
      50,
      PLAYER_NUMBERS.PLAYER_2,
    );
  }
}

class Button {
  #ctx;
  constructor(ctx, text, x, y, width, height) {
    this.#ctx = ctx;
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    this.#ctx.textAlign = "center";
    this.#ctx.textBaseline = "middle";
    this.#ctx.fillStyle = "rgba(225, 225, 225, 0.5)";
    this.#ctx.fillRect(this.x, this.y, this.width, this.height);
    this.#ctx.strokeStyle = "#000000";
    this.#ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.#ctx.fillStyle = "#000000";
    this.#ctx.font = "20px Times New Roman";
    this.#ctx.textAlign = "center";
    this.#ctx.textBaseline = "middle";
    this.#ctx.fillText(
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2,
    );
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
