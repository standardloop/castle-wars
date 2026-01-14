import { DrawCastle, DrawFence } from "./castle.js";
import { GetGrassStart, CARD_PADDING } from "./constants.js";
import { GAME_STATE } from "./game.js";

export const PLAYER_KINDS = Object.freeze({
  HUMAN: 0,
  CPU: 1,
});

export const PLAYER_NUMBERS = Object.freeze({
  PLAYER_1: 1,
  PLAYER_2: 2,
});

export class Player {
  // #hand;
  // #stats

  constructor(kind, number, color) {
    this.kind = kind;
    this.number = number;
    this.color = color;

    this.hand = this.playerInitialHand();
    this.stats = this.playerInitialStats();

    // FIXME hardcoded
    this.statRectWidth = 50;
    this.statRectHeight = 50;
  }
  playerInitialHand() {
    return [];
  }

  playerInitialStats() {
    return {
      Builders: 2,
      Bricks: 5,
      Soldiers: 2,
      Weapons: 5,
      Magic: 2,
      Crystals: 5,
      Castle: 30,
      Fence: 10,
    };
  }

  #drawPlayerStats(canvasWidth, canvasHeight, ctx) {
    DrawCastle(
      canvasWidth,
      canvasHeight,
      ctx,
      this.color,
      this.stats["Castle"],
      this.number,
    );
    DrawFence(canvasWidth, canvasHeight, ctx, this.stats["Fence"], this.number);
    let positionX;
    if (this.number === PLAYER_NUMBERS.PLAYER_1) {
      positionX = canvasWidth * 0.1;
    } else {
      positionX = canvasWidth * 0.9;
    }
    let positionY = canvasHeight;
    for (let playerStatRect = 1; playerStatRect <= 4; playerStatRect++) {
      positionY = canvasHeight * (playerStatRect / 10);
      switch (playerStatRect) {
        case 1:
          this.#drawStat(
            ctx,
            positionX,
            positionY,
            { name: "Builders", amount: this.stats["Builders"] },
            { name: "Bricks", amount: this.stats["Bricks"] },
            "red",
          );
          break;
        case 2:
          this.#drawStat(
            ctx,
            positionX,
            positionY,
            { name: "Soldiers", amount: this.stats["Soldiers"] },
            { name: "Weapons", amount: this.stats["Weapons"] },
            "green",
          );
          break;
        case 3:
          this.#drawStat(
            ctx,
            positionX,
            positionY,
            { name: "Magic", amount: this.stats["Magic"] },
            { name: "Crystals", amount: this.stats["Crystals"] },
            "blue",
          );
          break;
        case 4:
          this.#drawStat(
            ctx,
            positionX,
            positionY,
            { name: "Castle", amount: this.stats["Castle"] },
            { name: "Fence", amount: this.stats["Fence"] },
            "grey",
          );
          break;
        default:
          break;
      }
    }
  }

  #drawStat(ctx, x, y, stat1, stat2, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.statRectWidth, this.statRectHeight);

    ctx.fillStyle = "#000000ff";
    ctx.font = "20px Times New Roman";
    ctx.fillText(stat1.name + " " + stat1.amount, x, y);
    ctx.fillText(stat2.name + " " + stat2.amount, x, y + 20);
  }

  canPlayerPlayCard(card) {
    return this.stats[card.cost.resource] >= card.cost.amount;
  }

  // for now, we are drawing cards based on canvas size
  #drawCardsFaceUp(canvasWidth, canvasHeight, ctx) {
    const cardRectHeight = (canvasHeight - GetGrassStart(canvasHeight)) * 0.8;
    const cardStartY =
      GetGrassStart(canvasHeight) +
      (canvasHeight - GetGrassStart(canvasHeight)) * 0.1;

    let cardStartX = canvasWidth * 0.1;
    const cardEnd = canvasWidth * 0.9;
    const cardRectWidth = (cardEnd - cardStartX) / 8;

    for (let card = 0; card < this.hand.length; card++) {
      let cardCanBePlayedBool = this.canPlayerPlayCard(this.hand[card]);
      this.hand[card].draw(
        canvasWidth,
        canvasHeight,
        ctx,
        cardRectWidth,
        cardRectHeight,
        cardStartX,
        cardStartY,
        cardCanBePlayedBool,
      );
      cardStartX += cardRectWidth + CARD_PADDING;
    }
  }

  // TODO
  #drawCardsFaceDown() {}

  #drawHand(canvasWidth, canvasHeight, ctx) {
    // TODO
    // if (this.kind === PLAYER_KINDS.HUMAN) {
    //   this.#drawCardsFaceUp();
    // } else if (this.kind === PLAYER_KINDS.CPU) {
    //   this.#drawCardsFaceDown();
    // }
    this.#drawCardsFaceUp(canvasWidth, canvasHeight, ctx);

    // console.log(this.hand);
  }

  addCardToHand(card) {
    this.hand.push(card);
  }

  draw(canvasWidth, canvasHeight, ctx, gameState) {
    this.#drawPlayerStats(canvasWidth, canvasHeight, ctx);
    if (
      (gameState === GAME_STATE.PLAYER_1_TURN &&
        this.number === PLAYER_NUMBERS.PLAYER_1) ||
      (gameState === GAME_STATE.PLAYER_2_TURN &&
        this.number === PLAYER_NUMBERS.PLAYER_2)
    ) {
      this.#drawHand(canvasWidth, canvasHeight, ctx);
    }
  }
}
