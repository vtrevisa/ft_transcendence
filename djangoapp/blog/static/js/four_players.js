// Variables for 4 players
let player3, player4;
let player3Score = 0;
let player4Score = 0;
let player3Y = canvas.height / 2 - 30;
let player4Y = canvas.height / 2 - 30;
let player3Nickname = "Player 3";
let player4Nickname = "Player 4";

async function startFourPlayersGame() {
  player1Nickname = document.getElementById('player1Nickname').value || "Player 1";
  player2Nickname = document.getElementById('player2Nickname').value || "Player 2";
  player3Nickname = document.getElementById('player3Nickname').value || "Player 3";
  player4Nickname = document.getElementById('player4Nickname').value || "Player 4";

  nicknameContainer.style.display = 'none';
  gameContainer.style.display = 'block';
  scoreDisplay.style.display = 'block';

  resetFourPlayersGame();
  drawFourPlayers();

  gameStarted = false;
}

function resetFourPlayersGame() {
  player1Score = 0;
  player2Score = 0;
  player3Score = 0;
  player4Score = 0;
  resetBall();
  // Reset paddle positions
  player1Y = canvas.height / 2 - player1.height / 2;
  player2Y = canvas.height / 2 - player2.height / 2;
  player3Y = canvas.height / 2 - player3.height / 2;
  player4Y = canvas.height / 2 - player4.height / 2;
  drawFourPlayers();
  updateFourPlayersScore();
  if (gameInterval) {
      clearInterval(gameInterval);
      gameInterval = null; // Clear the interval reference
  }
  gameStarted = false; // Ensure gameStarted is set to false
}

function startFourPlayers() {
  resetFourPlayersGame();
  drawFourPlayers();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(() => updateFourPlayersGame(), 1000 / 60); // 60 fps
  gameStarted = true; // Set gameStarted to true when starting the game
}

function updateFourPlayersGame() {
  moveBall();
  detectFourPlayersCollision();
  drawFourPlayers();
  if (player1Score >= maxScore || player2Score >= maxScore || player3Score >= maxScore || player4Score >= maxScore) {
      endFourPlayersGame();
      return;
  }
  updateFourPlayersScore(); // Update score display if game is still ongoing
}

function detectFourPlayersCollision() {
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

  // Player 3 paddle collision
  if (ball.y - ball.radius < player3.y + player3.height &&
      ball.x > player3.x && ball.x < player3.x + player3.width) {
      ball.vy = Math.abs(ball.vy); // Ensure ball moves down
  }

  // Player 4 paddle collision
  if (ball.y + ball.radius > player4.y &&
      ball.x > player4.x && ball.x < player4.x + player4.width) {
      ball.vy = -Math.abs(ball.vy); // Ensure ball moves up
  }
}

function drawFourPlayers() {
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
  context.fillRect(player3.x, player3Y, player3.width, player3.height);
  context.fillRect(player4.x, player4Y, player4.width, player4.height);
}

function updateFourPlayersScore() {
  scoreDisplay.textContent = `${player1Nickname}: ${player1Score} | ${player2Nickname}: ${player2Score} | ${player3Nickname}: ${player3Score} | ${player4Nickname}: ${player4Score}`;
}

function endFourPlayersGame() {
  let winner;
  if (player1Score >= maxScore) winner = player1Nickname;
  else if (player2Score >= maxScore) winner = player2Nickname;
  else if (player3Score >= maxScore) winner = player3Nickname;
  else if (player4Score >= maxScore) winner = player4Nickname;

  scoreDisplay.textContent = `${winner} wins! Final Score: ${player1Nickname} ${player1Score} - ${player2Nickname} ${player2Score} - ${player3Nickname} ${player3Score} - ${player4Nickname} ${player4Score}`;
  clearInterval(gameInterval);
  gameInterval = null; // Clear the interval reference
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
      if (event.key === 'a' && player3Y > 0) {
          player3Y -= paddleSpeed; // Move player 3 left
      }
      if (event.key === 'd' && player3Y < canvas.height - 60) { // Use the actual paddle height
          player3Y += paddleSpeed; // Move player 3 right
      }
      if (event.key === 'ArrowLeft' && player4Y > 0) {
          player4Y -= paddleSpeed; // Move player 4 left
      }
      if (event.key === 'ArrowRight' && player4Y < canvas.height - 60) { // Use the actual paddle height
          player4Y += paddleSpeed; // Move player 4 right
      }
  }
});
