const button = {
    x: 150,
    y: 90,
    width: 100,
    height: 40,
    text: 'Click Me'
};

function drawButton() {
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textX = button.x + button.width / 2;
    const textY = button.y + button.height / 2;
    ctx.fillText(button.text, textX, textY);
}

function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width &&
            pos.y > rect.y && pos.y < rect.y + rect.height;
}

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };

    if (isInside(mousePos, button)) {
        alert('Button clicked!');
    }
});

drawButton();
