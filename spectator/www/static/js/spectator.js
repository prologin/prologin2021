"use strict";

// Main spectator script

let gameEnded = false;

// --- UI ---
let uiGameInfo = document.getElementById("game-info");

// --- Spectator ---
function onStopClick() { fetch("/action/stop"); }

function fetchNextState() {
    if (!gameEnded) {
        // The server will play a turn and send the new game state
        fetch("/action/next_state").then(res => {
            if (res.status === 200) {
                res.text().then(onNextStateFetched);
            }
        });
    }
}

function onNextStateFetched(nextStateJson) {
    // If first state, update UI
    if (uiCanvas.hidden) {
        uiCanvas.hidden = false;
        uiGameInfo.hidden = false;
        document.getElementById("spectator-start").hidden = true;
    }

    // Parse and push new state
    gameStates.push(parseJSON(nextStateJson));

    // Update render
    onNextClick();

    if (gameStates.length === 1) {
        // Init
        mapWidth = gameStates[0].width;
        mapHeight = gameStates[0].height;

        updateViewSize();
        app.renderer.resize(mapWidth, mapHeight);
        updateReplay();
        startReplay();
    }
}

function endGame() {
    gameEnded = true;
    updateReplay();
}

function hasGameEnded() {
    return gameEnded && currentGameStateIndex == gameStates.length - 1;
}

// --- Main ---
// -1 because there is no game state at all when we start the spectator
currentGameStateIndex = -1;

uiCanvas.hidden = true;
uiGameInfo.hidden = true;

startReplay();
