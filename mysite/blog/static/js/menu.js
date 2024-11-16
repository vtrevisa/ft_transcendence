// Get elements from the DOM
const menuContainer = document.querySelector('.menu-container');
const gameContainer = document.querySelector('.game-container');
const nicknameContainer = document.getElementById('nicknameContainer');
const gameContent = document.getElementById('gameContent');
const scoreDisplay = document.getElementById('score');
const tournamentContainer = document.getElementById('tournamentContainer');
const tournamentBracket = document.getElementById('tournamentBracket');
const authenticationContainer = document.getElementById('authContainer');

function selectMenu(mode)
{
	if (mode === 'game') {
		menuContainer.style.display = 'none';
		gameContainer.style.display = 'flex';
	} else if (mode === 'account'){
		authenticationContainer.style.display = 'block';
		menuContainer.style.display = 'none';
	}
}

function selectMode(mode)
{
	console.log('selectMode called with mode:', mode); // Debugging log
	if (mode === 'vsPlayer') {
		gameContainer.style.display = 'none';
		nicknameContainer.style.display = 'block';
	} else if (mode === 'tournament') {
		gameContainer.style.display = 'none';
		tournamentContainer.style.display = 'block';
		tournamentBracket.style.display = 'none'; // Ensure the bracket is hidden initially
	}
}

function returnToMenu() {
    // Hide game-specific elements
    document.getElementById('score').style.display = 'none';
    gameContent.style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';
    document.querySelector('.tButton-container').style.display = 'none';
    nicknameContainer.style.display = 'none';
    gameContainer.style.display = 'none';

    // Show the main menu again with initial style
	menuContainer.style.display = 'flex';
    resetGame();
}