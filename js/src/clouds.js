let xPos = 0; // Starting X position
const speed = 2; // Movement speed
export function AnimateClouds(cloudMax, image, canvas) {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, xPos, 100);

    xPos += speed;

    if (xPos > canvas.width) {
        xPos = -image.width;
    }

    requestAnimationFrame(AnimateClouds);
}
