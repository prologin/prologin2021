"use strict";

// Main replay script

// --- Replay ---
// Not used by the replay but by the spectator
function fetchNextState() {}

function hasGameEnded() { return currentGameStateIndex >= gameStates.length - 1; }

// --- Main ---
// Load dump named dump.json if necessary
fetch("/dump.json").then(res => {
    if (res.status === 200) {
        res.text().then(loadDump);
    } else {
        alert('Pas de fichier replay trouvé, exemple : ./launch_replay.sh replay-example.json');
    }
});
