// profile.js

// Define containers variable at the top
let containers;

function displayProfile(profile) {
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');
    const profileNickname = document.getElementById('profileNickname');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileContainer = document.getElementById('profileContainer');
    const logoutButton = document.getElementById('logoutButton');
    const vsGameButton = document.getElementById('vsGameButton');
    const tournamentButton = document.getElementById('tournamentButton');
    const fourPlayersButton = document.getElementById('fourPlayersButton');
    const editProfileButton = document.getElementById('editProfileButton');
    const friendListButton = document.getElementById('friendListButton');
    const historyButton = document.getElementById('historyButton');
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
    if (fourPlayersButton) fourPlayersButton.style.display = 'block';
    if (editProfileButton) editProfileButton.style.display = 'block';
    if (friendListButton) friendListButton.style.display = 'block';
    if (historyButton) historyButton.style.display = 'block';
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
        }
        const data = await response.json();
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
    } catch (error) {
        document.getElementById('menuContainer').style.display = 'block';
        document.getElementById('gameModeContainer').style.display = 'none';
        return false;
    }
}

// Function to show the profile update form
function showUpdateProfile() {
    hideAllContainers();
    document.getElementById('updateProfileContainer').style.display = 'block';
}

// Function to handle profile update form submission
async function handleProfileUpdate(event) {
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
    try {
        const response = await fetch('/update_profile/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert('Profile updated successfully');
            window.location.reload();
        } else {
            alert('Profile update failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateStatusCounter(username, result) {
    const response = await fetch('/update_status_counter/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Ensure CSRF token is included
        },
        body: JSON.stringify({ username: username, result: result })
    });

    if (response.ok) {
        const data = await response.json();
        console.log(`Status counter updated: ${data.message}`);
    } else {
        console.error('Failed to update status counter');
    }
}

// Function to show the status table
async function showStatus() {
    hideAllContainers();
    document.getElementById('statusContainer').style.display = 'block';
    try {
        const response = await fetch('/status/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const statusTableBody = document.getElementById('statusTable').getElementsByTagName('tbody')[0];
        statusTableBody.innerHTML = `
            <tr>
                <td>${data.matches}</td>
                <td>${data.wins}</td>
                <td>${data.losses}</td>
                <td>${data.winrate}</td>
            </tr>
        `;
    } catch (error) {
        console.error('Error:', error);
    }
}

function showMatchHistory() {
    hideAllContainers();
    fetch('/match_history/')
        .then(response => response.json())
        .then(data => {
            const matchHistoryTableBody = document.getElementById('matchHistoryTable').getElementsByTagName('tbody')[0];
            matchHistoryTableBody.innerHTML = ''; // Clear existing rows

            data.matches.forEach(match => {
                const row = matchHistoryTableBody.insertRow();
                const player1Cell = row.insertCell(0);
                const player2Cell = row.insertCell(1);
                const winnerCell = row.insertCell(2);
                const dateCell = row.insertCell(3);
                const detailsCell = row.insertCell(4);

                player1Cell.textContent = match.player1;
                player2Cell.textContent = match.player2;
                winnerCell.textContent = match.winner;
                dateCell.textContent = match.date;
                detailsCell.textContent = match.details;
            });

            document.getElementById('matchHistoryContainer').style.display = 'block';
        })
        .catch(error => console.error('Error fetching match history:', error));
}

async function recordGameHistory(player1Username, player2Nickname, winner, matchTime, matchScore) {
    const response = await fetch('/record_game_history/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Ensure CSRF token is included
        },
        body: JSON.stringify({
            player1Username: player1Username,
            player2Nickname: player2Nickname,
            winner: winner,
            matchTime: matchTime,
            matchScore: matchScore
        })
    });

    if (response.ok) {
        const data = await response.json();
        console.log(`Game history recorded: ${data.message}`);
    } else {
        console.error('Failed to record game history');
    }
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    containers = document.querySelectorAll('.container');
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

    // Event listener for the match history button
    document.getElementById('matchHistoryButton').addEventListener('click', showMatchHistory);

    // Event listener for the game container visibility
    const gameContainer = document.getElementById('gameContainer');
    const observer = new MutationObserver(handleGameContainerVisibility);
    observer.observe(gameContainer, { attributes: true, attributeFilter: ['style'] });
});