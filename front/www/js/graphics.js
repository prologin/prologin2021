// Contains functions to display the game state

// PIXI's application object
let app = null;

// All textures
// textures[textureName] = PIXI's texture object
let textures = {};

// All sprite tiles to be able to remove and redraw them
let tiles = [];

// Map size (in tiles)
let mapWidth = 0;
let mapHeight = 0;

// Inits canvas, textures...
// - viewParent : An html element (usually a div) where the view is added
// - onClick : If not null, function(x: int, y: int) called when the
// mouse is pressed
function initGraphics(viewParent, width = VIEW_WIDTH, height = VIEW_HEIGHT,
                      onClick = null) {
    // Load application
    app = new PIXI.Application({
        width : width,
        height : height,
        antialias : true,
        backgroundColor : BG_COLOR,
    });

    // Load resources
    loadTextures();

    // Set up events
    if (onClick !== null) {
        app.view.addEventListener(
            "click",
            function(event) { onClick(event.offsetX, event.offsetY); });
    }

    // Update UI (display canvas)
    viewParent.appendChild(app.view);
}

// Called in initGraphics, loads all textures
function loadTextures() {
    let prefix = isWww ? '/static/img' : '/front/images';

    for (let tile in TILES) {
        textures[TILES[tile]] =
            PIXI.Texture.from(`${prefix}/${TILES[tile]}.png`);
    }
}

// Creates a new tile sprite
// * Use getCoords for the coordinates
function newTile(id, x = 0, y = 0) {
    if (!(id in textures)) {
        throw `Texture "${id}" not found`;
    }

    let sprite = new PIXI.Sprite(textures[id]);

    sprite.position.x = x;
    sprite.position.y = y;
    sprite.height = TILE_SIZE;
    sprite.width = TILE_SIZE;

    return sprite;
}

// Get coordinates of a tile from its 2d indices
// - i : Vertical index (0 = top)
// - j : Horizontal index (0 = left)
// Returns [x, y]
// * Use let [x, y] = getCoords(...);
function getCoords(i, j) { // hexa -> pixel
    let yOffset = j % 2 == 0 ? TILE_SIZE / 2 : 0;

    return [ j * TILE_SIZE * 3 / 4, yOffset + i * TILE_SIZE ];
}

// Get 2d indices of a tile from its coordinates
// - Returns [i, j] (may be negative / invalid if click outside of grid)
// * Use let [i, j] = getCoords(...);
function getPos(x, y) { // pixel -> hexa
    let j = Math.floor(x / (TILE_SIZE * 3 / 4));
    let yOffset = j % 2 == 0 ? TILE_SIZE / 2 : 0;
    let i = Math.floor((y - yOffset) / TILE_SIZE);

    return [ i, j ];
}

// Computes the view size and update it
function updateViewSize() {
    mapWidth = TILE_SIZE * (mapWidth * 3 / 4 + 1 / 4);
    mapHeight = TILE_SIZE * (mapHeight + 1 / 2);
}

// Adds and registers a new tile sprite to the view
function addTile(tileName, x, y) {
    let sprite = newTile(tileName, x, y);

    tiles.push(sprite);
    app.stage.addChild(sprite);
}

// Removes all sprites of the view
function clearTiles() {
    /*
    for (let tile of tiles)
        app.stage.removeChild(tile);
    */

    // delete all children
    while (app.stage.children[0]) {
        app.stage.removeChild(app.stage.children[0])
    }

    tiles = [];
}

// Returns pseudo randomly the index of
// the water tile for the position (i, j)
// Pseudo random because we want to have
// the same texture for the same position
// at different moment (game step)
function getWaterTileIndex(i, j) {
    let h = (2 + i + (j + 1) * 3) % N_WATER_TEXTURES;

    return h;
}

// Draws a layer of the map
// The map has two layers
function drawMapLayer(layer, isForeground) {
    // i is the vertical index
    for (let i = 0; i < gameState.height; ++i) {
        // j is the horizontal index
        for (let j = 0; j < gameState.width; ++j) {
            let [x, y] = getCoords(i, j);

            let tile = layer[i][j];
            let tileName;

            // Both MapTile's and PandaMapTile's have this method (derived from
            // Tile class)
            if (isForeground && tile.isEmpty())
                continue;

            if (tile instanceof PandaMapTile) {
                if (tile.isBabyPanda()) {
                    tileName = `panda${tile.baby_panda.player}_bebe`;
                } else if (tile.isPanda()) {
                    tileName = `panda${tile.panda.player}`;
                }
            } else if (tile instanceof Tile) {
                if (tile.isBridge()) {
                    let direction = DIRECTIONS[tile.bridge.direction - 1];
                    tileName = `pont_${tile.bridge.value}_${direction}`;
                } else {
                    let index = getWaterTileIndex(i, j) + 1;
                    tileName = `eau${index}`;
                }
            } else {
                console.warn('Invalid tile at position ' + i + ' ' + j + ' ' +
                             (isForeground ? '(foreground)' : '(background)'));
                console.warn(tile);
            }

            if (tileName !== undefined) {
                addTile(tileName, x, y);
                // if it is a bridge, draw the + or -
                if (tileName.startsWith('pont_')) {
                    drawBridgeSign(tile.bridge, [ x, y ]);
                }
            }
        }
    }
}

function drawBridgeSign(bridge, pos) {
    let x = pos[0], y = pos[1];
    let text = new PIXI.Text(
        bridge.sign == 1 ? '+' : '-',
        {fontFamily : 'Arial', fontSize : 14, fill : 0, align : 'center'});
    text.anchor.set(
        0.5,
        0.5); // sets the anchor to the center, I think. Looks crap without it
    text.position.x = x + TILE_SIZE / 2 + 9;
    text.position.y = y + TILE_SIZE - 9;
    app.stage.addChild(text);
}

// Redraws the game state
function updateView() {
    // Remove old sprites
    clearTiles();

    // Draw layers in order (background then foreground)
    drawMapLayer(gameState.map, false);
    drawMapLayer(gameState.panda_map, true);
}
