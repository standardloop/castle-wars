import { AnimateClouds } from './clouds.js'

export function DrawMenu(canvas) {
  //console.log("DrawMenu")
  drawBackground(canvas);
  drawClouds(canvas);
  drawCastles(canvas);
  drawTitle(canvas);
  drawButtons(canvas);
}

function drawBackground(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#87CEEB'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height / 1.5);
    ctx.fillStyle = '#009900'; 
    ctx.fillRect(0, canvas.height / 1.5, canvas.width, canvas.height / 2);
}

function drawClouds(canvas) {
  const image = document.getElementById('cloud');
  AnimateClouds(5, image, canvas)
  // image.onload = function() {
    //AnimateClouds(5, image, canvas)
  // };
}

function drawCastles(canvas) {
    const ctx = canvas.getContext('2d');
}

function drawTitle(canvas) {
    const ctx = canvas.getContext('2d');
    // Define text styles
    const text = 'Castle Wars';
    const fontSize = '80px';
    const fontFace = 'sans-serif';
    const textColor = '#000000ff';
    const borderWidth = 5;

    ctx.font = `${fontSize} ${fontFace}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = canvas.width / 2;
    const y = canvas.height / 2;

    ctx.strokeStyle = textColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeText(text, x, y);

    ctx.globalCompositeOperation = 'destination-out';

    ctx.fillStyle = '#000000';
    ctx.fillText(text, x, y);

    ctx.globalCompositeOperation = 'source-over';

}

function drawButtons(canvas) {
  const ctx = canvas.getContext('2d');
}
