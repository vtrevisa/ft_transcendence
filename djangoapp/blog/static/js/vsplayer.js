// vsplayer.js

// Game variables and canvas setup
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
let player1Score = 0;
let player2Score = 0;
let player1Nickname = "Player 1";
let player2Nickname = "Player 2";
let gameStarted = false;
let balls = [];
let player1, player2;
window.isTournamentMode = false; // Define isTournamentMode globally

const defaultPaddleSpeed = 12;
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

// Initialize game settings
let gameSettings = {
    enableObstacles: false,
    enableMultipleBalls: false,
    numberOfBalls: 1,
    ballSpeed: 10,
    paddleSpeed: 12
};

async function startVsPlayerGame(tournamentMode = false) {
    window.isTournamentMode = tournamentMode;
    player1Nickname = document.getElementById('player1Nickname').value || "Player 1";
    player2Nickname = document.getElementById('player2Nickname').value || "Player 2";

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
    gameStarted = false; // Ensure gameStarted is set to false
}

// Function to start the game with the current settings
function startGame() {
    if (window.gameSettings) {
        gameSettings = window.gameSettings;
    }

    console.log('Game Settings:');
    console.log('Enable Obstacles:', gameSettings.enableObstacles);
    console.log('Enable Multiple Balls:', gameSettings.enableMultipleBalls);
    console.log('Number of Balls:', gameSettings.numberOfBalls);
    console.log('Ball Speed:', gameSettings.ballSpeed);
    console.log('Paddle Speed:', gameSettings.paddleSpeed);

    resetBall(); // Initialize balls with the current settings
    player1.speed = gameSettings.paddleSpeed;
    player2.speed = gameSettings.paddleSpeed;

    gameStarted = true;
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (gameStarted) {
        updateGame();
        requestAnimationFrame(gameLoop);
    }
}

function updateGame() {
    moveBall();
    detectCollision();
    draw();
    if (player1Score >= maxScore || player2Score >= maxScore) {
        gameStarted = false;
        if (window.isTournamentMode)
            endTournamentGame();
        else
            endGame();
        return;
    }
    updateScore(); // Update score display if game is still ongoing
}

function resetBall() {
    balls = []; // Array to hold multiple balls

    for (let i = 0; i < (gameSettings.enableMultipleBalls ? gameSettings.numberOfBalls : 1); i++) {
        const ball = { 
            x: canvas.width / 2, 
            y: canvas.height / 2, 
            radius: 8 
        };

        // Set random direction for ball velocity
        const speed = gameSettings.ballSpeed; // Use the ball speed from settings
        const angle = Math.random() * Math.PI * 2; // Random angle in radians

        ball.vx = speed * Math.cos(angle);
        ball.vy = speed * Math.sin(angle);

        balls.push(ball);
    }

    player1 = { x: 10, y: player1Y, width: 10, height: 60, speed: gameSettings.paddleSpeed };
    player2 = { x: canvas.width - 20, y: player2Y, width: 10, height: 60, speed: gameSettings.paddleSpeed };
}

function moveBall() {
    balls.forEach(ball => {
        ball.x += ball.vx;
        ball.y += ball.vy;

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
    });

    // Update paddle positions
    player1.y = player1Y;
    player2.y = player2Y;
}

