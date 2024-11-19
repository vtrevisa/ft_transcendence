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

function showLogin() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
}

function returnToMenu() {
    document.getElementById('signInContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('editProfileForm').style.display = 'none';
    document.getElementById('menuContainer').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signInForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const csrfToken = getCookie('csrftoken');
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
                    throw new Error(errorData.detail);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                displayProfile(data);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

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
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                displayProfile(data);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});