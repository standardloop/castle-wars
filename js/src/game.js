import { Background } from "./background.js";
import { Menu, MENU_BUTTONS } from "./menu.js";
import { Player, PLAYER_NUMBERS, PLAYER_KINDS } from "./player.js";
import { Deck } from "./deck.js";
import { CARDS_IN_HAND, CASTLE_SIZE_TO_WIN } from "./constants.js";

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

  #deck;

  #appState;
  #gameState;

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
    this.#deck = new Deck(
      this.getCanvasWidth(),
      this.getCanvasHeight(),
      this.ctx,
    );

    this.#appState = APP_STATE.MENU;
    this.#gameState = GAME_STATE.PLAYER_1_TURN;
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
          this.#startingHand(this.#player1);
          this.#player2 = new Player(
            this.getCanvasWidth(),
            this.getCanvasHeight(),
            this.ctx,
            PLAYER_KINDS.CPU,
            PLAYER_NUMBERS.PLAYER_2,
            "grey",
          );
          this.#startingHand(this.#player2);
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
    } else if (
      this.#appState === APP_STATE.SINGLE_PLAYER ||
      this.#appState === APP_STATE.TWO_PLAYER
    ) {
      if (this.#gameState === GAME_STATE.PLAYER_1_TURN) {
        this.#checkAndPlayClickedCard(
          this.#player1,
          mouseX,
          mouseY,
          event.shiftKey,
        );
      }
      // } else if (
      //   this.#gameState === GAME_STATE.PLAYER_2_TURN &&
      //   this.#player2.kind === PLAYER_KINDS.HUMAN
      // ) {
      //   this.#player2.checkClickedCard();
      // }
    }
  }

  #switchTurns() {
    if (this.#gameState === GAME_STATE.PLAYER_1_TURN) {
      this.#gameState = GAME_STATE.PLAYER_2_TURN;
    } else if (this.#gameState === GAME_STATE.PLAYER_2_TURN) {
      this.#gameState = GAME_STATE.PLAYER_1_TURN;
    }
  }

  #cardXPosToIndex(card) {
    if (card.x === null) {
      alert("CRASH");
      return null;
    } else if (card.x === 0) {
      return 0;
    }
    const cardPadding = 5;
    return card.x / (card.rectWidth + cardPadding);
  }

  #removeCardFromHand(hand, card) {
    let index = this.#cardXPosToIndex(card);
    this.#deck.shuffleDeck();
    hand[index] = this.#deck.getCardFromDeck();
  }

  #playCard(player, card) {
    let enemy;
    if (player.number === PLAYER_NUMBERS.PLAYER_1) {
      enemy = this.#player2;
    } else if (player.number === PLAYER_NUMBERS.PLAYER_2) {
      enemy = this.#player1;
    }
    console.log(`Player ${player.number} played card ${card.name}`);
    card.effect.self.forEach((effect) => {
      player.stats[effect.resource] += effect.amount;
      // cover case with Reserve card, in future, make this a gamesetting.
      if (player.stats["Fence"] < 0) {
        player.stats["Fence"] = 0;
      }
    });

    card.effect.enemy.forEach((effect) => {
      if (effect.resource === "Health") {
        if (enemy.stats["Fence"] >= effect.amount) {
          enemy.stats["Fence"] -= effect.amount;
        } else {
          enemy.stats["Fence"] -= effect.amount;
          enemy.stats["Castle"] += enemy.stats["Fence"];
          enemy.stats["Fence"] = 0;
        }
      } else {
        enemy.stats[effect.resource] -= effect.amount;
        if (enemy.stats[effect.resource] < 0) {
          enemy.stats[effect.resource] = 0;
        }
      }
    });

    // Thief and Curse cards
    card.effect.transfer.forEach((effect) => {
      let amountSupposedToDeduct = effect.amount;
      if (enemy.stats[effect.resource] < amountSupposedToDeduct) {
        amountSupposedToDeduct = enemy.stats[effect.resource];
        enemy.stats[effect.resource] = 0;
      } else {
        enemy.stats[effect.resource] -= effect.amount;
        player.stats[effect.resource] += effect.amount;
      }
    });

    player.stats[card.cost.resource] -= card.cost.amount;

    if (this.#checkIfPlayerWon()) {
      return;
    } else {
      let cardDup = card;
      this.#removeCardFromHand(player, card);
      this.#deck.addCardToDeck(cardDup);
      this.#resourceMakersMakeResources(player);
      this.#switchTurns();
    }
  }
  #checkIfPlayerWon() {
    let player;
    let enemy;
    if (this.#gameState === GAME_STATE.PLAYER_1_TURN) {
      player = this.#player1;
      enemy = this.#player2;
    } else if (this.#gameState === GAME_STATE.PLAYER_2_TURN) {
      player = this.#player2;
      enemy = this.#player1;
    }
    if (
      player.number === 1 &&
      enemy.number === 2 &&
      (enemy.stats["Castle"] <= 0 ||
        player.stats["Castle"] >= CASTLE_SIZE_TO_WIN)
    ) {
      this.#gameState = GAME_STATE.PLAYER_1_WIN;
      alert("Player 1 wins!!!"); // FIXME, alert is before seeing tower at 100
    } else if (
      player.number === 2 &&
      enemy.number === 1 &&
      (enemy.stats["Castle"] <= 0 ||
        player.stats["Castle"] >= CASTLE_SIZE_TO_WIN)
    ) {
      this.#gameState = GAME_STATE.PLAYER_2_WIN;
      alert("Player 2 wins!!!");
    }
    return (
      this.#gameState === GAME_STATE.PLAYER_1_WIN ||
      this.#gameState === GAME_STATE.PLAYER_2_WIN
    );
  }

  #resourceMakersMakeResources(player) {
    player.stats["Bricks"] += player.stats["Builders"];
    player.stats["Weapons"] += player.stats["Soldiers"];
    player.stats["Crystals"] += player.stats["Magic"];
  }

  #checkAndPlayClickedCard(player, mouseX, mouseY, shiftKey) {
    player.hand.forEach((card) => {
      if (card.inBounds(mouseX, mouseY)) {
        console.log(`${card.name}`);
        // discard
        if (shiftKey) {
          console.log(`Player 1 discarded ${card.name}!`);

          let cardDup = card;
          this.#removeCardFromHand(player.hand, card);
          this.#deck.addCardToDeck(cardDup);
          this.#resourceMakersMakeResources(player);
          this.#switchTurns();
        } else {
          if (player.canPlayerPlayCard(card)) {
            this.#playCard(player, card);
          } else {
            console.log(
              `Clicked ${card.name}, but card cannot be played, hold "Shift" and then click to discard`,
            );
            // alert(
            //   `Clicked ${card.name}, but card cannot be played, hold "Shift" and then click to discard`,
            // );
          }
        }
      }
    });
  }

  #drawMenu() {
    this.#background.draw();
    this.#menu.draw();
  }

  #drawBattle() {
    this.#background.draw();
    this.#player1.draw(this.#gameState);
    this.#player2.draw(this.#gameState);
  }

  #startingHand(player) {
    for (let i = 0; i < CARDS_IN_HAND; i++) {
      let card = this.#deck.getCardFromDeck();
      player.addCardToHand(card);
    }
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
