// Apply visual settings
visualSettingsManager.applyVisualSettings();

// Get DOM elements
const targetContainer = document.getElementById('targetContainer');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const pauseButton = document.getElementById('pause-button');
const popupContainer = document.getElementById('popup-container');
const resumeButton = document.getElementById('close-button');
const restartButton = document.getElementById('restart-button');
const homeButton = document.getElementById('home-button');
const pauseMessage = document.getElementById('pause-message');

// Create instances of Timer, Score, trainer, encouragement Manager
const settings = storageManager.getData();
const trainer = trainerSettingsManager.getTrainerSettings();
const timer = new Timer(trainer.trainerType.time);
const score = new Score(0);
const encouragementMessages = trainer.encouragement.messages;
const encouragement = new Encouragement(encouragementMessages);

// Game state variables
let isGamePaused = false;
let isGameOver = false;
let lastTimestamp = null;

// Local variables
let totalTimeText;
let totalScoreText;
let hitStreak = 0;
let missStreak = 0;

// Display initial score and timer if modes are set to scored and timed respectively
if(trainer.scoring.mode == "scored"){
    score.display();
}
else{
    score.hide();
}
if(trainer.trainerType.mode == "timed"){
    timer.display();
}
else{
    timer.hide();
}

// Start the game loop
startGame();

// Pause button functionality
pauseButton.addEventListener('click', () => {
    // Pause the game (pause timer and any moving targets)
    pauseGame();

    // Display the popup
    popupContainer.style.display = 'flex';
    pauseMessage.textContent = 'Paused';
    document.getElementById('overlay').style.display = 'block'; // Hide overlay
});

// Resume button functionality
resumeButton.addEventListener('click', () => {
    // Resume the game (resume timer and any paused targets)
    resumeGame();

    // Hide the popup
    popupContainer.style.display = 'none';
});

// Restart button functionality
restartButton.addEventListener('click', () => {
    if(isGamePaused)
    {
        gameRunManager.markAsExitedEarly();
        gameRunManager.stopRun();
    }

    // Restart the game
    restartGame();

    // Hide the popup
    popupContainer.style.display = 'none';
});

// Home button functionality
homeButton.addEventListener('click', () => {
    // Go back to the home page
    window.location.href = 'index.html';

    // hide the popup
    popupContainer.style.display = 'none';

    // save run of the game/ end it
    if(isGamePaused)
    {
        gameRunManager.markAsExitedEarly();
        gameRunManager.stopRun();
    }
});

// Function to pause the game
function pauseGame() {
    isGamePaused = true;
    timer.pause();
    document.getElementById('overlay').style.display = 'none'; // Hide overlay

    // save current run of the game
    gameRunManager.updateScore(score.getValue());
    gameRunManager.updateTimeRemaining(trainer.trainerType.time - timer.getSeconds());
}

// Function to resume the game
function resumeGame() {
    isGamePaused = false;
    timer.resume();
    document.getElementById('overlay').style.display = 'none'; // Hide overlay

    // Start the game loop if not already started
    if (!isGameOver) {
        startGame();
    }
}

// Function to restart the game
function restartGame() {
    console.log('Restarting the game');
    document.getElementById('overlay').style.display = 'none'; // Hide overlay
    isGamePaused = false; // Reset game pause state
    isGameOver = false; // Reset game over state
    score.reset(); // Reset score
    timer.reset(); // Reset timer and ensure it starts counting down
    targetManager.reset(); // Assuming this method resets target manager state
    lastTimestamp = null; // Reset lastTimestamp for accurate deltaTime calculation
    // Reset streaks
    hitStreak = 0;
    missStreak = 0;
    encouragement.hide(); // Ensure the encouragement message is hidden

    // Before resetting, check if the game is being restarted early
    if (isGameOver === false) {
        // If the game is not over, the player is leaving early
        gameRunManager.markAsExitedEarly();
    }
    
    // Stop the current run
    gameRunManager.stopRun();

    // Remove the event listener for capturing start position
    document.removeEventListener('mousemove', gameRunManager.startPositionHandler);
    gameRunManager.startPositionHandler = null;

    startGame(); // Start a new game loop
    console.log('Game restarted: Timer reset and game loop started');
}


// Function to start the game loop
function startGame() {
    // start the game run
    gameRunManager.startRun();

    // Capture cursor starting position
    gameRunManager.captureStartPosition();

    if (!isGamePaused && !isGameOver) {
        requestAnimationFrame(updateGame);
        console.log('Game loop started');
    }
}

document.getElementById('targetContainer').addEventListener('click', (event) => {
    // Ensure the click is not on a target
    if (event.target == document.getElementById('targetContainer')) {
        missStreak++;
        hitStreak = 0; // Reset hit streak on a miss

        // Decrement the score by the penalty defined in trainer for a missed hit
        score.decrement(trainer.scoring.missedHit);

        // Check for miss streak
        if (missStreak >= 3 && trainer.encouragement.display) {
            encouragement.showRandomMessage();
        }

        // Update consecutive hits and misses in TargetManager
        if (!isGamePaused) {
            targetManager.handleMiss();
        }

        // add miss position
        const missPosition = { x: event.clientX, y: event.clientY };
        gameRunManager.addMissPosition(missPosition);

        // Capture click timestamp
        gameRunManager.captureClickTimestamp();
    }
});

