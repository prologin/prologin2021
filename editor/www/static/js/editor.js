"use strict";

// Main map editor script

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

// Brush value (bridge, panda...)
let brush;

// --- UI ---
let uiDumper = document.getElementById("dumper");
let uiCanvas = document.getElementById("canvas");
let uiBrush = document.getElementById("brush");
let uiSelect1 = document.getElementById("select1");
let uiSelect2 = document.getElementById("select2");
let uiSelect1Info = document.getElementById("select1-info");
let uiSelect2Info = document.getElementById("select2-info");

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

function onDumpClick() { uiDumper.value = gameState.exportToMapStr(); }

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
        uiSelect1Info.textContent = "";
        uiSelect2Info.textContent = "";
        break;
    case "panda":
        brush = null;
        uiSelect1.hidden = false;
        uiSelect2.hidden = false;
        uiSelect1Info.textContent = "Type";
        uiSelect2Info.textContent = "Identifiant";

        onPandaBrush();
        break;
    case "pont":
        brush = null;
        uiSelect1.hidden = false;
        uiSelect2.hidden = false;
        uiSelect1Info.textContent = "Valeur";
        uiSelect2Info.textContent = "Direction";

        onPontBrush();
        break;
    }
}

function onPandaBrush() {
    // Clear nodes
    while (uiSelect1.firstChild) {
        uiSelect1.removeChild(uiSelect1.firstChild);
    }

    // Select1 = kind
    let options = [
        "Panda (joueur 1)",
        "Panda (joueur 2)",
        "Bébé panda (joueur 1)",
        "Bébé panda (joueur 2)",
        "Effacer",
    ];

    for (let option of options) {
        let node = document.createElement("option");
        node.value = option;
        node.text = option;

        uiSelect1.appendChild(node);
    }

    // Clear nodes
    while (uiSelect2.firstChild) {
        uiSelect2.removeChild(uiSelect2.firstChild);
    }

    // Select2 = id
    options = [
        "Premier",
        "Deuxième",
    ];

    for (let option of options) {
        let node = document.createElement("option");
        node.value = option;
        node.text = option;

        uiSelect2.appendChild(node);
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
    for (let option of allDirections) {
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
    switch (uiBrush.value) {
    case 'eau':
        brush = null;
        break;
    case 'pont':
        let value = parseInt(uiSelect1.value);
        let directionId = allDirections.indexOf(uiSelect2.value) + 1;
        brush = [ directionId, value ];
        break;
    case 'panda':
        let firstId = uiSelect2.value === "Premier";
        let id = firstId ? 1 : 2;

        switch (uiSelect1.value) {
        case 'Panda (joueur 1)':
            brush = new Panda("1", firstId ? "A" : "B");
            break;
        case 'Panda (joueur 2)':
            brush = new Panda("2", firstId ? "X" : "Y");
            break;
        case 'Bébé panda (joueur 1)':
            brush = new BabyPanda("1", id);
            break;
        case 'Bébé panda (joueur 2)':
            brush = new BabyPanda("2", id);
            break;
        case 'Effacer':
            brush = null;
            break;
        }
        break;
    }
}

// Removes the panda (Panda or BabyPanda)
// in the brush variable
// Used to avoid two pandas of the same type
function removeBrushPanda() {
    for (let i = 0; i < gameState.height; ++i) {
        for (let j = 0; j < gameState.width; ++j) {
            let panda = gameState.panda_map[i][j].panda;

            if (panda !== null && panda !== undefined &&
                panda.id === brush.id) {
                gameState.panda_map[i][j].panda = null;
                return;
            }
        }
    }
}

// When the canvas is clicked
function onClick(x, y) {
    // Convert to grid position
    let [i, j] = getPos(x, y);

    updateBrush();

    // Display
    if (i >= 0 && i < gameState.height && j >= 0 && j < gameState.width) {
        // Delete
        if (brush === null) {
            gameState.map[i][j].bridge = null;
            gameState.panda_map[i][j].baby_panda = null;
        } else if (brush instanceof Panda) {
            if (!gameState.panda_map[i][j].isEmpty())
                return;

            removeBrushPanda();
            gameState.panda_map[i][j].panda = brush;
            gameState.panda_map[i][j].baby_panda = null;
        } else if (brush instanceof BabyPanda) {
            if (gameState.panda_map[i][j].isPanda())
                return;

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
newGameState(10, 10); // how avoid this ?

onBrushChange();
updateView();

// Load map named open.map if necessary
fetch("/open.map").then(res => {
    if (res.status === 200)
        res.text().then(onMapOpen);
});

// Called when there is a map to open at start
function onMapOpen(data) {
    gameState = loadGameStateFromMapStr(data);
    // change width + height
    mapWidth = gameState.width;
    mapHeight = gameState.height;
    updateViewSize();
    // Update view dimensions
    app.renderer.resize(mapWidth, mapHeight);
    // Update the view
    updateView();
}
