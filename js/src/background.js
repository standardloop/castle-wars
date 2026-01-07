import { Clouds } from "./clouds.js";

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

  getGrassStart() {
    return this.#canvasHeight * 0.8;
  }

  drawSky() {
    this.#ctx.fillStyle = "#87CEEB";
    this.#ctx.fillRect(0, 0, this.#canvasWidth, this.getGrassStart());
  }
  drawGrass() {
    this.#ctx.fillStyle = "#009900";
    this.#ctx.fillRect(
      0,
      this.getGrassStart(),
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
