// Main map editor script

// Init
initGraphics();

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

// To verify coordinates are working
let [x, y] = getCoords(0, 1);

let sprite = newTile('panda1', x, y);

app.stage.addChild(sprite);
