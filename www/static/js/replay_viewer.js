"use strict";

isWww = true;

// --- Replay ---
// Not used by the replay but by the spectator
function fetchNextState() {
}

function hasGameEnded() { return currentGameStateIndex >= gameStates.length - 1; }

// --- Main ---
function start_replay(dump) {
    let container = document.getElementById('canvas');

    updateViewSize();

    // Init
    initGraphics(container, mapWidth, mapHeight, null);

    // Load replay data
    loadDump(dump);
}
