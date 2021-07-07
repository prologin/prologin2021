"use strict";

// Main replay script

// --- Replay ---
// Not used by the replay but by the spectator
function fetchNextState() {
}

// Not used by the replay but by the spectator
function hasGameEnded() {
    return false;
}

// --- Test ---
// // Create 3 states
// for (let i = 0; i < 3; ++i)
//     gameStates.push(newGameState(10, 10));

// gameStates[0].panda_map[0][0].panda = new Panda(1, 1);
// gameStates[1].panda_map[1][0].panda = new Panda(1, 1);
// gameStates[2].panda_map[1][1].panda = new Panda(1, 1);

// gameStates[0].panda_map[3][0].panda = new Panda(2, 1);
// gameStates[1].panda_map[3][1].panda = new Panda(2, 1);
// gameStates[2].panda_map[3][2].panda = new Panda(2, 1);

// for (let gs of gameStates) {
//     // TODO
//     // for (let i = 0; i < 6; ++i) {
//     //     for (let j = 0; j < 6; ++j) {
//     //         gs.map[i][j].bridge = [i + 1, j + 1];
//     //     }
//     // }

//     // gs.map[9][1].bridge = [5, 1];
//     // gs.map[9][2].bridge = [3, 2];

//     gs.panda_map[2][1].baby_panda = new BabyPanda(1, 1);
//     gs.panda_map[2][2].baby_panda = new BabyPanda(2, 1);
// }

// Load dump named dump.json if necessary
fetch("/dump.json").then(res => {
    if (res.status === 200)
        res.text().then(loadDump);
    else
        console.error('No dump.json found');
});


// Called when there is a dump to load
function loadDump(data) {
    gameStates.push(parseJSON(data));

    console.log(gameStates);

    mapWidth = gameStates[0].width;
    mapHeight = gameStates[0].height;

    updateViewSize();
    app.renderer.resize(mapWidth, mapHeight);
    updateReplay();
    startReplay();
}
