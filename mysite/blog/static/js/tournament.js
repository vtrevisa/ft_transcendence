// tournament.js

let currentMatchIndex = 0;
let matches = [];
let winners = [];
let tournamentStage = 'quarterfinals';

function startTournament() {
    window.isTournamentMode = true;
    // Reset current match index
    currentMatchIndex = 0;
    winners = [];
    tournamentStage = 'quarterfinals';
    // Organize quarterfinals matches
    matches = organizeMatches('quarter');
    // Display the first match
    displayMatch(currentMatchIndex);
}

function organizeMatches(stage) {
    const players = [];
    let numberOfPlayers;

    if (stage === 'quarter') {
        numberOfPlayers = 8;
        for (let i = 1; i <= numberOfPlayers; i++) {
            const nickname = document.getElementById(`player${i}`).value || `Player ${i}`;
            players.push(nickname);
        }
        // Randomly shuffle players for quarterfinals
        players.sort(() => Math.random() - 0.5);
    } else if (stage === 'semi') {
        numberOfPlayers = 4;
        players.push(...winners);
    } else if (stage === 'final') {
        numberOfPlayers = 2;
        players.push(...winners);
    }

    const matches = [];
    for (let i = 0; i < numberOfPlayers; i += 2) {
        matches.push([players[i], players[i + 1]]);
    }

    return matches;
}

function displayMatch(index) {
    if (index < matches.length) {
        document.getElementById('quarterfinals').innerHTML = `
            <p>Match ${index + 1}: ${matches[index][0]} vs ${matches[index][1]} 
            <button onclick="playMatch(${index})">Play</button></p>`;
        tournamentContainer.style.display = 'none';
        tournamentBracket.style.display = 'block';
    } else {
        if (tournamentStage === 'quarterfinals') {
            // Proceed to semifinals
            tournamentStage = 'semifinals';
            currentMatchIndex = 0;
            matches = organizeMatches('semi');
            winners = [];
            displayMatch(currentMatchIndex);
        } else if (tournamentStage === 'semifinals') {
            // Proceed to finals
            tournamentStage = 'final';
            currentMatchIndex = 0;
            matches = organizeMatches('final');
            winners = [];
            displayMatch(currentMatchIndex);
        } else if (tournamentStage === 'final') {
            // All matches are done
            endTournament();
        }
    }
}

function playMatch(matchIndex) {
    // Set player nicknames for vsPlayer game
    const player1Nickname = matches[matchIndex][0];
    const player2Nickname = matches[matchIndex][1];

    document.getElementById('player1Nickname').value = player1Nickname;
    document.getElementById('player2Nickname').value = player2Nickname;

    // Update the global player nicknames
    window.player1Nickname = player1Nickname;
    window.player2Nickname = player2Nickname;

    tournamentBracket.style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';
    document.querySelector('.tButton-container').style.display = 'none';
    // Start the vsPlayer game
    startVsPlayerGame(true);
}

function nextMatch() {
    console.log('Next match called');
    // Hide the Next Match button and show the Reset Game button
    const gameContainer = document.getElementById('gameContainer');
    if (gameContainer) {
        gameContainer.style.display = 'none';
    } else {
        console.error('gameContainer element not found');
    }
    const tButtonContainer = document.querySelector('.tButton-container');
    if (tButtonContainer) {
        tButtonContainer.style.display = 'none';
    } else {
        console.error('tButton-container element not found');
    }
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
        buttonContainer.style.display = 'none';
    } else {
        console.error('button-container element not found');
    }
    // Move to the next match
    currentMatchIndex++;
    if (currentMatchIndex < matches.length) {
        displayMatch(currentMatchIndex);
    } else {
        if (tournamentStage === 'quarterfinals') {
            // Proceed to semifinals
            tournamentStage = 'semifinals';
            currentMatchIndex = 0;
            matches = organizeMatches('semi');
            winners = [];
            displayMatch(currentMatchIndex);
        } else if (tournamentStage === 'semifinals') {
            // Proceed to finals
            tournamentStage = 'final';
            currentMatchIndex = 0;
            matches = organizeMatches('final');
            winners = [];
            displayMatch(currentMatchIndex);
        } else if (tournamentStage === 'final') {
            // All matches are done
            endTournament();
        }
    }
}

function endTournament() {
    // Logic to end the tournament
    const tournamentWinner = winners[winners.length - 1];
    alert(`Tournament Ended. The winner is ${tournamentWinner}!`);
    returnToMenu();
}

function handleMatchWinner(winner) {
    // Store the winner in the winners array
    winners.push(winner);
    alert(`${winner} wins the match!`);
    nextMatch();
}

function endTournamentGame() {
    // Retrieve player nicknames
    const player1Nickname = document.getElementById('player1Nickname').value;
    const player2Nickname = document.getElementById('player2Nickname').value;

    // Retrieve the correct username for Player 1 using the mapping object
    const player1Username = nicknameToUsernameMap[player1Nickname];

    // If Player 1 or Player 2 are not found as the logged user, proceed without recording anything
    if (!player1Username) {
        console.warn('Player 1 not found as the logged user. Proceeding without recording.');
        handleMatchWinner(player1Nickname);
        resetGame(); // Reset the game after the match ends
        return;
    }

    // Determine the outcome
    const player1_won = player1Score >= maxScore;
    const outcome = player1_won ? 'won' : 'lost';
    const winner = player1_won ? player1Username : player2Nickname;

    // Retrieve match information
    const matchTime = new Date().toISOString(); // Format the date correctly
    const matchScore = `${player1Score} - ${player2Score}`;

    // Print information on the console
    console.log(`Player 1 (Username: ${player1Username}, Nickname: ${player1Nickname}) ${outcome} the match.`);
    console.log(`Match Score: ${matchScore}`);
    console.log(`Match Time: ${matchTime}`);
    console.log(`Player 2 (Nickname: ${player2Nickname})`);

    // Update status counter
    updateStatusCounter(player1Username, outcome);

    // Record game history
    recordGameHistory(player1Username, player2Nickname, winner, matchTime, matchScore);

    // Handle the end of the game
    scoreDisplay.textContent = `${player1_won ? player1Nickname : player2Nickname} wins! Final Score: ${player1Nickname} ${player1Score} - ${player2Nickname} ${player2Score}`;
    clearInterval(gameInterval);
    gameInterval = null; // Clear the interval reference

    buttonContainer.style.display = 'none';
    tButtonContainer.style.display = 'block';

    handleMatchWinner(winner);
    resetGame(); // Reset the game after the match ends
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    // Add event listener for the "Next Match" button
    const nextMatchButton = document.getElementById('nextMatchButton');
    if (nextMatchButton) {
        nextMatchButton.addEventListener('click', nextMatch);
        console.log('Next Match button event listener added'); // Debugging log
    } else {
        console.error('Next Match button not found'); // Debugging log
    }
});