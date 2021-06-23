"use strict";

// Main map editor script

// --- Globals ---
// The replay is a collection of game states
let gameStates = [];

// The current game state to render
let currentGameStateIndex = 0;

function newGameState(width, height) {
    // Update dimension values
    mapWidth = width;
    mapHeight = height;
    updateViewSize();

    // Update view dimensions
    app.renderer.resize(mapWidth, mapHeight);

    // Create new game state
    gameState = new GameState(width, height);

    // Init empty map (filled with water)
    for (let i = 0; i < height; ++i) {
        gameState.map.push([]);
        for (let j = 0; j < width; ++j) {
            gameState.map[i].push(null);
        }
    }

    updateView();

    return gameState;
}

// --- UI ---
let uiCanvas = document.getElementById("canvas");
let uiStateIndicator = document.getElementById("state-indicator");

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

// --- Graphics ---
updateViewSize();

// Init
initGraphics(uiCanvas, mapWidth, mapHeight, null);

function updateReplay() {
    // gameState is the rendered state
    gameState = gameStates[currentGameStateIndex];

    // Update GUI
    uiStateIndicator.textContent = `${currentGameStateIndex + 1} / ${gameStates.length} tours`

    updateView();
}

// --- Test ---
// Create 3 states
for (let i = 0; i < 3; ++i)
    gameStates.push(newGameState(10, 10));

gameStates[0].map[0][0] = [ 'P', 1, 0, 0 ];
gameStates[1].map[1][0] = [ 'P', 1, 0, 0 ];
gameStates[2].map[1][2] = [ 'P', 1, 0, 0 ];

// Render view
updateReplay();
