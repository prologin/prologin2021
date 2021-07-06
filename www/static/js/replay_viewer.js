"use strict";

isWww = true;

// --- Replay ---
// Not used by the replay but by the spectator
function fetchNextState() {
}

// Not used by the replay but by the spectator
function hasGameEnded() {
    return false;
}

// --- Main ---
function start_replay(container, dump) {
    container = container[0];

    updateViewSize();

    // Init
    initGraphics(container, mapWidth, mapHeight, null);

    // Load replay data
    loadDump(dump);

    // Setup auto replay etc.
    startReplay();
}

function loadDump(data) {
    // TODO : Load the game state list (gameStates) using the dump data (string)
    // Create 3 states
    for (let i = 0; i < 3; ++i) {
        gameStates.push(newGameState(10, 10));
    }

    gameStates[0].panda_map[0][0].panda = new Panda(1, 1);
    gameStates[1].panda_map[1][0].panda = new Panda(1, 1);
    gameStates[2].panda_map[1][1].panda = new Panda(1, 1);

    gameStates[0].panda_map[3][0].panda = new Panda(2, 1);
    gameStates[1].panda_map[3][1].panda = new Panda(2, 1);
    gameStates[2].panda_map[3][2].panda = new Panda(2, 1);

    for (let gs of gameStates) {
        gs.panda_map[2][1].baby_panda = new BabyPanda(1, 1);
        gs.panda_map[2][2].baby_panda = new BabyPanda(2, 1);
    }

    // Render view
    updateReplay();
}
