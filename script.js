// Card colors for the game
const cardImages = [
    { name: 'red', color: '#FF0000' },
    { name: 'blue', color: '#0000FF' },
    { name: 'green', color: '#00FF00' },
    { name: 'yellow', color: '#FFFF00' },
    { name: 'purple', color: '#800080' },
    { name: 'orange', color: '#FFA500' },
    { name: 'pink', color: '#FFC0CB' },
    { name: 'cyan', color: '#00FFFF' },
    { name: 'brown', color: '#A52A2A' },
    { name: 'teal', color: '#008080' },
    { name: 'lime', color: '#32CD32' },
    { name: 'magenta', color: '#FF00FF' }
    // 12 different colors for 24 cards total (12 pairs)
];

// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timer = 0;
let timerInterval;
let gameStarted = false;

// DOM elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('reset-button');

// Initialize the game
function initGame() {
    // Reset game variables
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    timer = 0;
    gameStarted = false;
    scoreElement.textContent = score;
    timerElement.textContent = timer;
    gameBoard.innerHTML = '';
    
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Create pairs of cards
    const cardPairs = [...cardImages, ...cardImages];
    
    // Shuffle the cards
    shuffleArray(cardPairs);
    
    // Create card elements
    cardPairs.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.cardName = card.name;
        cardElement.dataset.index = index;
        
        // Create card front (with color)
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.style.backgroundColor = card.color;
        
        // Add color name text to the card
        const colorText = document.createElement('span');
        colorText.classList.add('color-name');
        colorText.textContent = card.name;
        cardFront.appendChild(colorText);
        
        // Create card back
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        
        // Add front and back to card
        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);
        
        // Add click event
        cardElement.addEventListener('click', flipCard);
        
        // Add to game board
        gameBoard.appendChild(cardElement);
        
        // Add to cards array
        cards.push(cardElement);
    });
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Handle card flip
function flipCard() {
    // Start timer on first card flip
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    const selectedCard = this;
    
    // Return if the card is already flipped or matched
    if (flippedCards.length === 2 || selectedCard.classList.contains('flipped') || 
        selectedCard.classList.contains('matched')) {
        return;
    }
    
    // Flip the card
    selectedCard.classList.add('flipped');
    flippedCards.push(selectedCard);
    
    // Check for a match if two cards are flipped
    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

// Check if the flipped cards match
function checkForMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];
    
    if (card1.dataset.cardName === card2.dataset.cardName) {
        // Cards match
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        
        // Update score and matched pairs
        score += 10;
        scoreElement.textContent = score;
        matchedPairs++;
        
        // Check if all pairs are matched
        if (matchedPairs === cardImages.length) {
            endGame();
        }
    } else {
        // Cards don't match, flip them back
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
        
        // Penalty for wrong match
        if (score > 0) {
            score -= 1;
            scoreElement.textContent = score;
        }
    }
    
    // Clear flipped cards array
    setTimeout(() => {
        flippedCards = [];
    }, 1000);
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;
    }, 1000);
}

// End the game
function endGame() {
    clearInterval(timerInterval);
    setTimeout(() => {
        alert(`Congratulations! You completed the game in ${timer} seconds with a score of ${score}!`);
    }, 500);
}

// Reset the game
resetButton.addEventListener('click', initGame);

// Initialize the game when the page loads
window.addEventListener('load', initGame);

// Create a placeholder for the card back pattern until we have actual images
document.addEventListener('DOMContentLoaded', function() {
    // Create a canvas for the card back pattern
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Draw a pattern similar to what's shown in the image
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
    style.textContent = `.card-back { background-image: url("${dataURL}") !important; }`;
    document.head.appendChild(style);
});