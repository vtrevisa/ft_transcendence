// login.js

// Function to check if the user is logged in
async function checkLoginStatus() {
    try {
        const response = await fetch('/check_login/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        if (!response.ok) {
            console.log('No login detected');
            returnToMenu();
            return;
        }
        const data = await response.json();
        if (data.logged_in) {
            isOnline = true;
            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('signInButton').style.display = 'none';
            document.getElementById('playAsGuestButton').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'block';
            document.getElementById('userInfo').style.display = 'flex';
        } else {
            returnToMenu();
        }
    } catch (error) {
        console.error('Error:', error);
        returnToMenu();
    }
}

// Function to handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('loginForm'));
    const csrfToken = getCookie('csrftoken');
    try {
        const response = await fetch('/login/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            body: formData
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
            isOnline = true;
            displayProfile(data);
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('signInButton').style.display = 'none';
            document.getElementById('playAsGuestButton').style.display = 'none';
            document.getElementById('gameModeContainer').style.display = 'block';
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to handle logout
async function logout() {
    const csrfToken = getCookie('csrftoken');
    try {
        const response = await fetch('/logout/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            }
        });
        if (response.ok) {
            window.location.reload();
        } else {
            alert('Logout failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();

    // Event listener for login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Event listener for logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});