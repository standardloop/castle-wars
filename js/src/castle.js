import { PLAYER_NUMBERS } from "./player.js";

export function DrawCastle(ctx, color, bricksHigh, playerNumber) {
  ctx.fillStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (playerNumber === PLAYER_NUMBERS.PLAYER_1) {
    sidePositionX = getCanvasWidth() * 0.2;
  } else {
    sidePositionX = getCanvasWidth() * 0.8;
    flipper = -1;
  }

  let castleStartY = grassStart;
  for (let layersY = 1; layersY <= bricksHigh; layersY++) {
    for (let layersX = 1; layersX <= castleWidth; layersX++) {
      drawBrick(
        ctx,
        sidePositionX + layersX * brickWidth * flipper,
        castleStartY - brickHeight * layersY,
        brickWidth,
        brickHeight,
        true,
      );
    }
  }
}

export function DrawFence(ctx, bricksHigh, playerNumber) {
  const fenceWidth = 2;
  ctx.fillStyle = "red";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (playerNumber === PLAYER_NUMBERS.PLAYER_1) {
    sidePositionX = getCanvasWidth() * 0.4;
  } else {
    sidePositionX = getCanvasWidth() * 0.6;
    flipper = -1;
  }

  let fenceStartY = grassStart;

  for (let layersY = 1; layersY < bricksHigh; layersY++) {
    for (let layersX = 1; layersX <= fenceWidth; layersX++) {
      drawBrick(
        ctx,
        sidePositionX + layersX * brickWidth * flipper,
        fenceStartY - brickHeight * layersY,
        brickWidth,
        brickHeight,
        true,
      );
    }
  }
}

function drawBrick(ctx, x, y, width, height, drawBorder) {
  ctx.fillRect(x, y, width, height);
  if (drawBorder) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
    ctx.closePath();
  }
}
