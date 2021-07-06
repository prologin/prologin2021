// Some definitions / constants

// Dimensions (px)
// TODO : May change depending on the map size
const VIEW_WIDTH = 512;
const VIEW_HEIGHT = 512;
const TILE_SIZE = 64;

// Whether we are in the www website
let isWww = false;

// Directions
const DIRECTIONS = [
    'n',
    'ne',
    'no',
    's',
    'se',
    'so',
];

// Texture names
let bridgeTiles =
    Array.from({length : 36},
               (_, i) => `pont_${i % 6 + 1}_${DIRECTIONS[Math.floor(i / 6)]}`);

// result :
// 1 0
// 2 0
// .
// .
// .
// 1 1
// 2 1
// .
// .
// .

const TILES = [
    'panda1',
    'panda1_bebe',
    'panda2',
    'panda2_bebe',
    'eau',
].concat(bridgeTiles);

// Graphics
const BG_COLOR = 0x4DA0E6;
