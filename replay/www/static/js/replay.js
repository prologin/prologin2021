"use strict";

// Main replay script

// --- Replay ---
// Not used by the replay but by the spectator
function fetchNextState() {}

// Not used by the replay but by the spectator
function hasGameEnded() { return false; }

// --- Main ---
// Load dump named dump.json if necessary
fetch("/dump.json").then(res => {
    if (res.status === 200) {
        res.text().then(loadDump);
    } else {
        // TODO : Remove test
        console.error('No dump.json found, example dump parsed');

        let dump = `{ "round": { "round_id": 0, "player_id": 0, "panda_id": 0 }, "map": { "size": { "x": 4, "y": 5 }, "cells": [ { "position": { "x": 0, "y": 0 }, "type": "PONT", "value": 1, "direction": "NORD_EST", "is_start": true, "panda": true, "player": 0, "id": 0 }, { "position": { "x": 0, "y": 1 }, "type": "PONT", "value": 4, "direction": "SUD_EST", "is_start": false, "panda": false }, { "position": { "x": 0, "y": 2 }, "type": "LIBRE" }, { "position": { "x": 0, "y": 3 }, "type": "PONT", "value": 6, "direction": "SUD_EST", "is_start": true, "panda": false }, { "position": { "x": 0, "y": 4 }, "type": "LIBRE" }, { "position": { "x": 1, "y": 0 }, "type": "PONT", "value": 3, "direction": "SUD_OUEST", "is_start": false, "panda": false }, { "position": { "x": 1, "y": 1 }, "type": "BEBE", "player": 0, "id": 0 }, { "position": { "x": 1, "y": 2 }, "type": "PONT", "value": 5, "direction": "NORD_OUEST", "is_start": true, "panda": true, "player": 0, "id": 1 }, { "position": { "x": 1, "y": 3 }, "type": "LIBRE" }, { "position": { "x": 1, "y": 4 }, "type": "PONT", "value": 2, "direction": "NORD_OUEST", "is_start": false, "panda": false }, { "position": { "x": 2, "y": 0 }, "type": "LIBRE" }, { "position": { "x": 2, "y": 1 }, "type": "LIBRE" }, { "position": { "x": 2, "y": 2 }, "type": "LIBRE" }, { "position": { "x": 2, "y": 3 }, "type": "PONT", "value": 1, "direction": "SUD", "is_start": true, "panda": true, "player": 1, "id": 0 }, { "position": { "x": 2, "y": 4 }, "type": "PONT", "value": 4, "direction": "NORD", "is_start": false, "panda": false }, { "position": { "x": 3, "y": 0 }, "type": "PONT", "value": 2, "direction": "SUD", "is_start": true, "panda": true, "player": 1, "id": 1 }, { "position": { "x": 3, "y": 1 }, "type": "PONT", "value": 6, "direction": "NORD", "is_start": false, "panda": false }, { "position": { "x": 3, "y": 2 }, "type": "LIBRE" }, { "position": { "x": 3, "y": 2 }, "type": "BEBE", "player": 1, "id": 0 }, { "position": { "x": 3, "y": 4 }, "type": "LIBRE" } ] }, "players": [ { "id": 0, "name": "anonymous", "score": 0, "total_babies": 1, "pandas": [ { "id": 0, "pos": { "x": 0, "y": 0 }, "saved_babies": 0 }, { "id": 1, "pos": { "x": 1, "y": 2 }, "saved_babies": 0 } ], "last_actions": [] }, { "id": 1, "name": "anonymous", "score": 0, "total_babies": 1, "pandas": [ { "id": 0, "pos": { "x": 2, "y": 3 }, "saved_babies": 0 }, { "id": 1, "pos": { "x": 3, "y": 0 }, "saved_babies": 0 } ], "last_actions": [] } ]}
            { "round": { "round_id": 1, "player_id": 0, "panda_id": 0 }, "map": { "size": { "x": 4, "y": 5 }, "cells": [ { "position": { "x": 0, "y": 0 }, "type": "PONT", "value": 2, "direction": "NORD_EST", "is_start": true, "panda": true, "player": 0, "id": 0 }, { "position": { "x": 0, "y": 1 }, "type": "PONT", "value": 4, "direction": "SUD_EST", "is_start": false, "panda": false }, { "position": { "x": 0, "y": 2 }, "type": "LIBRE" }, { "position": { "x": 0, "y": 3 }, "type": "PONT", "value": 6, "direction": "SUD_EST", "is_start": true, "panda": false }, { "position": { "x": 0, "y": 4 }, "type": "LIBRE" }, { "position": { "x": 1, "y": 0 }, "type": "PONT", "value": 3, "direction": "SUD_OUEST", "is_start": false, "panda": false }, { "position": { "x": 1, "y": 1 }, "type": "BEBE", "player": 0, "id": 0 }, { "position": { "x": 1, "y": 2 }, "type": "PONT", "value": 5, "direction": "NORD_OUEST", "is_start": true, "panda": true, "player": 0, "id": 1 }, { "position": { "x": 1, "y": 3 }, "type": "LIBRE" }, { "position": { "x": 1, "y": 4 }, "type": "PONT", "value": 2, "direction": "NORD_OUEST", "is_start": false, "panda": false }, { "position": { "x": 2, "y": 0 }, "type": "LIBRE" }, { "position": { "x": 2, "y": 1 }, "type": "LIBRE" }, { "position": { "x": 2, "y": 2 }, "type": "LIBRE" }, { "position": { "x": 2, "y": 3 }, "type": "PONT", "value": 1, "direction": "SUD", "is_start": true, "panda": true, "player": 1, "id": 0 }, { "position": { "x": 2, "y": 4 }, "type": "PONT", "value": 4, "direction": "NORD", "is_start": false, "panda": false }, { "position": { "x": 3, "y": 0 }, "type": "PONT", "value": 2, "direction": "SUD", "is_start": true, "panda": true, "player": 1, "id": 1 }, { "position": { "x": 3, "y": 1 }, "type": "PONT", "value": 6, "direction": "NORD", "is_start": false, "panda": false }, { "position": { "x": 3, "y": 2 }, "type": "LIBRE" }, { "position": { "x": 3, "y": 3 }, "type": "BEBE", "player": 1, "id": 0 }, { "position": { "x": 3, "y": 4 }, "type": "LIBRE" } ] }, "players": [ { "id": 0, "name": "anonymous", "score": 0, "total_babies": 1, "pandas": [ { "id": 0, "pos": { "x": 0, "y": 0 }, "saved_babies": 0 }, { "id": 1, "pos": { "x": 1, "y": 2 }, "saved_babies": 0 } ], "last_actions": [] }, { "id": 1, "name": "anonymous", "score": 0, "total_babies": 1, "pandas": [ { "id": 0, "pos": { "x": 2, "y": 3 }, "saved_babies": 0 }, { "id": 1, "pos": { "x": 3, "y": 0 }, "saved_babies": 0 } ], "last_actions": [] } ]}`;
        loadDump(dump);
    }
});

// Called when there is a dump to load
// The dump is multiple game states dumps separated by a new line
function loadDump(data) {
    let lines = data.split('\n');

    if (lines.length === 0) {
        console.error('Empty dump, cannot parse');
        return;
    }

    // Parse
    for (let line of lines) {
        gameStates.push(parseJSON(line));
    }

    // Render
    mapWidth = gameStates[0].width;
    mapHeight = gameStates[0].height;

    updateViewSize();
    app.renderer.resize(mapWidth, mapHeight);
    updateReplay();
    startReplay();
}
