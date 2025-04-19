// Function to create a card back pattern
function createCardBackPattern() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Draw a pattern for the card back
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, 200, 200);
    
    ctx.strokeStyle = '#a0a0a0';
    ctx.lineWidth = 2;
    
    // Draw grid pattern
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if ((i + j) % 2 === 0) {
                ctx.beginPath();
                ctx.moveTo(i * 20, j * 20);
                ctx.lineTo((i + 1) * 20, j * 20);
                ctx.lineTo((i + 1) * 20, (j + 1) * 20);
                ctx.lineTo(i * 20, (j + 1) * 20);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
    
    // Convert canvas to data URL
    const dataURL = canvas.toDataURL();
    
    // Create a style element and set the card-back background
    const style = document.createElement('style');
    style.textContent = `.card-back { background-image: url("${dataURL}") !important; background-size: cover; }`;
    // Add the style to the document head
    document.head.appendChild(style);
}

// Initialize the card back pattern when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createCardBackPattern();
});