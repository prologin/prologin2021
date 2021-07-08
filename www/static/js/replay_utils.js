"use strict";

// Some utilities used by the replay and the spectator

// To use this script :
// - Define the procedure fetchNextState()
// - Define the predicate hasGameEnded()
// - Call startReplay() when the graphics are initialized

// --- Globals ---
// The replay is a collection of game states
let gameStates = [];

// The current game state to render
let currentGameStateIndex = 0;

// Next state every N ms with this option
let autoreplay = false;

const AUTOREPLAY_PERIOD_MS = 500;

function newGameState(width, height) {
    // Update dimension values
    mapWidth = width;
    mapHeight = height;

    updateViewSize();

    // Update view dimensions
    app.renderer.resize(mapWidth, mapHeight);

    // Create new game state
    gameState = new GameState(width, height);

    updateView();

    return gameState;
}

// --- UI ---
let uiCanvas = document.getElementById("canvas");
let uiStateIndicator = document.getElementById("state-indicator");
let uiP1Points = document.getElementById("p1-points");
let uiP2Points = document.getElementById("p2-points");
let uiP1Babies = document.getElementById("p1-babies");
let uiP2Babies = document.getElementById("p2-babies");
let uiAutoReplay = document.getElementById("autoreplay");
let uiWinner = document.getElementById("winner");
let uiWinnerTitle = document.getElementById("winner-title");
let uiWinnerImg = document.getElementById("winner-img");

function onPrevClick() {
    // Disable autoreplay
    if (autoreplay) {
        onAutoReplayChange(false);
    }

    if (currentGameStateIndex > 0)
        --currentGameStateIndex;

    updateReplay();
}

function onNextClick() {
    if (currentGameStateIndex < gameStates.length - 1) {
        ++currentGameStateIndex;
    } else {
        // Try to add the next state (used by the spectator)
        // If a state is added, call this function again
        fetchNextState();

        return;
    }

    // Render the next game state
    updateReplay();
}

function onAutoReplayChange(forceValue = undefined) {
    autoreplay = forceValue === undefined ? !autoreplay : forceValue;

    if (forceValue !== undefined) {
        uiAutoReplay.checked = autoreplay;
    }

    if (autoreplay)
        autoreplayLoop();
    else
        window.clearTimeout(autoreplayLoop);
}

// When a key is pressed
function onKey(e) {
    let useful = true;
    switch (e.key.toUpperCase()) {
    case " ":
        // Toggle autoreplay
        onAutoReplayChange();
        uiAutoReplay.checked = autoreplay;
        break;
    case "N":
        // Next state
        onNextClick();
        break;
    case "B":
        // Previous state
        onPrevClick();
        break;
    default:
        useful = false;
        break;
    }

    if (useful)
        e.preventDefault();
}

function updateReplay() {
    if (gameStates.length == 0)
        return;

    // gameState is the rendered state
    gameState = gameStates[currentGameStateIndex];

    // Update GUI
    let gameEnded = hasGameEnded();
    uiStateIndicator.textContent =
        gameEnded ? `Partie terminée (${gameStates.length} tours)`
                  : `${currentGameStateIndex + 1} / ${gameStates.length} tours`
    uiP1Points.textContent =
        `Joueur 1 : ${gameState.players['1'].points} points`;
    uiP2Points.textContent =
        `Joueur 2 : ${gameState.players['2'].points} points`;
    uiP1Babies.textContent = `Bébés sauvés du joueur 1 : ${
        gameState.players['1'].babies_on_back_1} (panda 1) / ${
        gameState.players['1'].babies_on_back_2} (panda 2)`;
    uiP2Babies.textContent = `Bébés sauvés du joueur 2 : ${
        gameState.players['2'].babies_on_back_1} (panda 1) / ${
        gameState.players['2'].babies_on_back_2} (panda 2)`;

    if (gameEnded) {
        showWinners();
    } else {
        hideWinners();
    }

    updateView();
}

// Timer when we need to make an auto replay step
function autoreplayLoop() {
    if (autoreplay) {
        autoreplayStep();

        // Loop again
        window.setTimeout(autoreplayLoop, AUTOREPLAY_PERIOD_MS);
    }
}

// Auto replay game state update
function autoreplayStep() { onNextClick(); }

// Function to be called when the graphics are initialized
function startReplay() {
    autoreplay = uiAutoReplay.checked;

    if (autoreplay) {
        autoreplayLoop();
    }
}

// Called when there is a dump to load
// The dump is multiple game states dumps separated by a new line
function loadDump(data) {
    let lines = data.split('\n');

    if (lines.length === 0) {
        console.error('Empty dump, cannot parse');
        return;
    }

    // Parse
    for (let line of lines) {
        let gs = parseJSON(line);
        if (gs == null)
            continue;
        gameStates.push(gs);
    }

    // Render
    mapWidth = gameStates[0].width;
    mapHeight = gameStates[0].height;

    wwwTileWidth = wwwWidth / mapWidth;

    updateViewSize();

    app.renderer.resize(mapWidth, mapHeight);
    updateReplay();
    startReplay();
}

function showWinners() {
    uiWinner.hidden = false;

    if (!uiWinnerImg.classList.contains('winner-img')) {
        uiWinnerImg.classList.add('winner-img');
        uiWinnerTitle.classList.add('winner-title');
    }

    let gs = gameStates[gameStates.length - 1];
    if (gs.players['1'].points == gs.players['2'].points) {
        uiWinnerTitle.textContent = 'Match nul !';
    } else {
        let p1Wins = gs.players['1'].points > gs.players['2'].points;
        let winner =
            `Joueur ${p1Wins ? '1' : '2'}`;
        uiWinnerTitle.textContent = `Bravo ${winner}`;

        let pref = '/static/img/';
        uiWinnerImg.src = pref + (p1Wins ? 'panda1.png' : 'panda2.png');
    }
}

function hideWinners() {
    uiWinner.hidden = true;
    uiWinnerImg.classList.remove('winner-img');
    uiWinnerTitle.classList.remove('winner-title');
}
