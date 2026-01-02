import { DrawCastle } from "./castle.js";

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
  ctx.fillRect(0, 0, canvas.width, canvas.height / 1.3);
  ctx.fillStyle = '#009900'; 
  ctx.fillRect(0, canvas.height / 1.3, canvas.width, canvas.height / 2);
}

function drawClouds(canvas, ctx, cloudImage) {
  ctx.drawImage(cloudImage, 0, 100);
}

const defaultCastleSize = 100;
function drawCastles(canvas, ctx) {
  DrawCastle(canvas, ctx, "blue", defaultCastleSize, "left");
  DrawCastle(canvas, ctx, "red", defaultCastleSize, "right");
}

function drawTitle(canvas, ctx) {
    // Define text styles
    const text = 'Castle Wars';
    const fontSize = '80px';
    const fontFace = 'Times New Roman';
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
  const path = new Path2D()
  path.rect(250, 350, 200, 100)
  path.rect(25,72,32,32)
  path.closePath()

  ctx.fillStyle = "#FFFFFF"
  ctx.fillStyle = "rgba(225,225,225,0.5)"
  ctx.fill(path)
  ctx.lineWidth = 2
  ctx.strokeStyle = "#000000"
  ctx.font = '96px Arial';
  ctx.fillText("hi", 250, 350);
  ctx.stroke(path)

  function getXY(canvas, event){
    const rect = canvas.getBoundingClientRect()
    const y = event.clientY - rect.top
    const x = event.clientX - rect.left
    return {x:x, y:y}
  }

  document.addEventListener("click", function (e) {
    const XY = getXY(canvas, e)
    if(ctx.isPointInPath(path, XY.x, XY.y)) {
      // Do Something with the click
      alert("clicked in rectangle")
    }
  }, false)
}
