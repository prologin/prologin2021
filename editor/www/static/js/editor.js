"use strict";

// Main map editor script

// --- Globals ---
function newGameState(width, height) {
    gameState = new GameState(width, height);

    // Init empty map (filled with water)
    for (let i = 0; i < height; ++i) {
        gameState.map.push([]);
        for (let j = 0; j < width; ++j) {
            gameState.map[i].push(null);
        }
    }

    updateView();
}

let gameState = null;

// --- UI ---
let uiDumper = document.getElementById("dumper");
let uiCanvas = document.getElementById("canvas");

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

    newGameState(width, height);
}

function onDumpClick() { uiDumper.value = "(map dump here)"; }

function onCopyClick() {
    // Copy uiDumper's text
    uiDumper.select();
    uiDumper.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

// --- Graphics ---
// Map size (in tiles)
let mapWidth = 6;
let mapHeight = 5;

// Compute canvas size (in pixels)
mapWidth = TILE_SIZE * (mapWidth * 3 / 4 + 1 / 4);
mapHeight = TILE_SIZE * (mapHeight + 1 / 2);

// Init
initGraphics(uiCanvas, mapWidth, mapHeight, onClick);

function updateView() {
    // TODO : Remove old sprites

    // i is the vertical index
    for (let i = 0; i < gameState.height; ++i) {
        // j is the horizontal index
        for (let j = 0; j < gameState.width; ++j) {
            let [x, y] = getCoords(i, j);

            let tile = gameState.map[i][j];
            let tileName = tile !== null && tile[0] === 'P' ? 'panda1' : 'eau';

            let sprite = newTile(tileName, x, y);

            app.stage.addChild(sprite);
        }
    }
}

// When the canvas is clicked
function onClick(x, y) {
    // Convert to grid position
    let [i, j] = getPos(x, y);

    // Display
    // console.log(`click ${i} ${j}`);
    // addTile('panda1_bebe', i, j);
    // TODO : Check within map + brush value
    gameState.map[i][j] = ['P', 1, i, j];

    updateView();
}

// --- Test ---
// Default game state
newGameState(10, 10);
gameState.map[0][0] = [ 'P', 1, 0, 0 ];

updateView();
