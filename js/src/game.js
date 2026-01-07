import { Background } from "./background.js";
import { Menu } from "./menu.js";

export const APP_STATE = Object.freeze({
  MENU: 0,
  SINGLE_PLAYER: 1,
  TWO_PLAYER: 2,
  CARD_DECK: 3,
  INSTRUCTIONS: 4,
  CREDITS: 5,
  PAUSE: 6,
  GAME_OVER_SCREEN: 7,
});

export const GAME_STATE = Object.freeze({
  PLAYER_1_TURN: 1,
  PLAYER_2_TURN: 2,
  PLAYER_1_WIN: 3,
  PLAYER_2_WIN: 4,
});

export class Game {
  #background;
  #menu;
  #dpr;
  #elementID;

  #appState;
  constructor(elementID, numOfClouds) {
    this.#elementID = elementID;
    this.canvas = document.getElementById(this.#elementID);
    this.ctx = this.canvas.getContext("2d");
    this.initCanvas();
    this.#background = new Background(
      this.getCanvasWidth(),
      this.getCanvasHeight(),
      this.ctx,
      numOfClouds,
    );
    this.#menu = new Menu(
      this.getCanvasWidth(),
      this.getCanvasHeight(),
      this.ctx,
    );
    this.#appState = APP_STATE.MENU;
  }

  // FIXME, the DPR divide is wrong.
  getCanvasWidth() {
    return this.canvas.width / this.#dpr;
  }

  getCanvasHeight() {
    return this.canvas.height / this.#dpr;
  }

  setDPR() {
    this.#dpr = window.devicePixelRatio || 1;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
  }

  setupHighDPICanvas() {
    // const rect = canvas.getBoundingClientRect();
    this.setDPR();
    const rect = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.canvas.width = rect.width * this.#dpr;
    this.canvas.height = rect.height * this.#dpr;
    this.ctx.scale(this.#dpr, this.#dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  initCanvas() {
    this.setupHighDPICanvas();
  }
  draw() {
    this.#background.draw();
    switch (this.#appState) {
      case APP_STATE.MENU:
        this.#menu.draw();
        break;
      default:
        break;
    }
  }
}
