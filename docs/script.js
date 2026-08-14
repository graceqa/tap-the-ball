const BACKGROUND_IMAGES = [
    'magic-eye-stereograms-1.jpg',
    'magic-eye-stereograms-2.jpg',
    'magiceye2.jpg',
    'the-most-in-depth-realistic-magic-eye-ive-found-v0-92nqho9i3dcf1.jpeg.webp'
];

function setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    const randomImage = BACKGROUND_IMAGES[randomIndex];
    document.body.style.backgroundImage = `url('${randomImage}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
}

setRandomBackground();

const gameFrame = document.getElementById('game-frame');
const startBtn = document.getElementById('start-btn');
const missedBallsDisplay = document.getElementById('missed-balls');
const messageDisplay = document.getElementById('message');

let missedBalls = 0;
let gameInterval;
let ballsOnScreen = 0;
let spawnRate = 1000;
let maxBalls = 1;
let ballLifetime = 2000;
let timeElapsed = 0;
let gameTimer;
let isGameOver = false;

const RAINBOW_COLORS = [
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', 
    '#4B0082', '#9400D3', '#FF00FF', '#00FFFF', '#FF1493', 
    '#32CD32', '#FFD700', '#FF4500', '#1E90FF', '#008080'
];

const CONGRATS_PHRASES = [
    "Great effort!",
    "Nice shot!",
    "Smooth move!",
    "Well played!",
    "Nice try!",
    "Excellent game!",
    "Superb!"
];

startBtn.addEventListener('click', startGame);

function startGame() {
    missedBalls = 0;
    ballsOnScreen = 0;
    spawnRate = 1000;
    maxBalls = 1;
    ballLifetime = 2000;
    timeElapsed = 0;
    isGameOver = false;
    missedBallsDisplay.textContent = 'Missed balls: 0';
    messageDisplay.textContent = '';
    startBtn.style.visibility = 'hidden'; // Use visibility to prevent layout shift
    gameFrame.innerHTML = '';
    gameFrame.classList.remove('game-over');
    gameInterval = setInterval(gameLoop, spawnRate);
    gameTimer = setInterval(increaseDifficultyOverTime, 1000);
}

function gameLoop() {
    if (ballsOnScreen < maxBalls) {
        createBall();
    }
}

function createBall() {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    
    const ballSize = 8 * Math.min(window.innerWidth, window.innerHeight) / 100;
    let x, y, isValidPosition;
    let maxRetries = 20;
    let retries = 0;

    do {
        x = Math.random() * (gameFrame.clientWidth - ballSize);
        y = Math.random() * (gameFrame.clientHeight - ballSize);
        isValidPosition = true;
        const existingBalls = document.querySelectorAll('.ball');
        for (const existingBall of existingBalls) {
            const existingX = parseFloat(existingBall.style.left);
            const existingY = parseFloat(existingBall.style.top);
            const distance = Math.sqrt(Math.pow(x - existingX, 2) + Math.pow(y - existingY, 2));
            if (distance < ballSize) { // Use dynamic ballSize
                isValidPosition = false;
                break;
            }
        }
        retries++;
    } while (!isValidPosition && retries < maxRetries);

    if (!isValidPosition) {
        return;
    }

    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    const randomColor = RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)];
    ball.style.backgroundColor = randomColor;

    ball.addEventListener('click', () => {
        ball.remove();
        ballsOnScreen--;
    });

    gameFrame.appendChild(ball);
    ballsOnScreen++;

    setTimeout(() => {
        if (isGameOver) return;
        if (gameFrame.contains(ball)) {
            ball.remove();
            missedBalls++;
            missedBallsDisplay.textContent = `Missed balls: ${missedBalls}`;
            ballsOnScreen--;
            if (missedBalls >= 15) {
                endGame();
            }
        }
    }, ballLifetime);
}

function increaseDifficultyOverTime() {
    timeElapsed++;
    if (timeElapsed >= 30 && timeElapsed % 10 === 0) {
        if (spawnRate > 200) {
            spawnRate -= 100;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, spawnRate);
        }
        if (ballLifetime > 600) {
            ballLifetime -= 200;
        }
        if (maxBalls < 5) {
            maxBalls++;
        }
    }
}

function endGame() {
    if (isGameOver) {
        return; // Game is already over
    }
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(gameTimer);
    gameFrame.classList.add('game-over');

    const gameOverContainer = document.createElement('div');
    gameOverContainer.classList.add('game-over-container');

    const gameOverTitle = document.createElement('div');
    gameOverTitle.classList.add('game-over-title');
    gameOverTitle.textContent = 'GAME OVER';

    const randomPhrase = CONGRATS_PHRASES[Math.floor(Math.random() * CONGRATS_PHRASES.length)];
    const congratsText = document.createElement('div');
    congratsText.classList.add('congrats-text');
    congratsText.textContent = randomPhrase;

    gameOverContainer.appendChild(gameOverTitle);
    gameOverContainer.appendChild(congratsText);
    gameFrame.appendChild(gameOverContainer);

    startBtn.style.visibility = 'visible'; // Make button visible again
}