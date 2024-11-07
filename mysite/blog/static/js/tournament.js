let currentMatchIndex = 0;
let quarterfinals = [];

function startTournament() {
    // Reset current match index
    currentMatchIndex = 0;

    // Gather player nicknames
    const players = [];
    for (let i = 1; i <= 8; i++) {
        const nickname = document.getElementById(`player${i}`).value || `Player ${i}`;
        players.push(nickname);
    }

    // Randomly shuffle players
    players.sort(() => Math.random() - 0.5);

    // Organize quarterfinals matches
    quarterfinals = [
        [players[0], players[1]],
        [players[2], players[3]],
        [players[4], players[5]],
        [players[6], players[7]]
    ];

    // Display the first match
    displayMatch(currentMatchIndex);
}

function displayMatch(index) {
	if (index < quarterfinals.length) {
		document.getElementById('quarterfinals').innerHTML = `
			<p>Match ${index + 1}: ${quarterfinals[index][0]} vs ${quarterfinals[index][1]} 
			<button onclick="playMatch(${index})">Play</button></p>`;
		tournamentContainer.style.display = 'none';
		tournamentBracket.style.display = 'block';
	} else {
		// All matches are done, you can proceed to semifinals or finals
		alert('All quarterfinal matches are done!');
	}
}


function playMatch(matchIndex) {
	// Set player nicknames for vsPlayer game
	document.getElementById('player1Nickname').value = quarterfinals[matchIndex][0];
	document.getElementById('player2Nickname').value = quarterfinals[matchIndex][1];
	tournamentBracket.style.display = 'none';
	document.querySelector('.button-container').style.display = 'none';
	document.querySelector('.tButton-container').style.display = 'none';
	// Start the vsPlayer game
	startVsPlayerGame(true);

}

function nextMatch() {
    // Hide the Next Match button and show the Reset Game button
    document.getElementById('gameContent').style.display = 'none';
    document.querySelector('.tButton-container').style.display = 'none';
	document.querySelector('.button-container').style.display = 'none';

    // Move to the next match
    currentMatchIndex++;
    displayMatch(currentMatchIndex);
}

function endTournament() {
    // Logic to end the tournament
    alert('Tournament Ended');
    returnToMenu();
}