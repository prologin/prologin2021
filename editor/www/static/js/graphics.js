// Contains functions to display the game state

// PIXI's application object
let app = null;

// All textures
// textures[textureName] = PIXI's texture object
let textures = {};

// Inits canvas, textures...
function initGraphics() {
    // Load application
    app = new PIXI.Application({
        width : VIEW_WIDTH,
        height : VIEW_HEIGHT,
        antialias : true,
        backgroundColor : BG_COLOR,
    });

    // Load resources
    loadTextures();

    // Update UI (display canvas)
    document.body.appendChild(app.view);
}

// Called in initGraphics, loads all textures
function loadTextures() {
    for (let tile in TILES) {
        textures[TILES[tile]] =
            PIXI.Texture.from(`static/images/${TILES[tile]}.png`);
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
