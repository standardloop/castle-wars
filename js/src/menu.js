export function DrawMenu(canvas, ctx, cloudImage) {
  //console.log("DrawMenu")
  drawBackground(canvas, ctx);
  drawClouds(canvas, ctx, cloudImage);
  drawCastles(canvas, ctx);
  drawTitle(canvas, ctx);
  drawButtons(canvas, ctx);
}

function drawBackground(canvas, ctx) {
    ctx.fillStyle = '#87CEEB'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height / 1.5);
    ctx.fillStyle = '#009900'; 
    ctx.fillRect(0, canvas.height / 1.5, canvas.width, canvas.height / 2);
}

function drawClouds(canvas, ctx, cloudImage) {
  ctx.drawImage(cloudImage, 0, 100);
}

function drawCastles(canvas, ctx) {
}

function drawTitle(canvas, ctx) {
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

function drawButtons(canvas, ctx) {
}
