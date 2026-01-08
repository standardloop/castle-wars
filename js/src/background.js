import { GetGrassStart } from "./constants.js";

export class Background {
  // drawBorder();
  #clouds;
  constructor(canvasWidth, canvasHeight, numOfClouds) {
    this.#clouds = new Clouds(canvasWidth, canvasHeight, numOfClouds);
  }

  drawSky(canvasWidth, canvasHeight, ctx) {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvasWidth, GetGrassStart(canvasHeight));
  }
  drawGrass(canvasWidth, canvasHeight, ctx) {
    ctx.fillStyle = "#009900";
    ctx.fillRect(0, GetGrassStart(canvasHeight), canvasWidth, canvasHeight);
  }
  drawClouds(canvasWidth, canvasHeight, ctx) {
    this.#clouds.draw(canvasWidth, canvasHeight, ctx);
  }

  initClouds(canvasWidth, canvasHeight) {
    this.#clouds.initClouds(canvasWidth, canvasHeight);
  }

  draw(canvasWidth, canvasHeight, ctx) {
    this.drawSky(canvasWidth, canvasHeight, ctx);
    this.drawGrass(canvasWidth, canvasHeight, ctx);
    this.drawClouds(canvasWidth, canvasHeight, ctx);
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export class Clouds {
  #numOfClouds;
  constructor(canvasWidth, canvasHeight, numOfClouds) {
    this.#numOfClouds = numOfClouds;
    this.clouds = [];
    this.initClouds(canvasWidth, canvasHeight);
  }

  initClouds(canvasWidth, canvasHeight) {
    this.clear();
    for (let i = 0; i < this.#numOfClouds; i++) {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight * 0.5; // upper half
      const speed = getRandomArbitrary(0.05, 0.1);
      const size = Math.random() * 30 + 15;
      this.clouds.push(new Cloud(x, y, speed, size));
    }
  }

  clear() {
    this.clouds = [];
  }

  draw(canvasWidth, canvasHeight, ctx) {
    this.clouds.forEach((cloud) => {
      cloud.update(canvasWidth, canvasHeight);
      cloud.draw(ctx);
    });
  }
}

class Cloud {
  constructor(x, y, speed, size) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = size;
    this.cloudColor = "#FFFFFF";
  }

  draw(ctx) {
    ctx.fillStyle = this.cloudColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
    ctx.arc(this.x + this.size * 0.8, this.y, this.size * 0.5, 0, Math.PI * 2);
    ctx.arc(
      this.x + this.size * 0.4,
      this.y - this.size * 0.4,
      this.size * 0.4,
      0,
      Math.PI * 2,
    );
    ctx.arc(
      this.x + this.size * 1.2,
      this.y - this.size * 0.3,
      this.size * 0.3,
      0,
      Math.PI * 2,
    );
    ctx.closePath();
    ctx.fill();
  }

  update(canvasWidth, canvasHeight) {
    this.x += this.speed;
    if (this.x > canvasWidth + this.size * 1.5) {
      this.x = -this.size * 1.5;
      this.y = Math.random() * canvasHeight * 0.5;
      this.speed = getRandomArbitrary(0.1, 0.3);
    }
  }
}
