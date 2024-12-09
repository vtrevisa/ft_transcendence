// login.js
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

function showLogin() {
	document.getElementById('authContainer').style.display = 'none';
	document.getElementById('loginContainer').style.display = 'block';
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
	event.preventDefault();
	const formData = new FormData(this);
	fetch('/login/', {
		method: 'POST',
		headers: {
			'X-CSRFToken': getCookie('csrftoken')
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
		console.log('Login data:', data);
		if (data.success) {
			document.getElementById('loginContainer').style.display = 'none';
			document.getElementById('profileContainer').style.display = 'block';
			document.getElementById('profileUsername').textContent = data.username;
			document.getElementById('profileEmail').textContent = data.email;
			document.getElementById('profileNickname').textContent = data.nickname;
			document.getElementById('profileAvatar').src = data.avatar_url;
		} else {
			alert('Login failed: ' + data.message);
		}
	})
	.catch(error => {
		console.error('Error:', error);
	});
});