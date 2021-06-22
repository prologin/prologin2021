"use strict";

// Main map editor script

// --- Globals ---
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
}

// --- UI ---
let uiCanvas = document.getElementById("canvas");

// --- Graphics ---
updateViewSize();

// Init
initGraphics(uiCanvas, mapWidth, mapHeight, null);

// --- Test ---
// Default game state
newGameState(10, 10);

gameState.map[0][0] = [ 'P', 1, 0, 0 ];

updateView();


function onPrevClick() {

}

function onNextClick() {

}
