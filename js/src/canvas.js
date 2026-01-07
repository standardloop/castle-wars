import { Background } from "./background.js";
export class GameCanvas {
  #background;
  #dpr;
  #elementID;
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
  }
}
