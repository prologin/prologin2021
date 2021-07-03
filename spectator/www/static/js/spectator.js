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

    // TODO : Update state
    console.log(`Got next state ${nextStateJson}`);

    // TODO : The nextStateJson will contain a field end of game
    if (gameStates.length >= 10) {
        endGame();
        return;
    }

    // TODO : Remove (test)
    let gs = newGameState(10, 10);
    gs.panda_map[(currentGameStateIndex + 1) % 10][0].panda = new Panda(1, 1);
    gameStates.push(gs);

    // Update render
    onNextClick();
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
