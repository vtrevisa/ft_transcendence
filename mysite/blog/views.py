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
			.button-container {
				margin-top: 15px;
			}
			button {
				background-color: #28a745;
				color: #fff;
				border: none;
				padding: 10px 20px;
				cursor: pointer;
				font-size: 18px;
				border-radius: 5px;
			}
			button:hover {
				background-color: #218838;
			}
		</style>
	</head>
	<body>

		<h1>Pong Online</h1>
		<div id="score">Player 1: 0 | Player 2: 0</div>
		<canvas id="gameCanvas" width="600" height="400"></canvas>
		<div class="button-container">
			<button onclick="startGame()">Start Game</button>
			<button onclick="resetGame()">Reset Game</button>
		</div>

		<script>
			const canvas = document.getElementById('gameCanvas');
			const context = canvas.getContext('2d');
			const scoreDisplay = document.getElementById('score');

			// Game variables
			let player1Score = 0;
			let player2Score = 0;
			let ball, player1, player2, gameInterval;

			// Control variables
			const paddleSpeed = 4;
			let player1Y = canvas.height / 2 - 30;
			let player2Y = canvas.height / 2 - 30;

			function resetGame() {
				player1Score = 0;
				player2Score = 0;
				resetBall();
				draw();
				updateScore();
			}

			function startGame() {
				resetGame();
				if (gameInterval) clearInterval(gameInterval);
				gameInterval = setInterval(updateGame, 1000 / 60); // 60 fps
			}

			function updateGame() {
				moveBall();
				detectCollision();
				draw();
			}

			// Ball and paddles setup
			function resetBall() {
				ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 4, vy: 4, radius: 8 };
				player1 = { x: 10, y: player1Y, width: 10, height: 60 };
				player2 = { x: canvas.width - 20, y: player2Y, width: 10, height: 60 };
			}

			function moveBall() {
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
			}

			function detectCollision() {
				// Player 1 paddle collision
				if (ball.x - ball.radius < player1.x + player1.width &&
					ball.y > player1.y && ball.y < player1.y + player1.height) {
					ball.vx *= -1;
				}

				// Player 2 paddle collision
				if (ball.x + ball.radius > player2.x &&
					ball.y > player2.y && ball.y < player2.y + player2.height) {
					ball.vx *= -1;
				}
			}

			function updateScore() {
				scoreDisplay.textContent = `Player 1: ${player1Score} | Player 2: ${player2Score}`;
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

			// Initialize the game
			resetGame();

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
		</script>

	</body>
	</html>
	'''
	return HttpResponse(html_content)
