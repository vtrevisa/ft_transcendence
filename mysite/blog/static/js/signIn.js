// signIn.js
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

function showSignIn() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('signInContainer').style.display = 'block';
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

document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    const csrfToken = getCookie('csrftoken');
    console.log('CSRF Token:', csrfToken);

    fetch('/signIn/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.detail || 'Network response was not ok');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Sign in successful:', data);
        // Optionally, you can redirect to the login page or automatically log in the user
        // window.location.href = '/login/';
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Error during sign in: ' + error.message);
    });
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    const csrfToken = getCookie('csrftoken');
    console.log('CSRF Token:', csrfToken);

    fetch('/login/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Network response was not ok');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Login successful:', data);
            displayProfile(data);
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Error during login: ' + error.message);
    });
});