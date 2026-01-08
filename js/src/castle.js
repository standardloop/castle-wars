import { PLAYER_NUMBERS } from "./player.js";
import { GetGrassStart } from "./constants.js";

const brickWidth = 225 / 25;
const brickHeight = 75 / 25;

const castleWidth = 10;

export function DrawCastle(
  canvasWidth,
  canvasHeight,
  ctx,
  color,
  bricksHigh,
  playerNumber,
) {
  ctx.fillStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (playerNumber === PLAYER_NUMBERS.PLAYER_1) {
    sidePositionX = canvasWidth * 0.2;
  } else {
    sidePositionX = canvasWidth * 0.8;
    flipper = -1;
  }

  let castleStartY = GetGrassStart(canvasHeight);
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

// FIXME
export function DrawFence(
  canvasWidth,
  canvasHeight,
  ctx,
  bricksHigh,
  playerNumber,
) {
  const fenceWidth = 2;
  ctx.fillStyle = "red";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (playerNumber === PLAYER_NUMBERS.PLAYER_1) {
    sidePositionX = canvasWidth * 0.4;
  } else {
    sidePositionX = canvasHeight * 0.6;
    flipper = -1;
  }

  let fenceStartY = GetGrassStart(1);

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
