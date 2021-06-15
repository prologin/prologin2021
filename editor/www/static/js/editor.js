"use strict";

// Main map editor script

// Map size (in tiles)
let mapWidth = 6;
let mapHeight = 5;

// Compute canvas size (in pixels)
mapWidth = TILE_SIZE * (mapWidth * 3 / 4 + 1 / 4);
mapHeight = TILE_SIZE * (mapHeight + 1 / 2);

// Init
initGraphics(
    mapWidth,
    mapHeight,
    onClick);

// --- Test ---
// i is the vertical index
for (let i = 0; i < 5; ++i) {
    // j is the horizontal index
    for (let j = 0; j < 6; ++j) {
        let [x, y] = getCoords(i, j);

        let sprite = newTile('eau', x, y);

        app.stage.addChild(sprite);
    }
}

// Adds a tile at the given grid position
// - Returns the sprite
function addTile(id, i, j) {
    let [x, y] = getCoords(i, j);
    let sprite = newTile(id, x, y);
    app.stage.addChild(sprite);

    return sprite;
}

addTile('pont_1_s', 0, 1);
addTile('pont_2_n', 1, 1);
addTile('pont_3_so', 1, 2);
addTile('pont_4_ne', 2, 1);

addTile('panda1', 0, 1);

addTile('panda2', 4, 4);

// When the canvas is clicked
function onClick(x, y) {
    // Convert to grid position
    let [i, j] = getPos(x, y);

    // Display
    console.log(`click ${i} ${j}`);
    addTile('panda1_bebe', i, j);
}
