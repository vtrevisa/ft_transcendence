let currentMatchIndex = 0;
let matches = [];
let winners = [];
let tournamentStage = 'quarterfinals';

function startTournament() {
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
		players.sort(() => Math.random() - 0.5); // Added: Shuffle players only for quarterfinals
	} else if (stage === 'semi') {
		numberOfPlayers = 4;
		players.push(...winners); // Added: Use winners from quarterfinals
	} else if (stage === 'final') {
		numberOfPlayers = 2;
		players.push(...winners); // Added: Use winners from semifinals
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
        if (tournamentStage === 'quarterfinals') { // Check if quarterfinals are done
            // Proceed to semifinals
            tournamentStage = 'semifinals'; // Set stage to semifinals
            currentMatchIndex = 0;
            matches = organizeMatches('semi'); // Organize semifinals matches
			winners = []; // Reset winners array
            displayMatch(currentMatchIndex);
        } else if (tournamentStage === 'semifinals') { // Check if semifinals are done
            // Proceed to finals
            tournamentStage = 'final'; // Set stage to finals
            currentMatchIndex = 0;
            matches = organizeMatches('final'); // Organize finals matches
			winners = []; // Reset winners array
            displayMatch(currentMatchIndex);
        } else if (tournamentStage === 'final') { // Check if finals are done
            // All matches are done
            endTournament();
        }
    }
}


function playMatch(matchIndex) {
	// Set player nicknames for vsPlayer game
	document.getElementById('player1Nickname').value = matches[matchIndex][0];
	document.getElementById('player2Nickname').value = matches[matchIndex][1];
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
	const tournamentWinner = winners[winners.length - 1];
	alert(`Tournament Ended. The winner is ${tournamentWinner}!`);
	returnToMenu();
}

function handleMatchWinner(winner) {
	// Added: Store the winner in the winners array
	winners.push(winner);
	alert(`${winner} wins the match!`);
	nextMatch();
}