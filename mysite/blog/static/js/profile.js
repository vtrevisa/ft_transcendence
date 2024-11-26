// profile.js

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

// Function to display the profile
function displayProfile(profile) {
    document.getElementById('profileUsername').textContent = profile.username;
    document.getElementById('profileEmail').textContent = profile.email;
    document.getElementById('profileNickname').textContent = profile.nickname;
    document.getElementById('profileAvatar').src = profile.avatar_url;
    document.getElementById('profileContainer').style.display = 'flex';
    document.getElementById('logoutButton').style.display = 'block';
    document.getElementById('vsGameButton').style.display = 'block';
    document.getElementById('tournamentButton').style.display = 'block';
    document.getElementById('editProfileButton').style.display = 'block';
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
            displayProfile(data);
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('signInButton').style.display = 'none';
            document.getElementById('playAsGuestButton').style.display = 'none';
            document.getElementById('gameModeContainer').style.display = 'block';
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

// Function to return to the main menu
function returnToMenu() {
    hideAllContainers();
    document.getElementById('menuContainer').style.display = 'block';
    document.getElementById('loginButton').style.display = 'block';
    document.getElementById('signInButton').style.display = 'block';
    document.getElementById('playAsGuestButton').style.display = 'block';
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('profileContainer').style.display = 'none';
    document.getElementById('vsGameButton').style.display = 'none';
    document.getElementById('tournamentButton').style.display = 'none';
    document.getElementById('gameModeContainer').style.display = 'none';
}

// Function to hide all containers
function hideAllContainers() {
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => container.style.display = 'none');
}

// Function to show the profile update form
function showUpdateProfile() {
    hideAllContainers();
    document.getElementById('updateProfileContainer').style.display = 'block';
}

// Function to handle profile update form submission
function handleProfileUpdate(event) {
    event.preventDefault();
    const formData = new FormData();
    const email = document.getElementById('updateEmail').value;
    const nickname = document.getElementById('updateNickname').value;
    const avatar = document.getElementById('updateAvatar').files[0];

    if (email) {
        formData.append('email', email);
    }
    if (nickname) {
        formData.append('nickname', nickname);
    }
    if (avatar) {
        formData.append('avatar', avatar);
    }

    const csrfToken = getCookie('csrftoken');
    fetch('/update_profile/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Profile updated successfully');
            window.location.reload();
        } else {
            alert('Profile update failed: ' + data.message);
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
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Event listener for profile update form submission
    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', handleProfileUpdate);
    }
});