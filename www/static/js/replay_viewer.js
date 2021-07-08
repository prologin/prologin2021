"use strict";

let wwwWidth = 0;
let wwwTileWidth = 0;

// --- Replay ---
// Not used by the replay but by the spectator
function fetchNextState() {
}

function hasGameEnded() { return currentGameStateIndex >= gameStates.length - 1; }

// --- Main ---
function start_replay(dump, width) {
    wwwWidth = width;
    let container = document.getElementById('canvas');

    document.body.addEventListener('keypress', onKey);

    // Init
    initGraphics(container, 0, 0, null);

    // Load replay data
    loadDump(dump);
}
