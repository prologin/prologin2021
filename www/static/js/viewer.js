"use strict";

isWww = true;

let wwwWidth = 0;
let wwwTileWidth = 0;

// Loads the preview
function start_preview(container, map, width) {
    wwwWidth = width;
    let mapData = map.text().replace(/\n +/g, '\n').trim();
    container = container[0];

    updateViewSize();

    // Init
    initGraphics(container, mapWidth, mapHeight, null);

    // Load map
    onMapOpen(mapData);
}

// --- Globals ---
let allDirections = [
    "Nord",
    "Nord-Est",
    "Nord-Ouest",
    "Sud",
    "Sud-Est",
    "Sud-Ouest",
];

function newGameState(width, height) {
    if (width * height < 2) {
        width = 2;
        height = 2;

        alert("Les dimensions de la cartes sont trop petites, " +
              "les dimensions sont changées à 2x2");
    }

    // Update dimension values
    mapWidth = width;
    mapHeight = height;
    updateViewSize();

    // Update view dimensions
    app.renderer.resize(mapWidth, mapHeight);

    // Create new game state
    gameState = new GameState(width, height);

    // Set pandas start position
    gameState.panda_map[0][0].panda = new Panda(1, 1);
    gameState.panda_map[0][1].panda = new Panda(1, 2);
    gameState.panda_map[1][0].panda = new Panda(2, 1);
    gameState.panda_map[1][1].panda = new Panda(2, 2);

    updateView();
}

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

// --- Main ---
// Called when there is a map to open at start
function onMapOpen(data) {
    gameState = loadGameStateFromMapStr(data);
    // change width + height
    mapWidth = gameState.width;
    mapHeight = gameState.height;

    wwwTileWidth = wwwWidth / mapWidth;

    updateViewSize();
    // Update view dimensions
    app.renderer.resize(mapWidth, mapHeight);
    // Update the view
    updateView();
}
