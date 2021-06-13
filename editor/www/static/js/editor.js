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

function addTile(id, i, j) {
    let [x, y] = getCoords(i, j);
    let sprite = newTile(id, x, y);
    app.stage.addChild(sprite);
}

addTile('pont_1_s', 0, 1);
addTile('pont_2_n', 1, 1);
addTile('pont_3_so', 1, 2);
addTile('pont_4_ne', 2, 1);

addTile('panda1', 0, 1);
