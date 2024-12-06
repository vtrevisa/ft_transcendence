// menu.js

// Function to show the login form
function showLogin() {
    console.log('showLogin called');
    hideAllContainers();
    document.getElementById('loginContainer').style.display = 'block';
}

// Function to show the sign-in form
function showSignIn() {
    console.log('showSignIn called');
    hideAllContainers();
    document.getElementById('signInContainer').style.display = 'block';
}

// Function to handle sign-in form submission
async function handleSignIn(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('signInForm'));
    const csrfToken = getCookie('csrftoken');
    console.log('Form Data:', formData); // Debugging log
    console.log('CSRF Token:', csrfToken); // Debugging log
    try {
        const response = await fetch('/sign_in/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            body: formData
        });
        console.log('Response:', response); // Debugging log
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Response Data:', data); // Debugging log
        if (data.success) {
            // Redirect to the menu page
            window.location.href = '/';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// Function to handle "Play as Guest" button click
function playAsGuest() {
    console.log('playAsGuest called');
    hideAllContainers();
    document.getElementById('gameModeContainer').style.display = 'block';
}

// Function to return to the main menu
async function returnToMenu() {
    console.log('returnToMenu called');
    hideAllContainers();
    try {
        const isLoggedIn = await checkLoginStatus();
        if (isLoggedIn) {
            console.log('User is logged in');
            document.getElementById('profileContainer').style.display = 'flex';
        } else {
            console.log('User is not logged in');
            document.getElementById('menuContainer').style.display = 'block';
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}

// Function to select game mode
function selectMode(mode) {
    console.log(`selectMode called with mode: ${mode}`);
    hideAllContainers();
    if (mode === 'vsPlayer') {
        document.getElementById('nicknameContainer').style.display = 'block';
    } else if (mode === 'tournament') {
        document.getElementById('tournamentContainer').style.display = 'block';
    }
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
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

    // Add event listener for sign-in form submission
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
        console.log('Sign-in form event listener added'); // Debugging log
    } else {
        console.error('Sign-in form not found'); // Debugging log
    }

    // Ensure the menu container is displayed initially
    document.getElementById('menuContainer').style.display = 'block';
});