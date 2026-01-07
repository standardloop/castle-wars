function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export class Clouds {
  // fixme, private?
  constructor(canvasWidth, canvasHeight, ctx, numOfClouds) {
    this.numOfClouds = numOfClouds;
    this.clouds = [];
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.ctx = ctx;
    this.initClouds();
  }

  initClouds() {
    this.clearClouds();
    for (let i = 0; i < this.numOfClouds; i++) {
      const x = Math.random() * this.canvasWidth;
      const y = Math.random() * this.canvasHeight * 0.5; // upper half
      const speed = getRandomArbitrary(0.1, 0.3);
      const size = Math.random() * 30 + 15;
      this.clouds.push(
        new Cloud(x, y, speed, size, this.canvasWidth, this.canvasHeight),
      );
    }
  }
  clearClouds() {
    this.clouds = [];
  }

  draw() {
    this.clouds.forEach((cloud) => {
      cloud.update();
      cloud.draw(this.ctx);
    });
  }
}

class Cloud {
  constructor(x, y, speed, size, canvasWidth, canvasHeight) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = size;
    this.cloudColor = "#FFFFFF";
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
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

  update() {
    this.x += this.speed;
    if (this.x > this.canvasWidth + this.size * 1.5) {
      this.x = -this.size * 1.5;
      this.y = Math.random() * this.canvasHeight * 0.5;
      this.speed = getRandomArbitrary(0.1, 0.3);
    }
  }
}
