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
    for (let tile in TILES) {
        textures[TILES[tile]] =
            PIXI.Texture.from(`front/images/${TILES[tile]}.png`);
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
function getCoords(i, j) {
    let yOffset = j % 2 == 0 ? TILE_SIZE / 2 : 0;

    return [ j * TILE_SIZE * 3 / 4, yOffset + i * TILE_SIZE ];
}

// Get 2d indices of a tile from its coordinates
// - Returns [i, j] (may be negative / invalid if click outside of grid)
// * Use let [i, j] = getCoords(...);
function getPos(x, y) {
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
    for (let tile of tiles)
        app.stage.removeChild(tile);

    tiles = [];
}

// Redraws the game state
function updateView() {
    // Remove old sprites
    clearTiles();

    // i is the vertical index
    for (let i = 0; i < gameState.height; ++i) {
        // j is the horizontal index
        for (let j = 0; j < gameState.width; ++j) {
            let [x, y] = getCoords(i, j);

            // TODO : Update when map format will change
            let tile = gameState.map[i][j];
            let tileName = tile !== null && tile[0] === 'P' ? 'panda1' : 'eau';

            addTile(tileName, x, y);
        }
    }
}
