// login.js

// Function to get a cookie value by name
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Function to check if the user is logged in
function checkLoginStatus() {
    fetch('/check_login/', {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.logged_in) {
            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('signInButton').style.display = 'none';
            document.getElementById('playAsGuestButton').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'block';
            document.getElementById('userInfo').style.display = 'flex';
        } else {
            returnToMenu();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('loginForm'));
    const csrfToken = getCookie('csrftoken');
    fetch('/login/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayProfile(data);
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('signInButton').style.display = 'none';
            document.getElementById('playAsGuestButton').style.display = 'none';
            document.getElementById('gameModeContainer').style.display = 'block';
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to handle logout
function logout() {
    const csrfToken = getCookie('csrftoken');
    fetch('/logout/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
        } else {
            alert('Logout failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
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

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();

    // Event listener for login form submission
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Event listener for logout button
    document.getElementById('logoutButton').addEventListener('click', logout);
});