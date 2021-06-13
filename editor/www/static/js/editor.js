// Main map editor script

// Init
initGraphics();

// --- Test ---
// i is the vertical index
for (let i = 0; i < 5; ++i) {
    // j is the horizontal index
    for (let j = 0; j < 6; ++j) {
        let yOffset = j % 2 == 0 ? TILE_SIZE / 2 : 0;

        let sprite =
            newTile('eau', j * TILE_SIZE * 3 / 4, yOffset + i * TILE_SIZE);

        app.stage.addChild(sprite);
    }
}