// Modify the mousemove event listener to capture mouse path
document.addEventListener('mousemove', (event) => {
    // Capture mouse path
    gameRunManager.captureMousePath(event);
});

// Function to update the game state
function updateGame(timestamp) {
    if (isGamePaused) {
        requestAnimationFrame(updateGame);
        return;
    }

    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;

    if (deltaTime >= 1000) {
        lastTimestamp = timestamp; // Update lastTimestamp at the start to ensure timing accuracy

        // Game logic to update timer, check game over conditions, etc.
        if (!isGamePaused && !isGameOver) {
            if(trainer.trainerType.mode == "timed"){
                timer.decrement();
            }

            // Check if the game is over
            if (timer.isTimeUp() || (targetManager.targets.length == 0 && targetManager.totalTargets == 0)) {
                timer.stop(); // Immediately stop the timer to capture final time
                endGame(); // End the game
                return; // Exit the game loop to prevent further updates
            }

            // Generate targets only if there are no targets on the screen
            if (targetManager.targets.length == 0 && targetManager.totalTargets > 0) {
                targetManager.manageTargets();
            }

            // Encourage the user to keep going if encouragement is enabled
            if (trainer.encouragement.display && hitStreak >= 3) {
                encouragement.showRandomMessage();
            }

            // update score
            gameRunManager.updateScore(score.getValue());

            // update time elapsed
            gameRunManager.updateTimeRemaining(trainer.trainerType.time - timer.getSeconds());
        }

    }

    // Request the next animation frame
    if (!isGameOver) {
        requestAnimationFrame(updateGame); // Continue the game loop only if the game is not over
    }
}
// Function to end the game
function endGame() {
    isGameOver = true;
    targetManager.clearTargets(); // Clear any remaining targets on the screen

    // update any remaining game stuff
    gameRunManager.updateScore(score.getValue());
    gameRunManager.updateTimeRemaining(trainer.trainerType.time - timer.getSeconds());

    // Stop the game run
    gameRunManager.stopRun();

    // Display end game message in dynamic pop-up container
    displayEndGameMessage();

    // Add the current score to the leaderboard
    const entry = {
        score: score.getValue(),
        time: `${trainer.trainerType.time - timer.getSeconds()}s`, // Total time taken
        date: new Date().toISOString().split('T')[0], // Current date
        timeOfDay: new Date().toLocaleTimeString() // Current time
    };

    addToLeaderboard(entry); 
}

function addToLeaderboard(entry) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push(entry);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Function to display end game message in dynamic pop-up container
function displayEndGameMessage() {
    const endGameContainer = document.getElementById('end-game-container');
    const endGameMessage = document.getElementById('end-game-message');
    const endGameInfo = document.getElementById('end-game-info');
    const endGameButtons = document.getElementById('end-game-buttons');

    // Customize the message based on the game outcome
    if (timer.isTimeUp()) {
        endGameMessage.textContent = "Time ran out -- Tweak your settings and try again! You got this!";
    } else if (targetManager.totalTargetsHit >= trainer.totalNumTargets) {
        endGameMessage.textContent = "Hooray! You hit all the targets! :D";
    }

    // Display total score and total time
    if (trainer.trainerType.mode == "timed")
    {
        totalTimeText = `Total Time: ${trainer.trainerType.time - timer.getSeconds()}s`;
    }
    else{
        totalTimeText = '';
    }
    if(trainer.scoring.mode == "scored")
    {
        totalScoreText = `Total Score: ${score.getValue()}`;
    }
    else{
        totalScoreText = '';
    }

    // Set font size based on visual settings
    endGameInfo.innerHTML = `<p>${totalScoreText}</p><p>${totalTimeText}</p>`;

    // Show the dynamic pop-up container
    endGameContainer.style.display = 'flex';

    // Set up buttons
    const restartButton = document.getElementById('end-game-restart-button');
    const homeButton = document.getElementById('end-game-home-button');
    const leaderboardButton = document.getElementById('end-game-leaderboard-button');

    // Restart button functionality
    restartButton.addEventListener('click', () => {
        // stop the game run
        gameRunManager.stopRun();

        restartGame();
        document.getElementById('overlay').style.display = 'none'; // Hide overlay
        endGameContainer.style.display = 'none';
    });

    // Home button functionality
    homeButton.addEventListener('click', () => {
        // Go back to the home page
        window.location.href = 'index.html';
    });

    // Leaderboard button functionality
    leaderboardButton.addEventListener('click', () => {
        // Redirect to the leaderboard page (replace 'leaderboard.html' with the actual page)
        window.location.href = 'leaderboard.html';
    });

    document.getElementById('overlay').style.display = 'block';
}

