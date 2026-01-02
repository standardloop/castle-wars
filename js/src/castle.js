export function DrawCastle(canvas, ctx, color, size, side) {
    ctx.fillStyle = color
    ctx.lineWidth = 10;
    ctx.strokeStyle = "black";
    let sidePosition;
    if (side == "left") {
        sidePosition = canvas.width * 0.20;
    } else {
        sidePosition = canvas.width * 0.70
    }

    let castleStart = canvas.height / 1.3;

    for (let layers = 0; layers < size; layers++) {
        ctx.fillRect(sidePosition, (castleStart) - 2 - layers, 100, 2);
    }
}
