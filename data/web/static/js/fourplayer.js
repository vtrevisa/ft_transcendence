// fourplayer.js

// Game variables and canvas setup
const canvas4 = document.getElementById('gameCanvas');
const context4 = canvas4.getContext('2d');
let gameStarted4 = false;
let ball4, paddles4, gameInterval4;
const paddleSpeed4 = 8;
let playerScores4 = [0, 0, 0, 0]; // Scores for 4 players
const maxScore4 = 5;

// Player nicknames
let playerNicknames4 = ["Player 1", "Player 2", "Player 3", "Player 4"];

// Load necessary containers
const fourPlayerNicknameContainer = document.getElementById('fourPlayerNicknameContainer');
const gameContainer4 = document.getElementById('gameContainer');
const scoreDisplay4 = document.getElementById('scoreDisplay');
const buttonContainer4 = document.querySelector('.button-container');

// Function to start the 4-player game
function startFourPlayerGame() {
    playerNicknames4[0] = document.getElementById('player1Nickname4').value || "Player 1";
    playerNicknames4[1] = document.getElementById('player2Nickname4').value || "Player 2";
    playerNicknames4[2] = document.getElementById('player3Nickname4').value || "Player 3";
    playerNicknames4[3] = document.getElementById('player4Nickname4').value || "Player 4";

    fourPlayerNicknameContainer.style.display = 'none';
    gameContainer4.style.display = 'block';
    scoreDisplay4.style.display = 'block';  // Make sure score is visible at the start
    buttonContainer4.style.display = 'block';

    resetGame4();
    draw4();

    gameStarted4 = false;
}

// Function to reset the game
function resetGame4() {
    playerScores4 = [0, 0, 0, 0];
    resetBall4();
    draw4();
    updateScore4();
    if (gameInterval4) {
        clearInterval(gameInterval4);
        gameInterval4 = null; // Clear the interval reference
    }
    gameStarted4 = false; // Ensure gameStarted is set to false
}

// Function to start the game loop
function startGame4() {
    resetGame4();
    draw4();
    if (gameInterval4) clearInterval(gameInterval4);
    gameInterval4 = setInterval(() => updateGame4(), 1000 / 60); // 60 fps
    gameStarted4 = true; // Set gameStarted to true when starting the game
}

// Function to reset the ball and paddles
function resetBall4() {
    ball4 = { x: canvas4.width / 2, y: canvas4.height / 2, vx: 5, vy: 5, radius: 8 };

    paddles4 = [
        // Left paddle (Player 1)
        { x: 10, y: canvas4.height / 2 - 30, width: 10, height: 60 },
        // Right paddle (Player 2)
        { x: canvas4.width - 20, y: canvas4.height / 2 - 30, width: 10, height: 60 },
        // Top paddle (Player 3)
        { x: canvas4.width / 2 - 30, y: 10, width: 60, height: 10 },
        // Bottom paddle (Player 4)
        { x: canvas4.width / 2 - 30, y: canvas4.height - 20, width: 60, height: 10 },
    ];
}

// Function to update the game state
function updateGame4() {
    moveBall4();
    detectCollision4();
    draw4();

    // Check for scoring conditions
    if (ball4.x <= 0) {
        // Left wall - Player 1 loses a point
        playerScores4[0]++;
        updateScore4();
        resetBall4();
    }
    if (ball4.x >= canvas4.width) {
        // Right wall - Player 2 loses a point
        playerScores4[1]++;
        updateScore4();
        resetBall4();
    }
    if (ball4.y <= 0) {
        // Top wall - Player 3 loses a point
        playerScores4[2]++;
        updateScore4();
        resetBall4();
    }
    if (ball4.y >= canvas4.height) {
        // Bottom wall - Player 4 loses a point
        playerScores4[3]++;
        updateScore4();
        resetBall4();
    }

    // Check if any player reached the max score
    for (let i = 0; i < playerScores4.length; i++) {
        if (playerScores4[i] >= maxScore4) {
            endGame4(i);
            return;
        }
    }
}

// Function to move the ball
function moveBall4() {
    ball4.x += ball4.vx;
    ball4.y += ball4.vy;

    // Bounce off walls (if needed)
    if (ball4.x <= ball4.radius || ball4.x >= canvas4.width - ball4.radius) {
        ball4.vx *= -1;
    }
    if (ball4.y <= ball4.radius || ball4.y >= canvas4.height - ball4.radius) {
        ball4.vy *= -1;
    }
}

