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
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');
    const profileNickname = document.getElementById('profileNickname');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileContainer = document.getElementById('profileContainer');
    const logoutButton = document.getElementById('logoutButton');
    const vsGameButton = document.getElementById('vsGameButton');
    const tournamentButton = document.getElementById('tournamentButton');
    const editProfileButton = document.getElementById('editProfileButton');
    const friendListButton = document.getElementById('friendListButton');
    const player1NicknameInput = document.getElementById('player1Nickname');
    const tournamentPlayer1Input = document.getElementById('player1');

    if (profileUsername) profileUsername.textContent = profile.username;
    if (profileEmail) profileEmail.textContent = profile.email;
    if (profileNickname) profileNickname.textContent = profile.nickname;
    if (profileAvatar) profileAvatar.src = profile.avatar_url;
    if (profileContainer) profileContainer.style.display = 'flex';
    if (logoutButton) logoutButton.style.display = 'block';
    if (vsGameButton) vsGameButton.style.display = 'block';
    if (tournamentButton) tournamentButton.style.display = 'block';
    if (editProfileButton) editProfileButton.style.display = 'block';
    if (friendListButton) friendListButton.style.display = 'block';
    if (player1NicknameInput) {
        player1NicknameInput.value = profile.nickname;
        player1NicknameInput.readOnly = true;  // Make the field read-only
    }
    if (tournamentPlayer1Input) {
        tournamentPlayer1Input.value = profile.nickname;
        tournamentPlayer1Input.readOnly = true;  // Make the field read-only
    }
}

// Function to check if the user is logged in
function checkLoginStatus() {
    return fetch('/check_login/', {
        method: 'GET',
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
        if (data && data.logged_in) {
            displayProfile(data);
            document.getElementById('menuContainer').style.display = 'none';
            document.getElementById('gameModeContainer').style.display = 'block';
            return true;
        } else {
            document.getElementById('menuContainer').style.display = 'block';
            document.getElementById('gameModeContainer').style.display = 'none';
            return false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('menuContainer').style.display = 'block';
        document.getElementById('gameModeContainer').style.display = 'none';
        return false;
    });
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

// Function to hide all containers
function hideAllContainers() {
    const containers = [
        'menuContainer', 'gameContainer', 'nicknameContainer', 'gameContent',
        'scoreDisplay', 'tournamentContainer', 'tournamentBracket', 'loginContainer',
        'signInContainer', 'guestMenuContainer', 'gameModeContainer', 'updateProfileContainer',
        'profileContainer', 'friendListContainer', 'addFriendContainer'
    ];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.style.display = 'none';
        }
    });
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus().then(isLoggedIn => {
        if (!isLoggedIn) {
            returnToMenu();
        }
    });

    // Event listener for profile update form submission
    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', handleProfileUpdate);
    }
});