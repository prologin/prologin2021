"use strict";

// Main map editor script

// --- Globals ---
function newGameState(width, height) {
    // Update dimension values
    mapWidth = width;
    mapHeight = height;
    updateViewSize();

    // Update view dimensions
    app.renderer.resize(mapWidth, mapHeight);

    // Create new game state
    gameState = new GameState(width, height);

    updateView();
}

// Brush value (bridge, panda...)
let brush;

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
    let options =
        [
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
updateViewSize();

// Init
initGraphics(uiCanvas, mapWidth, mapHeight, onClick);

// Updates the brush value based on the <select> nodes
function updateBrush() {
    // TODO : Change option names
    switch (uiBrush.value) {
    case 'eau':
        brush = null;
        break;
    case 'pont':
        let value = parseInt(uiSelect1.value);
        let directionId = DIRECTIONS.indexOf(uiSelect2.value) + 1;
        brush = [directionId, value];
        break;
    case 'panda':
        // TODO : Id option
        switch (uiSelect1.value) {
            case 'panda1':
                brush = new Panda(1, 1);
                break;
            case 'panda2':
                brush = new Panda(2, 1);
                break;
            case 'panda1_bebe':
                brush = new BabyPanda(1, 1);
                break;
            case 'panda2_bebe':
                brush = new BabyPanda(2, 1);
                break;
        }
        break;
    }
}

// When the canvas is clicked
function onClick(x, y) {
    // Convert to grid position
    let [i, j] = getPos(x, y);

    updateBrush();

    // Display
    // TODO : Update pandas
    if (i >= 0 && i < gameState.height && j >= 0 && j < gameState.width) {
        // Water
        if (brush === null) {
            gameState.map[i][j].bridge = null;
        } else if (brush instanceof Panda) {
            gameState.panda_map[i][j].panda = brush;
            gameState.panda_map[i][j].baby_panda = null;
        } else if (brush instanceof BabyPanda) {
            gameState.panda_map[i][j].panda = null;
            gameState.panda_map[i][j].baby_panda = brush;
        } else if (brush instanceof Array) {
            gameState.map[i][j].bridge = brush;
        } else {
            console.warn('Invalid brush');
            console.warn(brush);
        }

        updateView();
    }
}

// --- Main ---
// Default game state
newGameState(10, 10);

// TODO : Default panda positions (map area must be > 2)

updateView();

// Load map named open.map if necessary
fetch("/open.map")
    .then(res => {
        if (res.status === 200)
            res.text().then(onMapOpen);
    });

// Called when there is a map to open at start
function onMapOpen(data) {
    console.log(`Map to open data : ${data}`);
}
