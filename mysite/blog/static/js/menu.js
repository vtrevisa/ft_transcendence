// Get elements from the DOM
const menuContainer = document.querySelector('.menu-container');
const nicknameContainer = document.getElementById('nicknameContainer');
const gameContent = document.getElementById('gameContent');
const scoreDisplay = document.getElementById('score');

function selectMode(mode)
{
	if (mode === 'vsPlayer') {
		menuContainer.style.display = 'none';
		nicknameContainer.style.display = 'block';
	} else if (mode === 'tournament') {
		alert("Tournament mode is under construction!");
	}
}

function returnToMenu()
{
	// Hide game-specific elements
	document.getElementById('score').style.display = 'none';
	gameContent.style.display = 'none';
	document.querySelector('.button-container').style.display = 'none';
	nicknameContainer.style.display = 'none';

	// Show the main menu again with initial style
	menuContainer.style.display = 'flex';
	resetGame();
}

window.onload = () => {
	resetBall(); // Set initial position of ball and paddles
	draw(); // Draw initial game state with paddles and ball
};