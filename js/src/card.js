export const CARD_TYPES = Object.freeze({
  BRICKS: 0,
  WEAPONS: 1,
  CRYSTALS: 2,
});

export class Card {
  constructor(name, cost, effect, kind) {
    this.name = name;
    this.cost = cost;
    this.effect = effect;
    this.kind = kind;

    // FIXME, size is hardcoded
    this.rectWidth = 5 * 10;
    this.rectHeight = 7 * 10;

    // this gets updated when
    this.x = null;
    this.y = null;
  }

  // canPlay is bool
  draw(ctx, x, canPlay) {
    let color;
    switch (this.kind) {
      case CARD_TYPES.BRICKS:
        color = "red";
        break;
      case CARD_TYPES.WEAPONS:
        color = "green";
        break;
      case CARD_TYPES.CRYSTALS:
        color = "blue";
        break;
      default:
        color = "grey";
        break;
    }
    if (!canPlay) {
      color = "grey";
    }

    const y = grassStart;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.rectWidth, this.rectHeight);

    ctx.fillStyle = "#000000ff";
    ctx.font = "10px Times New Roman";
    let textY = y + this.rectHeight / 2;
    let textX = x + this.rectWidth / 2;
    const spaceChar = " ";
    if (this.name.includes(spaceChar)) {
      let allWordsInName = this.name.split(spaceChar);
      for (let i = 0; i < allWordsInName.length; i++) {
        ctx.fillText(allWordsInName[i], textX, textY + i * 10);
      }
    } else {
      ctx.fillText(this.name, textX, textY);
    }
    this.x = x;
    this.y = y;
  }
  inBounds(mouseX, mouseY) {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.rectWidth &&
      mouseY > this.y &&
      mouseY < this.y + this.rectHeight
    );
  }
}
