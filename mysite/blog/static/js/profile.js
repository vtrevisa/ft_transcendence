// profile.js
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

function displayProfile(profile) {
    document.getElementById('profileUsername').textContent = profile.username;
    document.getElementById('profileEmail').textContent = profile.email;
    document.getElementById('profileNickname').textContent = profile.nickname;
    document.getElementById('profileAvatar').src = profile.avatar_url;
    document.getElementById('profileJoinedDate').textContent = profile.joined_date;
    document.getElementById('profileLastLogin').textContent = profile.last_login;
    document.getElementById('profileContainer').style.display = 'block';
}

// profile.js
function showEditProfile() {
    document.querySelector('.play-button-container').style.display = 'none';
    document.getElementById('editProfileForm').style.display = 'block';
}

function submitProfileChanges() {
    const newNickname = document.getElementById('newNickname').value;
    const newAvatar = document.getElementById('newAvatar').files[0];

    if (newNickname) {
        document.getElementById('profileNickname').textContent = newNickname;
        document.getElementById('userNickname').textContent = newNickname;
    }

    if (newAvatar) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileAvatar').src = e.target.result;
            document.getElementById('userAvatar').src = e.target.result;
        };
        reader.readAsDataURL(newAvatar);
    }

    document.querySelector('.play-button-container').style.display = 'flex';
    document.getElementById('editProfileForm').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            const csrfToken = getCookie('csrftoken');
            fetch('/editProfile/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.detail);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    document.getElementById('userNickname').textContent = data.nickname;
                    document.getElementById('userAvatar').src = data.avatar_url;
                    returnToProfile();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});

function logout() {
    fetch('/logout/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
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

