// TODO : Move to graphics
// Init app
let app = new PIXI.Application({width : VIEW_WIDTH, height : VIEW_HEIGHT});

document.body.appendChild(app.view);

// Load textures
const TILES = [
    'panda',
    'panda_bebe',
    'eau',
];

let textures = {};

for (let tile in TILES) {
    textures[TILES[tile]] = PIXI.Texture.from(`static/images/${TILES[tile]}.png`);
}

// Draw
let sprite = new PIXI.Sprite(textures['panda']);

app.stage.addChild(sprite);