// Function to detect collisions with paddles
function detectCollision4() {
    // Left paddle (Player 1)
    if (ball4.x - ball4.radius < paddles4[0].x + paddles4[0].width &&
        ball4.y > paddles4[0].y && ball4.y < paddles4[0].y + paddles4[0].height) {
        ball4.vx = Math.abs(ball4.vx); // Ensure ball moves right
    }

    // Right paddle (Player 2)
    if (ball4.x + ball4.radius > paddles4[1].x &&
        ball4.y > paddles4[1].y && ball4.y < paddles4[1].y + paddles4[1].height) {
        ball4.vx = -Math.abs(ball4.vx); // Ensure ball moves left
    }

    // Top paddle (Player 3)
    if (ball4.y - ball4.radius < paddles4[2].y + paddles4[2].height &&
        ball4.x > paddles4[2].x && ball4.x < paddles4[2].x + paddles4[2].width) {
        ball4.vy = Math.abs(ball4.vy); // Ensure ball moves down
    }

    // Bottom paddle (Player 4)
    if (ball4.y + ball4.radius > paddles4[3].y &&
        ball4.x > paddles4[3].x && ball4.x < paddles4[3].x + paddles4[3].width) {
        ball4.vy = -Math.abs(ball4.vy); // Ensure ball moves up
    }
}

// Function to update the score display
function updateScore4() {
    scoreDisplay4.textContent = `${playerNicknames4[0]}: ${playerScores4[0]} | ${playerNicknames4[1]}: ${playerScores4[1]} | ${playerNicknames4[2]}: ${playerScores4[2]} | ${playerNicknames4[3]}: ${playerScores4[3]}`;
}

// Function to draw the game elements
function draw4() {
    context4.clearRect(0, 0, canvas4.width, canvas4.height);

    // Draw ball
    context4.beginPath();
    context4.arc(ball4.x, ball4.y, ball4.radius, 0, Math.PI * 2);
    context4.fillStyle = '#fff';
    context4.fill();

    // Draw paddles
    context4.fillStyle = '#fff';
    // Left paddle
    context4.fillRect(paddles4[0].x, paddles4[0].y, paddles4[0].width, paddles4[0].height);
    // Right paddle
    context4.fillRect(paddles4[1].x, paddles4[1].y, paddles4[1].width, paddles4[1].height);
    // Top paddle
    context4.fillRect(paddles4[2].x, paddles4[2].y, paddles4[2].width, paddles4[2].height);
    // Bottom paddle
    context4.fillRect(paddles4[3].x, paddles4[3].y, paddles4[3].width, paddles4[3].height);
}

// Event listeners for paddle controls
document.addEventListener('keydown', (event) => {
    if (gameStarted4) {
        // Player 1 controls (W/S)
        if (event.key === 'w' && paddles4[0].y > 0) {
            paddles4[0].y -= paddleSpeed4; // Move up
        }
        if (event.key === 's' && paddles4[0].y < canvas4.height - paddles4[0].height) {
            paddles4[0].y += paddleSpeed4; // Move down
        }
        // Player 2 controls (Up/Down arrows)
        if (event.key === 'ArrowUp' && paddles4[1].y > 0) {
            paddles4[1].y -= paddleSpeed4; // Move up
        }
        if (event.key === 'ArrowDown' && paddles4[1].y < canvas4.height - paddles4[1].height) {
            paddles4[1].y += paddleSpeed4; // Move down
        }
        // Player 3 controls (A/D)
        if (event.key === 'a' && paddles4[2].x > 0) {
            paddles4[2].x -= paddleSpeed4; // Move left
        }
        if (event.key === 'd' && paddles4[2].x < canvas4.width - paddles4[2].width) {
            paddles4[2].x += paddleSpeed4; // Move right
        }
        // Player 4 controls (Left/Right arrows)
        if (event.key === 'ArrowLeft' && paddles4[3].x > 0) {
            paddles4[3].x -= paddleSpeed4; // Move left
        }
        if (event.key === 'ArrowRight' && paddles4[3].x < canvas4.width - paddles4[3].width) {
            paddles4[3].x += paddleSpeed4; // Move right
        }
    }
});

// Start the game when spacebar is pressed
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameStarted4) {
        gameStarted4 = true; // Set game as started
        startGame4();
    }
});

// Function to handle the end of the game
function endGame4(winnerIndex) {
    // Handle the end of the game
    const winnerNickname = playerNicknames4[winnerIndex];
    scoreDisplay4.textContent = `${winnerNickname} wins! Final Scores: ${playerNicknames4[0]} ${playerScores4[0]} | ${playerNicknames4[1]} ${playerScores4[1]} | ${playerNicknames4[2]} ${playerScores4[2]} | ${playerNicknames4[3]} ${playerScores4[3]}`;
    clearInterval(gameInterval4);
    gameInterval4 = null; // Clear the interval reference

    buttonContainer4.style.display = 'block';
}