function detectCollision() {
    balls.forEach(ball => {
        // Check collision with player 1 paddle
        if (ball.x - ball.radius < player1.x + player1.width &&
            ball.x + ball.radius > player1.x &&
            ball.y - ball.radius < player1.y + player1.height &&
            ball.y + ball.radius > player1.y) {
            ball.vx *= -1; // Reverse ball direction
            ball.x = player1.x + player1.width + ball.radius; // Adjust ball position
        }

        // Check collision with player 2 paddle
        if (ball.x - ball.radius < player2.x + player2.width &&
            ball.x + ball.radius > player2.x &&
            ball.y - ball.radius < player2.y + player2.height &&
            ball.y + ball.radius > player2.y) {
            ball.vx *= -1; // Reverse ball direction
            ball.x = player2.x - ball.radius; // Adjust ball position
        }

        // Check collision with obstacles if enabled
        if (gameSettings.enableObstacles) {
            const obstacleWidth = 20;
            const obstacleHeight = 60;
            const obstacleX = canvas.width / 2 - obstacleWidth / 2;
            const topObstacleY = canvas.height / 4 - obstacleHeight / 2;
            const bottomObstacleY = (3 * canvas.height) / 4 - obstacleHeight / 2;

            // Top obstacle collision
            if (ball.x + ball.radius > obstacleX && ball.x - ball.radius < obstacleX + obstacleWidth &&
                ball.y + ball.radius > topObstacleY && ball.y - ball.radius < topObstacleY + obstacleHeight) {
                ball.vx *= -1; // Reverse ball direction
            }

            // Bottom obstacle collision
            if (ball.x + ball.radius > obstacleX && ball.x - ball.radius < obstacleX + obstacleWidth &&
                ball.y + ball.radius > bottomObstacleY && ball.y - ball.radius < bottomObstacleY + obstacleHeight) {
                ball.vx *= -1; // Reverse ball direction
            }
        }
    });
}

function updateScore() {
    scoreDisplay.textContent = `${player1Nickname}: ${player1Score} | ${player2Nickname}: ${player2Score}`;
}

function draw() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each ball
    balls.forEach(ball => {
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    });

    // Draw paddles
    context.fillStyle = "#0095DD";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Draw net
    context.fillStyle = "#0095DD";
    context.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);

    // Draw obstacles if enabled
    if (gameSettings.enableObstacles) {
        const obstacleWidth = 20;
        const obstacleHeight = 60;
        const obstacleX = canvas.width / 2 - obstacleWidth / 2;
        const topObstacleY = canvas.height / 4 - obstacleHeight / 2;
        const bottomObstacleY = (3 * canvas.height) / 4 - obstacleHeight / 2;

        context.fillStyle = "#FF0000"; // Red color for obstacles
        context.fillRect(obstacleX, topObstacleY, obstacleWidth, obstacleHeight);
        context.fillRect(obstacleX, bottomObstacleY, obstacleWidth, obstacleHeight);
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && !gameStarted) {
        startGame();
    }
    if (gameStarted) {
        if (event.key === 'w' && player1Y > 0) {
            player1Y -= gameSettings.paddleSpeed; // Move player 1 up
        }
        if (event.key === 's' && player1Y < canvas.height - 60) { // Use the actual paddle height
            player1Y += gameSettings.paddleSpeed; // Move player 1 down
        }
        if (event.key === 'ArrowUp' && player2Y > 0) {
            player2Y -= gameSettings.paddleSpeed; // Move player 2 up
        }
        if (event.key === 'ArrowDown' && player2Y < canvas.height - 60) { // Use the actual paddle height
            player2Y += gameSettings.paddleSpeed; // Move player 2 down
        }
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
    gameStarted = false;
    // Determine the outcome
    const player1_won = player1Score >= maxScore;
    const outcome = player1_won ? 'won' : 'lost';
    const winner = player1_won ? player1Nickname : player2Nickname;

    // Retrieve match information
    const matchTime = new Date().toISOString(); // Format the date correctly
    const matchScore = `${player1Score} - ${player2Score}`;

    // Print information on the console
    console.log(`Player 1 (Nickname: ${player1Nickname}) ${outcome} the match.`);
    console.log(`Match Score: ${matchScore}`);
    console.log(`Match Time: ${matchTime}`);
    console.log(`Player 2 (Nickname: ${player2Nickname})`);

    // Retrieve usernames from nicknames
    const player1Username = nicknameToUsernameMap[player1Nickname];

    // Update status counter
    updateStatusCounter(player1Username, outcome);

    // Record game history
    recordGameHistory(player1Username, player2Nickname, winner, matchTime, matchScore);

    // Handle the end of the game
    scoreDisplay.textContent = `${player1_won ? player1Nickname : player2Nickname} wins! Final Score: ${player1Nickname} ${player1Score} - ${player2Nickname} ${player2Score}`;

    if (window.isTournamentMode) {
        endTournamentGame();
    } else {
        buttonContainer.style.display = 'block';
        tButtonContainer.style.display = 'none';
    }
}