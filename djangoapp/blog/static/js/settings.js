// settings.js

// Function to show the settings container
function showSettings() {
    hideAllContainers();
    const settingsContainer = document.getElementById('settingsContainer');
    settingsContainer.style.display = 'block';
}

// Function to apply the game mode settings and redirect to the menu
function applySettings() {
    const enableObstacles = document.getElementById('enableObstacles').checked;
    const enableMultipleBalls = document.getElementById('enableMultipleBalls').checked;
    const numberOfBalls = parseInt(document.getElementById('numberOfBalls').value, 10);
    const ballSpeed = parseInt(document.getElementById('ballSpeed').value, 10);
    const paddleSpeed = parseInt(document.getElementById('paddleSpeed').value, 10);

    // Apply game modes settings
    window.gameSettings = {
        enableObstacles,
        enableMultipleBalls,
        numberOfBalls,
        ballSpeed,
        paddleSpeed
    };

    returnToMenu();
}

// Function to reset the settings to default
function resetSettings() {
    document.getElementById('enableObstacles').checked = false;
    document.getElementById('enableMultipleBalls').checked = false;
    document.getElementById('numberOfBalls').value = 1;
    document.getElementById('ballSpeed').value = 10;
    document.getElementById('paddleSpeed').value = 12;
}

// Function to hide all containers
function hideAllContainers() {
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        container.style.display = 'none';
    });
}

// Function to initialize settings
function initializeSettings() {
    document.getElementById('confirmButton').addEventListener('click', applySettings);
    document.getElementById('resetButton').addEventListener('click', resetSettings);
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
});