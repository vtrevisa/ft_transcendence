from django.http import HttpResponse

def home(request):
	html_content = '''
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Pong Online</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
				background-color: #222;
				color: #fff;
			}
			#gameCanvas {
				border: 2px solid #fff;
				background-color: #000;
			}
			#score {
				font-size: 24px;
				margin: 20px 0;
			}
			.nickname-container {
				margin-top: 15px;
				display: none;
			}
			.button-container {
				margin-top: 15px;
				display: none;
			}
			.menu-container {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			button {
				background-color: #28a745;
				color: #fff;
				border: none;
				padding: 10px 20px;
				cursor: pointer;
				font-size: 18px;
				border-radius: 5px;
				margin: 5px;
			}
			button:hover {
				background-color: #218838;
			}
			input {
				padding: 10px;
				font-size: 18px;
				border-radius: 5px;
				border: 1px solid #333;
				margin: 5px;
			}
		</style>
	</head>
	<body>

		<div class="menu-container">
			<h1>Pong Online</h1>
			<button onclick="selectMode('vsPlayer')">VS Player</button>
			<button onclick="selectMode('tournament')">Tournament</button>
		</div>

		<div class="nickname-container" id="nicknameContainer">
			<h2>Enter Player Nicknames</h2>
			<input type="text" id="player1Nickname" placeholder="Player 1 Nickname">
			<input type="text" id="player2Nickname" placeholder="Player 2 Nickname">
			<button onclick="startVsPlayerGame()">Start Game</button>
		</div>

		<div id="gameContent">
			<div id="score"></div>
			<canvas id="gameCanvas" width="600" height="400"></canvas>
		</div>

		<div class="button-container">
			<button onclick="resetGame()">Reset Game</button>
			<button onclick="returnToMenu()">Return to Menu</button>
		</div>

		<script>
			const canvas = document.getElementById('gameCanvas');
			const context = canvas.getContext('2d');
			const scoreDisplay = document.getElementById('score');
			const gameContent = document.getElementById('gameContent');
			const menuContainer = document.querySelector('.menu-container');
			const nicknameContainer = document.getElementById('nicknameContainer');

			// Game variables
			let player1Score = 0;
			let player2Score = 0;
			let ball, player1, player2, gameInterval;
			let player1Nickname = "Player 1";
			let player2Nickname = "Player 2";

			// Control variables
			const paddleSpeed = 12;
			let player1Y = canvas.height / 2 - 30;
			let player2Y = canvas.height / 2 - 30;

			function selectMode(mode) {
				if (mode === 'vsPlayer') {
					menuContainer.style.display = 'none';
					nicknameContainer.style.display = 'block';
				} else if (mode === 'tournament') {
					alert("Tournament mode is under construction!");
				}
			}


			function startVsPlayerGame() {
				player1Nickname = document.getElementById('player1Nickname').value || "Player 1";
				player2Nickname = document.getElementById('player2Nickname').value || "Player 2";
				document.querySelector('.button-container').style.display = 'block';
				nicknameContainer.style.display = 'none';
				gameContent.style.display = 'block';
				startGame();
			}

			function resetGame() {
				player1Score = 0;
				player2Score = 0;
				resetBall();
				draw();
				updateScore();
			}

			function startGame() {
				resetGame();
				draw();
				if (gameInterval) clearInterval(gameInterval);
				gameInterval = setInterval(updateGame, 1000 / 60); // 60 fps
			}
			
			const maxScore = 5;

			function updateGame() {
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
			// Ball and paddles setup
			function resetBall() {
				ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 2, vy: 2, radius: 8 };
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

			// Move paddles with keyboard
			document.addEventListener('keydown', (event) => {
				if (event.key === 'ArrowUp' && player1Y > 0) {
					player1Y -= paddleSpeed; // Move player 1 up
				}
				if (event.key === 'ArrowDown' && player1Y < canvas.height - player1.height) {
					player1Y += paddleSpeed; // Move player 1 down
				}
				if (event.key === 'w' && player2Y > 0) {
					player2Y -= paddleSpeed; // Move player 2 up
				}
				if (event.key === 's' && player2Y < canvas.height - player2.height) {
					player2Y += paddleSpeed; // Move player 2 down
				}
			});

			//start game with space bar
			document.addEventListener('keydown', (event) => {
				if (event.key === ' ' && !gameStarted) {
					gameStarted = true;
					startGame();
				}
			});

			function returnToMenu()
			{
				// Stop the game loop if it's running
				if (gameInterval) 
				{
					clearInterval(gameInterval);
					gameInterval = null; // Clear the interval reference
				}

				// Hide the game content and nickname input
				gameContent.style.display = 'none';
				nicknameContainer.style.display = 'none';

				// Show the main menu again
				menuContainer.style.display = 'block';

				// Reset scores and ball position
				player1Score = 0;
				player2Score = 0;
				resetBall();
				updateScore();
			}
			window.onload = () => {
				resetBall(); // Set initial position of ball and paddles
				draw(); // Draw initial game state with paddles and ball
			};
		</script>

	</body>
	</html>
	'''
	return HttpResponse(html_content)
