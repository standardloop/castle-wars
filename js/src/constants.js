export const CARDS_IN_HAND = 8;
export const GRASS_START_RATIO = 0.8;
export const CASTLE_SIZE_TO_WIN = 100;

export function GetGrassStart(canvasHeight) {
  return canvasHeight * GRASS_START_RATIO;
}
