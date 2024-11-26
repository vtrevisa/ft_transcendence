// menu.js

// Get elements from the DOM
const menuContainer = document.getElementById('menuContainer');
const gameContainer = document.getElementById('gameContainer');
const nicknameContainer = document.getElementById('nicknameContainer');
const gameContent = document.getElementById('gameContent');
const scoreDisplay = document.getElementById('score');
const tournamentContainer = document.getElementById('tournamentContainer');
const tournamentBracket = document.getElementById('tournamentBracket');
const loginContainer = document.getElementById('loginContainer');
const signInContainer = document.getElementById('signInContainer');
const guestMenuContainer = document.getElementById('guestMenuContainer');
const gameModeContainer = document.getElementById('gameModeContainer');

// Function to show the login form
function showLogin() {
    hideAllContainers();
    loginContainer.style.display = 'block';
}

// Function to show the sign-in form
function showSignIn() {
    hideAllContainers();
    signInContainer.style.display = 'block';
}

// Function to show the guest menu
function playAsGuest() {
    hideAllContainers();
    guestMenuContainer.style.display = 'block';
}

// Function to return to the main menu
function returnToMenu() {
    hideAllContainers();
    menuContainer.style.display = 'flex';
    resetGame();
}

// Function to hide all containers
function hideAllContainers() {
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => container.style.display = 'none');
    document.querySelector('.button-container').style.display = 'none';
    document.querySelector('.tButton-container').style.display = 'none';
}

// Function to select game mode
function selectMode(mode) {
    hideAllContainers();
    if (mode === 'vsPlayer') {
        nicknameContainer.style.display = 'block';
    } else if (mode === 'tournament') {
        tournamentContainer.style.display = 'block';
    }
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for menu buttons
    document.getElementById('loginButton').addEventListener('click', showLogin);
    document.getElementById('signInButton').addEventListener('click', showSignIn);
    document.getElementById('playAsGuestButton').addEventListener('click', playAsGuest);
    document.getElementById('vsGameButton').addEventListener('click', function() {
        selectMode('vsPlayer');
    });
    document.getElementById('tournamentButton').addEventListener('click', function() {
        selectMode('tournament');
    });
});