import { Clouds } from "./clouds.js";
import { GetGrassStart } from "./constants.js";

export class Background {
  // drawBorder();
  #clouds;
  #canvasWidth;
  #canvasHeight;
  #ctx;
  constructor(canvasWidth, canvasHeight, ctx, numOfClouds) {
    this.#canvasWidth = canvasWidth;
    this.#canvasHeight = canvasHeight;
    this.#ctx = ctx;
    this.#clouds = new Clouds(
      this.#canvasWidth,
      this.#canvasHeight,
      ctx,
      numOfClouds,
    );
  }

  drawSky() {
    this.#ctx.fillStyle = "#87CEEB";
    this.#ctx.fillRect(
      0,
      0,
      this.#canvasWidth,
      GetGrassStart(this.#canvasHeight),
    );
  }
  drawGrass() {
    this.#ctx.fillStyle = "#009900";
    this.#ctx.fillRect(
      0,
      GetGrassStart(this.#canvasHeight),
      this.#canvasWidth,
      this.#canvasHeight,
    );
  }
  drawClouds() {
    this.#clouds.draw();
  }
  draw() {
    this.drawSky();
    this.drawGrass();
    this.drawClouds();
  }
}
