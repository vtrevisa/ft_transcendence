// signIn.js

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

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for sign-in form submission
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', function(event) {
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
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect to the menu page
                    window.location.href = '/';
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

// Function to hide all containers
function hideAllContainers() {
    const containers = [
        'menuContainer', 'gameContainer', 'nicknameContainer', 'gameContent',
        'scoreDisplay', 'tournamentContainer', 'tournamentBracket', 'loginContainer',
        'signInContainer', 'guestMenuContainer', 'gameModeContainer', 'updateProfileContainer',
        'profileContainer'
    ];

    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.style.display = 'none';
        }
    });
}