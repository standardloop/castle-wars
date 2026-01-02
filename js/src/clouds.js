let xPos = 0;
const speed = 0.10;
export function AnimateClouds(cloudMax, image, canvas, ctx) {
    
    ctx.drawImage(image, xPos, 100);

    xPos += speed;

    if (xPos > canvas.width) {
        xPos = -image.width;
    }

    requestAnimationFrame(AnimateClouds);
}
