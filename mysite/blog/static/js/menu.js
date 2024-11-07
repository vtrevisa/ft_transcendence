// Get elements from the DOM
const menuContainer = document.querySelector('.menu-container');
const nicknameContainer = document.getElementById('nicknameContainer');
const gameContent = document.getElementById('gameContent');
const scoreDisplay = document.getElementById('score');
const tournamentContainer = document.getElementById('tournamentContainer');
const tournamentBracket = document.getElementById('tournamentBracket');

function selectMode(mode)
{
	console.log('selectMode called with mode:', mode); // Debugging log
	if (mode === 'vsPlayer') {
		menuContainer.style.display = 'none';
		nicknameContainer.style.display = 'block';
	} else if (mode === 'tournament') {
		menuContainer.style.display = 'none';
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

    // Show the main menu again with initial style
    menuContainer.style.display = 'flex';
    resetGame();
}