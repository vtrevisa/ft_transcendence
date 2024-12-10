// vsplayer.js

// Game variables and canvas setup
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
let player1Score = 0;
let player2Score = 0;
let player1Nickname = "Player 1";
let player2Nickname = "Player 2";
let gameStarted = false;
let ball, player1, player2, gameInterval;
window.isTournamentMode = false; // Define isTournamentMode globally

const paddleSpeed = 12;
let player1Y = canvas.height / 2 - 30;
let player2Y = canvas.height / 2 - 30;
const maxScore = 5;

// Load all necessary containers
const nicknameContainer = document.getElementById('nicknameContainer');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('scoreDisplay');
const buttonContainer = document.querySelector('.button-container');
const tButtonContainer = document.querySelector('.tButton-container');

// Global mapping object
const nicknameToUsernameMap = {};

async function startVsPlayerGame(tournamentMode = false) {
    window.isTournamentMode = tournamentMode;
    const player1Nickname = document.getElementById('player1Nickname').value || "Player 1";
    const player2Nickname = document.getElementById('player2Nickname').value || "Player 2";

    // Fetch username for Player 1 from the server
    const player1Username = await fetchUsernameByNickname(player1Nickname);

    // Populate the mapping object
    nicknameToUsernameMap[player1Nickname] = player1Username;

    nicknameContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    scoreDisplay.style.display = 'block';  // Make sure score is visible at the start

    if (window.isTournamentMode) {
        buttonContainer.style.display = 'none';
        tButtonContainer.style.display = 'none';
    } else {
        buttonContainer.style.display = 'block';
        tButtonContainer.style.display = 'none';
    }

    resetGame();
    draw();

    gameStarted = false;
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    resetBall();
    // Reset paddle positions
    player1Y = canvas.height / 2 - player1.height / 2;
    player2Y = canvas.height / 2 - player2.height / 2;
    draw();
    updateScore();
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null; // Clear the interval reference
    }
    gameStarted = false; // Ensure gameStarted is set to false
}

function startGame() {
    resetGame();
    draw();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => updateGame(), 1000 / 60); // 60 fps
    gameStarted = true; // Set gameStarted to true when starting the game
}

// Update the updateGame function to call endGame when the game ends
function updateGame() {
    moveBall();
    detectCollision();
    draw();
    if (player1Score >= maxScore || player2Score >= maxScore) {
        if (window.isTournamentMode)
            endTournamentGame();
        else
            endGame();
        return;
    }
    updateScore(); // Update score display if game is still ongoing
}

function resetBall() {
    ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 10, vy: 10, radius: 8 };
    player1 = { x: 10, y: player1Y, width: 10, height: 60 };
    player2 = { x: canvas.width - 20, y: player2Y, width: 10, height: 60 };
}

function moveBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Update paddle positions
    player1.y = player1Y;
    player2.y = player2Y;

    // Bounce off top and bottom walls
    if (ball.y <= ball.radius || ball.y >= canvas.height - ball.radius) {
        ball.vy *= -1;
    }

    // Left and right scoring
    if (ball.x <= 0) {
        player2Score++;
        updateScore();
        resetBall();
    }
    if (ball.x >= canvas.width) {
        player1Score++;
        updateScore();
        resetBall();
    }
}

function detectCollision() {
    // Player 1 paddle collision
    if (ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y && ball.y < player1.y + player1.height) {
        ball.vx = Math.abs(ball.vx); // Ensure ball moves right
    }

    // Player 2 paddle collision
    if (ball.x + ball.radius > player2.x &&
        ball.y > player2.y && ball.y < player2.y + player2.height) {
        ball.vx = -Math.abs(ball.vx); // Ensure ball moves left
    }
}

function updateScore() {
    const player1Nickname = window.player1Nickname || "Player 1";
    const player2Nickname = window.player2Nickname || "Player 2";
    scoreDisplay.textContent = `${player1Nickname}: ${player1Score} | ${player2Nickname}: ${player2Score}`;
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = '#fff';
    context.fill();

    // Draw paddles
    context.fillStyle = '#fff';
    context.fillRect(player1.x, player1Y, player1.width, player1.height);
    context.fillRect(player2.x, player2Y, player2.width, player2.height);
}

document.addEventListener('keydown', (event) => {
    if (gameStarted) {
        if (event.key === 'w' && player1Y > 0) {
            player1Y -= paddleSpeed; // Move player 1 up
        }
        if (event.key === 's' && player1Y < canvas.height - 60) { // Use the actual paddle height
            player1Y += paddleSpeed; // Move player 1 down
        }
        if (event.key === 'ArrowUp' && player2Y > 0) {
            player2Y -= paddleSpeed; // Move player 2 up
        }
        if (event.key === 'ArrowDown' && player2Y < canvas.height - 60) { // Use the actual paddle height
            player2Y += paddleSpeed; // Move player 2 down
        }
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameStarted) {
        gameStarted = true; // Set game as started
        startGame(); // Start the game loop with tournament mode
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        console.log('Canvas element found:', canvas);
        const context = canvas.getContext('2d');
        const height = canvas.height; // Ensure canvas is defined
        const width = canvas.width; // Ensure canvas is defined

        console.log('Canvas height:', height);
        console.log('Canvas width:', width);

        // Example of drawing something on the canvas
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);

        // Other game-related code...
    } else {
        console.error('Canvas element not found');
    }
});

function endGame() {
    // Retrieve player nicknames
    const player1Nickname = document.getElementById('player1Nickname').value;
    const player2Nickname = document.getElementById('player2Nickname').value;

    // Retrieve the correct username for Player 1 using the mapping object
    const player1Username = nicknameToUsernameMap[player1Nickname];

    // Determine the outcome
    const player1_won = player1Score >= maxScore;
    const outcome = player1_won ? 'won' : 'lost';
    const winner = player1_won ? player1Username : player2Nickname;

    // Retrieve match information
    const matchTime = new Date().toISOString(); // Format the date correctly
    const matchScore = `${player1Score} - ${player2Score}`;

    // Print information on the console
    console.log(`Player 1 (Username: ${player1Username}, Nickname: ${player1Nickname}) ${outcome} the match.`);
    console.log(`Match Score: ${matchScore}`);
    console.log(`Match Time: ${matchTime}`);
    console.log(`Player 2 (Nickname: ${player2Nickname})`);

    // Update status counter
    updateStatusCounter(player1Username, outcome);

    // Record game history
    recordGameHistory(player1Username, player2Nickname, winner, matchTime, matchScore);

    // Handle the end of the game
    scoreDisplay.textContent = `${player1_won ? player1Nickname : player2Nickname} wins! Final Score: ${player1Nickname} ${player1Score} - ${player2Nickname} ${player2Score}`;
    clearInterval(gameInterval);
    gameInterval = null; // Clear the interval reference

    if (window.isTournamentMode) {
        endTournamentGame();
    } else {
        buttonContainer.style.display = 'block';
        tButtonContainer.style.display = 'none';
    }
}