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

// Brush value
let brush = ['P', 1, 0, 0];

// --- UI ---
let uiDumper = document.getElementById("dumper");
let uiCanvas = document.getElementById("canvas");
let uiBrush = document.getElementById("brush");
let uiSelect1 = document.getElementById("select1");
let uiSelect2 = document.getElementById("select2");

onBrushChange();

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

// When the brush selector has changed
function onBrushChange() {
    // Update select1 / select2 extra options
    switch (uiBrush.value) {
        case "eau":
            brush = null;
            uiSelect1.hidden = true;
            uiSelect2.hidden = true;
            break;
        case "panda":
            brush = null;
            uiSelect1.hidden = false;
            uiSelect2.hidden = true;

            onPandaBrush();
            break;
        case "pont":
            brush = null;
            uiSelect1.hidden = false;
            uiSelect2.hidden = false;

            onPontBrush();
            break;
    }
}

function onPandaBrush() {
    // Clear node
    while (uiSelect1.firstChild) {
        uiSelect1.removeChild(uiSelect1.firstChild);
    }

    // Select1 = kind
    let options = [
        "panda1",
        "panda2",
        "panda1_bebe",
        "panda2_bebe",
    ]

    for (let option of options) {
        let node = document.createElement("option");
        node.value = option;
        node.text = option;

        uiSelect1.appendChild(node);
    }
}

function onPontBrush() {
    // Clear nodes
    while (uiSelect1.firstChild) {
        uiSelect1.removeChild(uiSelect1.firstChild);
    }

    // Select1 = value
    for (let i = 1; i <= 6; ++i) {
        let option = `${i}`;

        let node = document.createElement("option");
        node.value = option;
        node.text = option;

        uiSelect1.appendChild(node);
    }

    // Clear nodes
    while (uiSelect2.firstChild) {
        uiSelect2.removeChild(uiSelect2.firstChild);
    }

    // Select2 = direction
    let options = [
        "n",
        "ne",
        "no",
        "s",
        "se",
        "so",
    ];

    for (let option of options) {
        let node = document.createElement("option");
        node.value = option;
        node.text = option;

        uiSelect2.appendChild(node);
    }
}

// --- Graphics ---
// Map size (in tiles)
let mapWidth = 6;
let mapHeight = 5;

// Compute canvas size (in pixels)
mapWidth = TILE_SIZE * (mapWidth * 3 / 4 + 1 / 4);
mapHeight = TILE_SIZE * (mapHeight + 1 / 2);

// All sprite tiles to be able to remove and redraw them
let tiles = [];

// Init
initGraphics(uiCanvas, mapWidth, mapHeight, onClick);

// Adds and registers a new tile sprite to the view
function addTile(tileName, x, y) {
    let sprite = newTile(tileName, x, y);

    tiles.push(sprite);
    app.stage.addChild(sprite);
}

// Removes all sprites of the view
function clearTiles() {
    for (let tile of tiles)
        app.stage.removeChild(tile);

    tiles = [];
}

function updateView() {
    // Remove old sprites
    clearTiles();

    // i is the vertical index
    for (let i = 0; i < gameState.height; ++i) {
        // j is the horizontal index
        for (let j = 0; j < gameState.width; ++j) {
            let [x, y] = getCoords(i, j);

            let tile = gameState.map[i][j];
            let tileName = tile !== null && tile[0] === 'P' ? 'panda1' : 'eau';

            addTile(tileName, x, y);
        }
    }
}

// When the canvas is clicked
function onClick(x, y) {
    // Convert to grid position
    let [i, j] = getPos(x, y);

    // Display
    // TODO : Update pandas

    if (i >= 0 && i < gameState.height && j >= 0 && j < gameState.width) {
        gameState.map[i][j] = brush;

        updateView();
    }
}

// --- Test ---
// Default game state
newGameState(10, 10);

gameState.map[0][0] = [ 'P', 1, 0, 0 ];

updateView();
