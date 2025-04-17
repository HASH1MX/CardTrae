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
    // 12 colors that will be duplicated to create 12 pairs (24 cards total)
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
    const [firstCard, secondCard] = flippedCards;
    
    if (firstCard.dataset.cardName === secondCard.dataset.cardName) {
        // It's a match!
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        // Add match animation
        firstCard.classList.add('match-animation');
        secondCard.classList.add('match-animation');
        
        // Play match sound effect
        playSound('match');
        
        setTimeout(() => {
            firstCard.classList.remove('match-animation');
            secondCard.classList.remove('match-animation');
        }, 1200);
        
        flippedCards = [];
        matchedPairs++;
        score += 10;
        scoreElement.textContent = score;
        
        // Check if all pairs are matched
        if (matchedPairs === cardImages.length / 2) {
            clearInterval(timerInterval);
            setTimeout(() => {
                showGameCompleteMessage();
            }, 800);
        }
    } else {
        // Not a match, flip cards back
        // Play no-match sound effect
        playSound('nomatch');
        
        // Add no-match animation
        firstCard.classList.add('no-match');
        secondCard.classList.add('no-match');
        
        setTimeout(() => {
            firstCard.classList.remove('no-match');
            secondCard.classList.remove('no-match');
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;
    }, 1000);
}

// Play sound effects
function playSound(type) {
    // Create audio context if it doesn't exist
    if (!window.AudioContext && !window.webkitAudioContext) {
        return; // Browser doesn't support Web Audio API
    }
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Create oscillator
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'match') {
        // Happy sound for match
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'nomatch') {
        // Sad sound for no match
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(311.13, audioCtx.currentTime); // Eb4
        oscillator.frequency.setValueAtTime(277.18, audioCtx.currentTime + 0.2); // C#4
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.4);
    }
}

// Reset the game
resetButton.addEventListener('click', initGame);

// Initialize the game when the page loads
window.addEventListener('load', initGame);

// Handle card back image loading
document.addEventListener('DOMContentLoaded', function() {
    // Try to load the card-back image
    const cardBackImg = new Image();
    cardBackImg.src = 'images/card-back.jpg';
    
    // Handle both successful load and error cases
    cardBackImg.onload = function() {
        // Image loaded successfully, but check if it's the SVG data
        if (cardBackImg.width === 0 || cardBackImg.height === 0) {
            // Image might be SVG data stored as a file, create a fallback pattern
            createCardBackPattern();
        }
    };
    
    cardBackImg.onerror = function() {
        // Image failed to load, create a fallback pattern
        createCardBackPattern();
    };
    
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
        style.textContent = `.card-back { background-image: url("${dataURL}") !important; }`;
        document.head.appendChild(style);
    }
};

// Show game completion message
function showGameCompleteMessage() {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    // Add congratulations message
    const congratsHeading = document.createElement('h2');
    congratsHeading.textContent = 'Congratulations!';
    
    const messageText = document.createElement('p');
    messageText.textContent = `You completed the game in ${timer} seconds with a score of ${score}!`;
    
    // Add play again button
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.classList.add('play-again-button');
    playAgainButton.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
        initGame();
    });
    
    // Assemble modal
    modalContent.appendChild(congratsHeading);
    modalContent.appendChild(messageText);
    modalContent.appendChild(playAgainButton);
    modalContainer.appendChild(modalContent);
    
    // Add to body
    document.body.appendChild(modalContainer);
    
    // Add confetti effect
    createConfetti();
}

// Create confetti effect
function createConfetti() {
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 5 + 's';
        
        // Random colors
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            if (document.body.contains(confetti)) {
                document.body.removeChild(confetti);
            }
        }, 8000);
    }
}