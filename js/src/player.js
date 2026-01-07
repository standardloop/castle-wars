import { DrawCastle, DrawFence } from "./castle.js";

export const PLAYER_KINDS = Object.freeze({
  HUMAN: 0,
  CPU: 1,
});

export const PLAYER_NUMBERS = Object.freeze({
  PLAYER_1: 1,
  PLAYER_2: 2,
});

export class Player {
  // PLAYER_KINDS.CPU
  // PLAYER_NUMBERS.PLAYER_1
  //
  constructor(kind, number, color) {
    this.side = side;
    this.kind = kind;
    this.number = number;
    this.side = number === PLAYER_NUMBERS.PLAYER_1 ? "left" : "right";
    this.color = color;
    this.hand = playerInitialHand();
    this.stats = playerInitialStats();

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
  draw() {
    this.drawPlayerStats();
    if (
      (actualGameState === ACTUAL_GAMESTATE.PLAYER_1_TURN &&
        this.number === 1) ||
      (actualGameState === ACTUAL_GAMESTATE.PLAYER_2_TURN && this.number === 2)
    ) {
      if (this.kind === PLAYER_KINDS.HUMAN) {
      } else if (this.kind === PLAYER_KINDS.CPU) {
        // drawCardsFaceDown
      }
      // drawCardsFaceUp
      // console.log(this.hand);
      let cardStart = 0;
      for (let card = 0; card < this.hand.length; card++) {
        let cardCanBePlayedBool = canPlayerPlayCard(
          this.stats,
          this.hand[card],
        );
        this.hand[card].draw(cardStart, cardCanBePlayedBool);
        cardStart += this.hand[card].rectWidth + 5; // FIXME card padding;
      }
    }
  }
  drawPlayerStats() {
    DrawCastle(this.color, this.side, this.stats["Castle"]);
    DrawFence(this.side, this.stats["Fence"]);
    let positionX;
    if (this.number === PLAYER_NUMBERS.PLAYER_1) {
      positionX = getCanvasWidth() * 0.1;
    } else {
      positionX = getCanvasWidth() * 0.9;
    }
    let positionY = getCanvasHeight();
    for (let playerStatRect = 1; playerStatRect <= 4; playerStatRect++) {
      positionY = getCanvasHeight() * (playerStatRect / 10);
      switch (playerStatRect) {
        case 1:
          this.drawStat(
            positionX,
            positionY,
            { name: "Builders", amount: this.stats["Builders"] },
            { name: "Bricks", amount: this.stats["Bricks"] },
            "red",
          );
          break;
        case 2:
          this.drawStat(
            positionX,
            positionY,
            { name: "Soldiers", amount: this.stats["Soldiers"] },
            { name: "Weapons", amount: this.stats["Weapons"] },
            "green",
          );
          break;
        case 3:
          this.drawStat(
            positionX,
            positionY,
            { name: "Magic", amount: this.stats["Magic"] },
            { name: "Crystals", amount: this.stats["Crystals"] },
            "blue",
          );
          break;
        case 4:
          this.drawStat(
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
  drawStat(ctx, x, y, stat1, stat2, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.statRectWidth, this.statRectHeight);

    ctx.fillStyle = "#000000ff";
    ctx.font = "20px Times New Roman";
    ctx.fillText(stat1.name + " " + stat1.amount, x, y);
    ctx.fillText(stat2.name + " " + stat2.amount, x, y + 20);
  }
}
