"use strict";

// Main map editor script

// --- UI ---
// let uiNew = document.getElementById("new");
// let uiDump = document.getElementById("dump");
let uiDumper = document.getElementById("dumper");
let uiCanvas = document.getElementById("canvas");

// TODO : New game state
function onNewClick() {
    let dimension =
        window.prompt("Taille de la carte (LARGEURxHAUTEUR)", "10x10");

    let dimensionFormat = /([\d]+)x([\d]+)/;

    // [wholeMatch, widthMatch, heightMatch] (or null)
    let match = dimension.match(dimensionFormat);

    if (match === null || match[0] !== dimension) {
        window.alert(
            "Taille de carte invalide (doit être de format LARGEURxHAUTEUR)");

        return;
    }

    // Parse dimensions
    let width = parseInt(match[1]);
    let height = parseInt(match[2]);

    console.log(`New ${width} ${height}`);
}

function onDumpClick() { uiDumper.value = "(map dump here)"; }

function onCopyClick() {
    // Copy uiDumper's text
    uiDumper.select();
    uiDumper.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

// --- Canvas ---
// Map size (in tiles)
let mapWidth = 6;
let mapHeight = 5;

// Compute canvas size (in pixels)
mapWidth = TILE_SIZE * (mapWidth * 3 / 4 + 1 / 4);
mapHeight = TILE_SIZE * (mapHeight + 1 / 2);

// Init
initGraphics(uiCanvas, mapWidth, mapHeight, onClick);

// --- Test ---
// i is the vertical index
for (let i = 0; i < 5; ++i) {
    // j is the horizontal index
    for (let j = 0; j < 6; ++j) {
        let [x, y] = getCoords(i, j);

        let sprite = newTile('eau', x, y);

        app.stage.addChild(sprite);
    }
}

// Adds a tile at the given grid position
// - Returns the sprite
function addTile(id, i, j) {
    let [x, y] = getCoords(i, j);
    let sprite = newTile(id, x, y);
    app.stage.addChild(sprite);

    return sprite;
}

addTile('pont_1_s', 0, 1);
addTile('pont_2_n', 1, 1);
addTile('pont_3_so', 1, 2);
addTile('pont_4_ne', 2, 1);

addTile('panda1', 0, 1);

addTile('panda2', 4, 4);

// When the canvas is clicked
function onClick(x, y) {
    // Convert to grid position
    let [i, j] = getPos(x, y);

    // Display
    console.log(`click ${i} ${j}`);
    addTile('panda1_bebe', i, j);
}
