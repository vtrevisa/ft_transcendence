// Game variables and canvas setup
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
let player1Score = 0;
let player2Score = 0;
let player1Nickname = "Player 1";
let player2Nickname = "Player 2";
let gameStarted = false;
let ball, player1, player2, gameInterval;

const paddleSpeed = 12;
let player1Y = canvas.height / 2 - 30;
let player2Y = canvas.height / 2 - 30;
const maxScore = 5;

function startVsPlayerGame()
{
	player1Nickname = document.getElementById('player1Nickname').value || "Player 1";
	player2Nickname = document.getElementById('player2Nickname').value || "Player 2";
	document.querySelector('.button-container').style.display = 'block';
	nicknameContainer.style.display = 'none';
	gameContent.style.display = 'block';
	scoreDisplay.style.display = 'block';  // Make sure score is visible at the start

	resetGame();
	draw();

	gameStarted = false;
}

function resetGame()
{
	player1Score = 0;
	player2Score = 0;
	resetBall();
	// Reset paddle positions
	player1Y = canvas.height / 2 - player1.height / 2;
	player2Y = canvas.height / 2 - player2.height / 2;
	draw();
	updateScore();
	if (gameInterval)
	{
		clearInterval(gameInterval);
		gameInterval = null; // Clear the interval reference
		gameStarted = false; // Set game as not started
	}
}

function startGame()
{
	resetGame();
	draw();
	if (gameInterval) clearInterval(gameInterval);
	gameInterval = setInterval(updateGame, 1000 / 60); // 60 fps
}

function updateGame()
{
	moveBall();
	detectCollision();
	draw();

	if (player1Score >= maxScore || player2Score >= maxScore)
	{
		const winner = player1Score >= maxScore ? player1Nickname : player2Nickname;
		scoreDisplay.textContent = `${winner} wins! Final Score: ${player1Nickname} ${player1Score} - ${player2Nickname} ${player2Score}`;

		clearInterval(gameInterval);
		gameInterval = null; // Clear the interval reference

	return;
	}
	updateScore(); // Update score display if game is still ongoing
}

function resetBall()
{
	ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 2, vy: 2, radius: 8 };
	player1 = { x: 10, y: player1Y, width: 10, height: 60 };
	player2 = { x: canvas.width - 20, y: player2Y, width: 10, height: 60 };
}

function moveBall()
{
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

function detectCollision()
{
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

function updateScore()
{
	scoreDisplay.textContent = `${player1Nickname}: ${player1Score} | ${player2Nickname}: ${player2Score}`;
}

function draw()
{
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
	if (event.key === 'w' && player1Y > 0) {
		player1Y -= paddleSpeed; // Move player 1 up
	}
	if (event.key === 's' && player1Y < canvas.height - player1.height) {
		player1Y += paddleSpeed; // Move player 1 down
	}
	if (event.key === 'ArrowUp' && player2Y > 0) {
		player2Y -= paddleSpeed; // Move player 2 up
	}
	if (event.key === 'ArrowDown' && player2Y < canvas.height - player2.height) {
		player2Y += paddleSpeed; // Move player 2 down
	}
});

document.addEventListener('keydown', (event) => {
	if (event.code === 'Space' && !gameStarted) {
		gameStarted = true; // Set game as started
		startGame(); // Start the game loop
	}
	});