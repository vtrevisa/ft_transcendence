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
const updateProfileContainer = document.getElementById('updateProfileContainer');
const profileContainer = document.getElementById('profileContainer');

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

// Function to handle "Play as Guest" button click
function playAsGuest() {
    hideAllContainers();
    gameModeContainer.style.display = 'block';
}

// menu.js

// Function to return to the main menu
function returnToMenu() {
    hideAllContainers();
    checkLoginStatus().then(isLoggedIn => {
        if (isLoggedIn) {
            profileContainer.style.display = 'flex';
        } else {
            menuContainer.style.display = 'block';
        }
    });
}

// Function to hide all containers
function hideAllContainers() {
    if (menuContainer) menuContainer.style.display = 'none';
    if (gameContainer) gameContainer.style.display = 'none';
    if (nicknameContainer) nicknameContainer.style.display = 'none';
    if (gameContent) gameContent.style.display = 'none';
    if (scoreDisplay) scoreDisplay.style.display = 'none';
    if (tournamentContainer) tournamentContainer.style.display = 'none';
    if (tournamentBracket) tournamentBracket.style.display = 'none';
    if (loginContainer) loginContainer.style.display = 'none';
    if (signInContainer) signInContainer.style.display = 'none';
    if (guestMenuContainer) guestMenuContainer.style.display = 'none';
    if (gameModeContainer) gameModeContainer.style.display = 'none';
    if (updateProfileContainer) updateProfileContainer.style.display = 'none';
    if (profileContainer) profileContainer.style.display = 'none';
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

    // Ensure the menu container is displayed initially
    menuContainer.style.display = 'block';
});