"use strict";

// Main spectator script

function onNextClick() {
    // The server will play a turn and send the new game state
    fetch("/action/next_state").then(res => {
        if (res.status === 200)
            res.text().then(onNextStateFetched);
    });
}

function onNextStateFetched(nextStateJson) {
    console.log(`Got next state ${nextStateJson}`);
}
