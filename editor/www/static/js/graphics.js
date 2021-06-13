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

function loadTextures() {
    for (let tile in TILES) {
        textures[TILES[tile]] =
            PIXI.Texture.from(`static/images/${TILES[tile]}.png`);
    }
}
