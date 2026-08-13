const gameFrame = document.getElementById('game-frame');
const startBtn = document.getElementById('start-btn');
const missedBallsDisplay = document.getElementById('missed-balls');
const messageDisplay = document.getElementById('message');

let missedBalls = 0;
let gameInterval;
let ballsOnScreen = 0;
let spawnRate = 500;
let maxBalls = 1;
let ballLifetime = 2000;

startBtn.addEventListener('click', startGame);

function startGame() {
    missedBalls = 0;
    ballsOnScreen = 0;
    spawnRate = 500;
    maxBalls = 1;
    ballLifetime = 2000;
    missedBallsDisplay.textContent = 'Missed balls: 0';
    messageDisplay.textContent = '';
    startBtn.style.display = 'none';
    gameFrame.innerHTML = '';
    gameInterval = setInterval(gameLoop, spawnRate);
}

function gameLoop() {
    if (ballsOnScreen < maxBalls) {
        createBall();
    }
}

function createBall() {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    const x = Math.random() * (gameFrame.clientWidth - 50);
    const y = Math.random() * (gameFrame.clientHeight - 50);
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    ball.addEventListener('click', () => {
        ball.remove();
        ballsOnScreen--;
    });

    gameFrame.appendChild(ball);
    ballsOnScreen++;

    setTimeout(() => {
        if (gameFrame.contains(ball)) {
            ball.remove();
            missedBalls++;
            missedBallsDisplay.textContent = `Missed balls: ${missedBalls}`;
            ballsOnScreen--;
            increaseDifficulty();
            if (missedBalls >= 15) {
                endGame();
            }
        }
    }, ballLifetime);
}

function increaseDifficulty() {
    if (missedBalls > 0 && missedBalls % 5 === 0) {
        if (spawnRate > 100) {
            spawnRate -= 50;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, spawnRate);
        }
        if (ballLifetime > 500) {
            ballLifetime -= 250;
        }
        if (maxBalls < 3) {
            maxBalls++;
        }
    }
}

function endGame() {
    clearInterval(gameInterval);
    messageDisplay.textContent = 'Nice try!';
    startBtn.style.display = 'block';
}