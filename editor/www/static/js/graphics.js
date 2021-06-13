// Contains functions to display the game state

// PIXI's application object
let app = null;

// All textures
// textures[textureName] = PIXI's texture object
let textures = {};

// Inits canvas, textures...
function initGraphics() {
    // Load application
    app = new PIXI.Application({width : VIEW_WIDTH, height : VIEW_HEIGHT});

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
function newTile(id, x=0, y=0) {
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
