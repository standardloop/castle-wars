import { PLAYER_NUMBERS } from "./player.js";
import { GetGrassStart } from "./constants.js";

function getBrickWidth(canvasWidth) {
  return canvasWidth / 100;
}
function getBrickHeight(canvasHeight) {
  return GetGrassStart(canvasHeight) / 100;
}

const brickPadding = 0.5;

export function DrawCastle(
  canvasWidth,
  canvasHeight,
  ctx,
  color,
  bricksHigh,
  playerNumber,
) {
  const brickWidth = getBrickWidth(canvasWidth);
  const brickHeight = getBrickHeight(canvasHeight);

  const castleWidth = 10;
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

  let realSidePositionX;
  for (let layersY = 1; layersY <= bricksHigh; layersY++) {
    if (
      (playerNumber === PLAYER_NUMBERS.PLAYER_2 && layersY % 2 === 1) ||
      (playerNumber === PLAYER_NUMBERS.PLAYER_1 && layersY % 2 === 0)
    ) {
      realSidePositionX = sidePositionX - (flipper * brickWidth) / 2;
    } else {
      realSidePositionX = sidePositionX;
    }

    for (let layersX = 1; layersX <= castleWidth; layersX++) {
      if (
        (!(layersY === bricksHigh && layersX % 2 === 0) &&
          playerNumber === PLAYER_NUMBERS.PLAYER_2) ||
        (!(layersY === bricksHigh && layersX % 2 === 1) &&
          playerNumber === PLAYER_NUMBERS.PLAYER_1)
      ) {
        drawBrick(
          ctx,
          realSidePositionX + layersX * brickWidth * flipper,
          castleStartY - brickHeight * layersY,
          brickWidth,
          brickHeight,
          true,
        );
      }
    }
  }
  drawPillar(
    canvasWidth,
    canvasHeight,
    ctx,
    color,
    bricksHigh,
    playerNumber,
    castleWidth,
    true,
  );
  drawPillar(
    canvasWidth,
    canvasHeight,
    ctx,
    color,
    bricksHigh,
    playerNumber,
    castleWidth,
    false,
  );
}

function drawPillar(
  canvasWidth,
  canvasHeight,
  ctx,
  color,
  bricksHigh,
  playerNumber,
  castleWidth,
  isLeft,
) {
  const pillarExtension = 3;

  bricksHigh += pillarExtension;
  const brickWidth = getBrickWidth(canvasWidth) / 2;
  const brickHeight = getBrickHeight(canvasHeight);

  const pillarWidth = 5;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (playerNumber === PLAYER_NUMBERS.PLAYER_1) {
    sidePositionX = canvasWidth * 0.2;
    if (isLeft) {
      sidePositionX -= brickWidth * pillarWidth - brickWidth * 2 * castleWidth;
      sidePositionX += brickWidth;
    } else {
      sidePositionX -= brickWidth * pillarWidth;
      sidePositionX += brickWidth;
    }
  } else {
    sidePositionX = canvasWidth * 0.8;
    if (isLeft) {
      sidePositionX += brickWidth * pillarWidth - brickWidth * 2 * castleWidth;
    } else {
      sidePositionX += brickWidth * pillarWidth;
    }
    flipper = -1;
  }

  let castleStartY = GetGrassStart(canvasHeight);

  let realSidePositionX;
  for (let layersY = 1; layersY <= bricksHigh; layersY++) {
    realSidePositionX = sidePositionX;

    for (let layersX = 1; layersX <= pillarWidth; layersX++) {
      if (!(layersY === bricksHigh && layersX % 2 === 0)) {
        drawBrick(
          ctx,
          realSidePositionX + layersX * brickWidth * flipper,
          castleStartY - brickHeight * layersY,
          brickWidth,
          brickHeight,
          true,
        );
      }
    }
  }
}

export function DrawFence(
  canvasWidth,
  canvasHeight,
  ctx,
  bricksHigh,
  playerNumber,
) {
  const brickWidth = getBrickWidth(canvasWidth) * 0.5;
  const brickHeight = getBrickHeight(canvasHeight) * 0.5;

  const fenceWidth = 2;
  ctx.fillStyle = "red";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  let flipper = 1;
  let sidePositionX;
  if (playerNumber === PLAYER_NUMBERS.PLAYER_1) {
    sidePositionX = canvasWidth * 0.4;
  } else {
    sidePositionX = canvasWidth * 0.6;
    flipper = -1;
  }

  let fenceStartY = GetGrassStart(canvasHeight);

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
    ctx.lineWidth = brickPadding;
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
    ctx.closePath();
  }
}
