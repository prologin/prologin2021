"use strict";

// Main replay script

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
let uiAutoReplay = document.getElementById("autoreplay");

function onPrevClick() {
    if (currentGameStateIndex > 0)
        --currentGameStateIndex;

    updateReplay();
}

function onNextClick() {
    if (currentGameStateIndex < gameStates.length - 1)
        ++currentGameStateIndex;

    updateReplay();
}

function onAutoReplayChange() {
    autoreplay = !autoreplay;

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

// --- Graphics ---
updateViewSize();

// Init
initGraphics(uiCanvas, mapWidth, mapHeight, null);

function updateReplay() {
    // gameState is the rendered state
    gameState = gameStates[currentGameStateIndex];

    // Update GUI
    uiStateIndicator.textContent =
        `${currentGameStateIndex + 1} / ${gameStates.length} tours`
    // TODO : Display player points
    uiP1Points.textContent = "Joueur 1 : ??? points";
    uiP2Points.textContent = "Joueur 2 : ??? points";

    updateView();
}

// Timer when we need to make an auto replay step
function autoreplayLoop() {
    autoreplayStep();

    // Loop again
    if (autoreplay)
        window.setTimeout(autoreplayLoop, AUTOREPLAY_PERIOD_MS);
}

// Auto replay game state update
function autoreplayStep() { onNextClick(); }

// --- Test ---
// Create 3 states
for (let i = 0; i < 3; ++i)
    gameStates.push(newGameState(10, 10));

gameStates[0].panda_map[0][0].panda = new Panda(1, 1);
gameStates[1].panda_map[1][0].panda = new Panda(1, 1);
gameStates[2].panda_map[1][1].panda = new Panda(1, 1);

gameStates[0].panda_map[3][0].panda = new Panda(2, 1);
gameStates[1].panda_map[3][1].panda = new Panda(2, 1);
gameStates[2].panda_map[3][2].panda = new Panda(2, 1);

for (let gs of gameStates) {
    for (let i = 0; i < 6; ++i) {
        for (let j = 0; j < 6; ++j) {
            gs.map[i][j].bridge = [i + 1, j + 1];
        }
    }

    gs.map[9][1].bridge = [5, 1];
    gs.map[9][2].bridge = [3, 2];

    gs.panda_map[2][1].baby_panda = new BabyPanda(1, 1);
    gs.panda_map[2][2].baby_panda = new BabyPanda(2, 1);
}

// Render view
updateReplay();
