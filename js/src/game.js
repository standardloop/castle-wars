import { Background } from "./background.js";
import { Menu } from "./menu.js";
import { MENU_BUTTONS } from "./menu.js";
import { Player, PLAYER_NUMBERS } from "./player.js";
import { PLAYER_KINDS } from "./player.js";

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

  #player1;
  #player2;

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
    this.#player1 = null;
    this.#player2 = null;
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

  handleClickEvent(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    if (this.#appState === APP_STATE.MENU) {
      const button_pressed = this.#menu.whichButtonWasPressed(mouseX, mouseY);
      console.log(button_pressed);
      // FIXME is there a cleaner way to handle this mapping?
      switch (button_pressed) {
        case MENU_BUTTONS.SINGLE_PLAYER:
          this.#player1 = new Player(
            this.getCanvasWidth(),
            this.getCanvasHeight(),
            this.ctx,
            PLAYER_KINDS.HUMAN,
            PLAYER_NUMBERS.PLAYER_1,
            "blue",
          );
          // startingHand(player1);
          this.#player2 = new Player(
            this.getCanvasWidth(),
            this.getCanvasHeight(),
            this.ctx,
            PLAYER_KINDS.CPU,
            PLAYER_NUMBERS.PLAYER_2,
            "grey",
          );
          // startingHand(player2);
          this.#appState = APP_STATE.SINGLE_PLAYER;
          break;
        case MENU_BUTTONS.TWO_PLAYER:
          this.#appState = APP_STATE.TWO_PLAYER;
          break;
        case MENU_BUTTONS.CARD_DECK:
          this.#appState = APP_STATE.CARD_DECK;
          break;
        case MENU_BUTTONS.CREDITS:
          this.#appState = APP_STATE.INSTRUCTIONS;
          break;
        case MENU_BUTTONS.INSTRUCTIONS:
          this.#appState = APP_STATE.CREDITS;
          break;
        default:
          break;
      }
    }
  }

  #drawMenu() {
    this.#background.draw();
    this.#menu.draw();
  }

  #drawBattle() {
    this.#background.draw();
    this.#player1.draw();
    this.#player2.draw();
  }

  draw() {
    switch (this.#appState) {
      case APP_STATE.MENU:
        this.#drawMenu();
        break;
      case APP_STATE.SINGLE_PLAYER:
        this.#drawBattle();
        break;
      default:
        break;
    }
  }
}
