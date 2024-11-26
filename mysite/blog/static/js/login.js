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

// Function to show a specific container
function showContainer(containerId) {
    hideAllContainers();
    document.getElementById(containerId).style.display = 'block';
}

// Function to return to the main menu
function returnToMenu() {
    hideAllContainers();
    document.getElementById('menuContainer').style.display = 'block';
    document.getElementById('loginButton').style.display = 'block';
    document.getElementById('signInButton').style.display = 'block';
    document.getElementById('playAsGuestButton').style.display = 'block';
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

// Function to hide all containers
function hideAllContainers() {
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => container.style.display = 'none');
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

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();

    // Event listener for login form submission
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const csrfToken = getCookie('csrftoken');
        fetch('/login/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.getElementById('loginButton').style.display = 'none';
                document.getElementById('signInButton').style.display = 'none';
                document.getElementById('playAsGuestButton').style.display = 'none';
                document.getElementById('logoutButton').style.display = 'block';
                document.getElementById('userInfo').style.display = 'flex';
                checkLoginStatus(); // Ensure the session is recognized
            } else {
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Event listener for logout button
    document.getElementById('logoutButton').addEventListener('click', function() {
        fetch('/logout/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                returnToMenu();
            } else {
                alert('Logout failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});