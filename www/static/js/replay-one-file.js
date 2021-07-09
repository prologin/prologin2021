/*      -       PROLOGIN.JS         - */
// Some definitions / constants

// Dimensions (px)
const VIEW_WIDTH = 512;
const VIEW_HEIGHT = 512;
const TILE_SIZE = 64;

// Directions
const DIRECTIONS = [
    'ne',
    'se',
    's',
    'so',
    'no',
    'n',
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
    'eau1',
    'eau2',
    'eau3',
    'eau4',
    'obstacle',
    'flag_blue',
    'flag_green',
    'flag_red',
].concat(bridgeTiles);

const N_WATER_TEXTURES = 4;

// Graphics
const BG_COLOR = 0x5689E5;


/*      -       GRAPHICS.JS         - */
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
function initGraphics(viewParent, width, height,
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
    let prefix = '/static/img';

    for (let tile in TILES) {
        textures[TILES[tile]] =
            PIXI.Texture.from(`${prefix}/${TILES[tile]}.png`);
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
    sprite.width = getTileWidth();
    sprite.height = getTileHeight();

    return sprite;
}

// Get coordinates of a tile from its 2d indices
// - i : Vertical index (0 = top)
// - j : Horizontal index (0 = left)
// Returns [x, y]
// * Use let [x, y] = getCoords(...);
function getCoords(i, j) { // hexa -> pixel
    let yOffset = j % 2 == 0 ? getTileHeight() / 2 : 0;

    return [ j * getTileWidth() * 3 / 4, yOffset + i * getTileHeight() ];
}

// Get 2d indices of a tile from its coordinates
// - Returns [i, j] (may be negative / invalid if click outside of grid)
// * Use let [i, j] = getCoords(...);
function getPos(x, y) { // pixel -> hexa
    let j = Math.floor(x / (getTileWidth() * 3 / 4));
    let yOffset = j % 2 == 0 ? getTileHeight() / 2 : 0;
    let i = Math.floor((y - yOffset) / getTileHeight());

    return [ i, j ];
}

// Computes the view size and update it
function updateViewSize() {
    mapWidth = getTileWidth() * (mapWidth * 3 / 4 + 1 / 4);
    mapHeight = getTileHeight() * (mapHeight + 1 / 2);
}

// Adds and registers a new tile sprite to the view
function addTile(tileName, x, y) {
    let sprite = newTile(tileName, x, y);

    tiles.push(sprite);
    app.stage.addChild(sprite);
}

// Removes all sprites of the view
function clearTiles() {
    /*
    for (let tile of tiles)
        app.stage.removeChild(tile);
    */

    // delete all children
    while (app.stage.children[0]) {
        app.stage.removeChild(app.stage.children[0])
    }

    tiles = [];
}

// Returns pseudo randomly the index of
// the water tile for the position (i, j)
// Pseudo random because we want to have
// the same texture for the same position
// at different moment (game step)
function getWaterTileIndex(i, j) {
    let h = (2 + i + (j + 1) * 3) % N_WATER_TEXTURES;

    return h;
}

// Draws a layer of the map
// The map has two layers
function drawMapLayer(layer, mode) {
    // i is the vertical index
    for (let i = 0; i < gameState.height; ++i) {
        // j is the horizontal index
        for (let j = 0; j < gameState.width; ++j) {
            let [x, y] = getCoords(i, j);

            let tile = layer[i][j];

            if (mode == 2) {
                if (tile != 0)
                    draw_debug_flag(i, j, tile);
                continue;
            }

            let tileName;

            // Both MapTile's and PandaMapTile's have this method (derived from
            // Tile class)
            if (mode == 1 && tile.isEmpty())
                continue;

            if (tile instanceof PandaMapTile) {
                if (tile.isBabyPanda()) {
                    tileName = `panda${tile.baby_panda.player}_bebe`;
                } else if (tile.isPanda()) {
                    tileName = `panda${tile.panda.player}`;
                }
            } else if (tile instanceof Tile) {
                if (tile.isBridge()) {
                    let direction = DIRECTIONS[tile.bridge.direction - 1];
                    tileName = `pont_${tile.bridge.value}_${direction}`;
                } else if (tile.isObstacle()) {
                    tileName = 'obstacle';
                } else {
                    let index = getWaterTileIndex(i, j) + 1;
                    tileName = `eau${index}`;
                }
            } else {
                console.warn('Invalid tile at position ' + i + ' ' + j + ' ' +
                             (mode == 1 ? '(foreground)' : '(background)'));
                console.warn(tile);
            }

            if (tileName !== undefined) {
                addTile(tileName, x, y);
                // if it is a bridge, draw the + or -
                if (tileName.startsWith('pont_')) {
                    drawBridgeSign(tile.bridge, [ x, y ]);
                }
            }
        }
    }
}

function drawBridgeSign(bridge, pos) {
    let x = pos[0], y = pos[1];
    let text = new PIXI.Text(
        bridge.sign == 1 ? '+' : '-',
        {fontFamily : 'Arial', fontSize : 14, fill : 0, align : 'center'});
    text.anchor.set(
        0.5,
        0.5); // sets the anchor to the center, I think. Looks crap without it
    text.position.x = x + getTileWidth() / 2 + 9;
    text.position.y = y + getTileHeight() - 9;
    app.stage.addChild(text);
}

// Redraws the game state
function updateView() {
    // Remove old sprites
    clearTiles();

    // Draw layers in order (background then foreground)
    gameState.execute_actions();
    drawMapLayer(gameState.map, 0);
    drawMapLayer(gameState.panda_map, 1);
    drawMapLayer(debug_flag_map, 2);
}

function getTileWidth() {
    return wwwTileWidth;
}

function getTileHeight() {
    return wwwTileWidth;
}


/*      -       GAMESTATE.JS         - */
// The main game state
let gameState = null;
let debug_flag_map = null;

function initDebugFlagMap(gs) {
  debug_flag_map = Array.from(Array(gs.height), () => new Array(gs.width));
  for (let i = 0; i < gs.height; i++) {
    for (let j = 0; j < gs.width; j++) {
      debug_flag_map[i][j] = 0;
    }
  }
}

class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  isEmpty() {
    throw 'This method should be overwritten';
    return false;
  }
}

class MapTile extends Tile {
  // constructor
  constructor(x, y) {
    super(x, y);
    this.bridge = null;
    this.obstacle = null;
  }
  // methods
  isEmpty() { return !(isBridge() || isObstacle()) }
  isBridge() { return this.bridge != null; }
  isObstacle() { return this.obstacle != null; }
}

class PandaMapTile extends Tile {
  // constructor
  constructor(x, y) {
    super(x, y);
    this.panda = null;
    this.baby_panda = null;
  }
  // methods
  isEmpty() {return !(this.isPanda() || this.isBabyPanda()); }
  isPanda() { return this.panda !== null; }
  isBabyPanda() { return this.baby_panda !== null; }
}

class Panda {
  // constructor
  constructor(player, id) {
    this.player = player;
    this.id = id;
  }
  // methods
}

class BabyPanda {
  // constructor
  constructor(player, id) {
    this.player = player;
    this.id = id;
  }
  // methods
}

class BridgeTile {
  // constructor
  constructor(value, direction, sign, pos) {
    this.value = value; // 1-6
    this.direction = direction; // 1-6
    this.sign = sign; // -1 or +1 (int value)
    this.pos = pos; // [x, y]
  }
  // methods
  toCardinalDirStr() {
    return DIRECTIONS[this.direction - 1];
  }
}

class Obstacle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}


class Player {
  // constructor
  constructor(id) {
    this.id = id;
    this.pandas = [];
    this.baby_pandas = [];
    this.points = 0;
    this.babies_on_back_1 = 0;
    this.babies_on_back_2 = 0;
  }
}


class GameState {
  // constructor
  constructor(width, height, debug = false) {
    this.debug = debug;
    this.width = width;
    this.height = height;
    this.round = 0;
    this.map = this.initMap();
    this.panda_map = this.initPandaMap();
    this.players = {'1': new Player(1),
                    '2': new Player(2)};
    if (this.debug) console.log('New GameState: w =', this.width, ' & h =', this.height);
    if (debug_flag_map == null) {
      initDebugFlagMap(this);
    }
    this.actions = [];
  }
  // methods
  execute_actions() {
    for (let action of this.actions) {
      handle_action(action);
    }
  }
  initMap() {
    let map = Array.from(Array(this.height), () => new Array(this.width));
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        map[i][j] = new MapTile(j, i);
      }
    }

    return map;
  }
  initPandaMap() {
    let map = Array.from(Array(this.height), () => new Array(this.width));
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        map[i][j] = new PandaMapTile(j, i);
      }
    }

    return map;
  }
  loadMap(map_str) {
    // read map str
    var x = 0, y = 0, buffer = '';
    for (let i = 0; i < map_str.length; i++) {
      // get current char
      let c = map_str[i];

      // currently reading buffer ?
      if (c !== ' ' && c !== '\n') {
        // add char of tile to buffer and continue
        buffer += c;
        if (buffer.length != 3 || i != map_str.length - 1) {
          continue;
        }
      }
      if (buffer.length != 3) {
        console.warn('Invalid buffer: "', buffer, '"');
        buffer = '';
        continue;
      }

      // - buffer has ended ! -
      if (this.debug) console.log('tile at', [x, y], ':', buffer);

      // process & reset buffer
      this.processTileBuffer(buffer, x, y);
      buffer = '';

      // goto next coordinates
      x++;
      if (x == this.width) {
        x = 0;
        y++;
      }
    }
    this.deduceBridgeSigns();
  }
  processTileBuffer(buffer, x, y) {
    if (this.debug) console.log("process: " + buffer + "\n");
    // ___ water
    if (buffer == '___') {
      if (this.debug) console.log('water');
      return;
    }
    // ### obstacle
    if (buffer == '###') {
      if (this.debug) console.log('obstacle');
      this.map[y][x].obstacle = new Obstacle(x, y);
      return;
    }

    // a baby panda ?
    if (buffer[0] == 'C') { // } || buffer[0] == 'Z' /*buffer.substring(1) == '00'*/) {
      let baby = new BabyPanda('1', parseInt(buffer.substring(1)));
      this.panda_map[y][x].baby_panda = baby;
      this.players['1'].baby_pandas.push(baby);
      if (this.debug) console.log('Baby panda: ' + buffer);
      return;
    }
    if (buffer[0] == 'Z') { // } || buffer[0] == 'Z' /*buffer.substring(1) == '00'*/) {
      let baby = new BabyPanda('2', parseInt(buffer.substring(1)));
      this.panda_map[y][x].baby_panda = baby;
      this.players['2'].baby_pandas.push(baby);
      if (this.debug) console.log('Baby panda: ' + buffer);
      return;
    }

    // a panda
    if (buffer[0] != '+' && buffer[0] != '-') {
      if (this.debug) console.log('Panda: ' + buffer);
      let player = (buffer[0] == 'A' || buffer[0] == 'B') ? '1' : '2';
      let panda = new Panda(player, buffer[0]);
      this.panda_map[y][x].panda = panda;
      this.players[player].pandas.push(panda);
    }

    // bridge
    if (this.debug) console.log('Bridge: ' + buffer);
    let value = parseInt(buffer[1]);
    let direction = parseInt(buffer[2]);
    // only save the buffer[0], because we will look at the signs later
    this.map[y][x].bridge = [value, direction, buffer[0], [x, y]];

    return;
  }
  deduceBridgeSigns() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let array = this.map[y][x].bridge;
        if (array == null) continue;
        let value     = array[0],
            direction = array[1],
            sign      = array[2],
            pos       = array[3];
        let sign_value = 0;
        if (sign == '+') {
          sign_value = 1;
        } else if (sign == '-') {
          sign_value = -1;
        } else {
          let partner_bridge_pos = this.getPosByDirectionStr(pos, DIRECTIONS[direction - 1]); // returns [x, y]
          let partner_bridge = this.map[partner_bridge_pos[1]][partner_bridge_pos[0]].bridge; // access [y][x]
          if (this.debug) console.log('partner bridge', partner_bridge);
          if (partner_bridge instanceof BridgeTile) {
            sign_value = -partner_bridge.sign;
          } else {
            if (this.debug) console.log('array', pos, DIRECTIONS[direction - 1], partner_bridge_pos);
            if (partner_bridge[2] == '-') {
              sign_value = 1;
            } else {
              sign_value = -1;
            }
          }
        }
        this.map[y][x].bridge = new BridgeTile(value, direction, sign_value, pos);
      }
    }
  }
  getPosByDirectionStr(pos, direction_str) {
    let x = pos[0], y = pos[1],
        nx = -1, ny = -1;
    switch(direction_str) {
      case 'n':
        nx = x;
        ny = y - 1;
        break;
      case 'ne':
        nx = x + 1;
        ny = y;
        if (x % 2 == 1) {
          ny--;
        }
        break;
      case 'no':
        nx = x - 1;
        ny = y;
        if (x % 2 == 1) {
          ny--;
        }
        break;
      case 's':
        nx = x;
        ny = y + 1;
        break;
      case 'se':
        nx = x + 1;
        ny = y;
        if (x % 2 == 0) {
          ny++;
        }
        break;
      case 'so':
        nx = x - 1;
        ny = y;
        if (x % 2 == 0) {
          ny++;
        }
    }

    return [nx, ny];
  }
  //
  exportToMapStr() {
    let s = this.width + ' ' + this.height + '\n';
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let buffer0 = '_', buffer1 = '_', buffer2 = '_';
        // bridge
        if (this.map[i][j].isBridge()) {
          buffer0 = this.map[i][j].bridge.sign == 1 ? '+' : '-';
          buffer1 = this.map[i][j].bridge.value.toString();
          buffer2 = this.map[i][j].bridge.direction.toString();
        }
        // panda
        if (this.panda_map[i][j].isPanda()) {
          buffer0 = this.panda_map[i][j].panda.id;
        }
        // baby panda
        else if (this.panda_map[i][j].isBabyPanda()) {
          buffer0 = this.panda_map[i][j].baby_panda.player == '1' ? 'C' : 'Z';
          let tmp = this.panda_map[i][j].baby_panda.id.toString();
          buffer1 = (~~(tmp / 10)).toString(); // (~~(tmp / 10)) is integer division of tmp by 10
          buffer2 = (tmp % 10).toString();
        }
        // water
        else {
          // start off by being water, so ...
        }
        // append buffer
        s += buffer0 + buffer1 + buffer2;
        // append ' '
        if (j !== this.width - 1) {
          s += ' ';
        }
      }
      // goto next line
      s += '\n';
    }

    return s;
  }
}

function loadGameStateFromMapStr(str) {
  // initial parse on input str
  let return_index = str.indexOf('\n');
  let dimensions = str.substring(0, return_index);
  let map = str.substring(return_index + 1);
  // get dimensions
  let dim_array = dimensions.split(' ');
  let width = parseInt(dim_array[0]);
  let height = parseInt(dim_array[1]);
  // create gamestate
  let gs = new GameState(width, height, false);
  gs.loadMap(map);

  return gs;
}


function draw_debug_flag(x, y, enum_value) {
  let color;
  if (enum_value == 1) {
    color = 0x0000ff;
  } else if (enum_value == 2) {
    color = 0x00ff00;
  } else if (enum_value == 3) {
    color = 0xff0000;
  } else {
    console.warn('Unknown debug flag enum', enum_value);
    color = 0xbbbbbb;
  }
  let [fx, fy] = getCoords(x, y);
  let text = new PIXI.Text(
        'FLAG',
        {fontFamily : 'Arial', fontSize : 18, fill : 0, align : 'center', fill: color});
    text.anchor.set(
        0.5,
        0.5); // sets the anchor to the center, I think. Looks crap without it
    text.position.x = fx + TILE_SIZE / 2;
    text.position.y = fy + TILE_SIZE / 2;
    app.stage.addChild(text);
}

function change_debug_flag(debug_drapeau, pos) {
  let [x, y] = pos;
  debug_flag_map[y][x] = debug_drapeau;
}



/*      -       PARSER.JS         - */
// 'use strict'; // better not use strict mode for parsing

/**
 * Takes in a raw json string. Returns the corresponing GameState object
 * @param    {String}    raw        Raw json string
 */
function parseJSON(raw)
{
    // Parse the Json data
    try {
        var obj = JSON.parse(raw);
        //console.log(obj);
    } catch {
        return null;
    }
    // create new GameState
    let width = obj['map']['size']['x'],
        height = obj['map']['size']['y'];
    let gameState = new GameState(width, height);
    gameState.round = obj['round']['round_id'];
    // every cell
    for (let cell of obj['map']['cells'])
    {
        let x = cell['position']['x'],
            y = cell['position']['y'];
        switch(cell['type'])
        {
            case 'LIBRE':
                continue;
            case 'BEBE':
                gameState.panda_map[y][x].baby_panda = new BabyPanda(
                    (cell['player'] + 1).toString(),
                    cell['id']
                );
                break;
            case 'PONT':
                if (cell['panda'])
                    gameState.panda_map[y][x].panda = new Panda(
                        (cell['player'] + 1).toString(),
                        cell['id']
                    );
                gameState.map[y][x].bridge = new BridgeTile(
                    cell['value'],
                    directionIntFromFullStr(cell['direction']),
                    cell['is_start'] ? 1 : -1,
                    [x, y]
                )
                break;
            case 'OBSTACLE':
              gameState.map[y][x].obstacle = new Obstacle(x, y);
              break;
            default:
                console.warn('Unknown cell type: ', cell['type']);
                break;
        }
    }

    // points & babies
    gameState.players['1'].points = obj.players[0].score;
    gameState.players['2'].points = obj.players[1].score;
    gameState.players['1'].babies_on_back_1 = obj.players[0].pandas[0].saved_babies;
    gameState.players['1'].babies_on_back_2 = obj.players[0].pandas[1].saved_babies;
    gameState.players['2'].babies_on_back_1 = obj.players[1].pandas[0].saved_babies;
    gameState.players['2'].babies_on_back_2 = obj.players[1].pandas[1].saved_babies;

    // actions
    for (let action of obj['players'][0]['last_actions']) {
        gameState.actions.push(action);
    }
    for (let action of obj['players'][1]['last_actions']) {
        gameState.actions.push(action);
    }

    return gameState;
}

function handle_action(action) {
    switch(action['action_type']) {
        case 'afficher_debug_drapeau':
            let debug_drapeau = action['debug_drapeau'];
            let pos = [action['pos'].x, action['pos'].y];
            change_debug_flag(debug_drapeau, pos);
            break;
        default:
            console.warn('Unknown action type:', action['action_type']);
            break;
    }
}

function directionIntFromFullStr(direction_str)
{
    switch(direction_str)
    {
        case 'NORD_EST': return 1;
        case 'SUD_EST': return 2;
        case 'SUD': return 3;
        case 'SUD_OUEST': return 4;
        case 'NORD_OUEST': return 5;
        case 'NORD': return 6;
        default:
            console.warn('Unknown direction str: ', direction_str);
            return -1;
    }
}



/*      -       REPLAY_VIEWER.JS         - */
"use strict";

let wwwWidth = 0;
let wwwTileWidth = 0;

// --- Replay ---
// Not used by the replay but by the spectator
function fetchNextState() {
}

function hasGameEnded() { return currentGameStateIndex >= gameStates.length - 1; }

// --- Main ---
function start_replay(dump, width) {
    wwwWidth = width;
    let container = document.getElementById('canvas');

    document.body.addEventListener('keypress', onKey);

    // Init
    initGraphics(container, 0, 0, null);

    // Load replay data
    loadDump(dump);
}


/*      -       REPLAY_UTILS.JS         - */
"use strict";

// Some utilities used by the replay and the spectator

// To use this script :
// - Define the procedure fetchNextState()
// - Define the predicate hasGameEnded()
// - Call startReplay() when the graphics are initialized

// --- Globals ---
// The replay is a collection of game states
let gameStates = [];

// The current game state to render
let currentGameStateIndex = 0;

// Next state every N ms with this option
let autoreplay = false;

const AUTOREPLAY_PERIOD_MS = 500;

function newGameState(width, height) {
    // Update dimension values
    mapWidth = width;
    mapHeight = height;

    updateViewSize();

    // Update view dimensions
    app.renderer.resize(mapWidth, mapHeight);

    // Create new game state
    gameState = new GameState(width, height);

    updateView();

    return gameState;
}

// --- UI ---
let uiCanvas = document.getElementById("canvas");
let uiStateIndicator = document.getElementById("state-indicator");
let uiP1Points = document.getElementById("p1-points");
let uiP2Points = document.getElementById("p2-points");
let uiP1Babies = document.getElementById("p1-babies");
let uiP2Babies = document.getElementById("p2-babies");
let uiAutoReplay = document.getElementById("autoreplay");
let uiWinner = document.getElementById("winner");
let uiWinnerTitle = document.getElementById("winner-title");
let uiWinnerImg = document.getElementById("winner-img");

function onPrevClick() {
    // Disable autoreplay
    if (autoreplay) {
        onAutoReplayChange(false);
    }

    if (currentGameStateIndex > 0)
        --currentGameStateIndex;

    updateReplay();
}

function onNextClick() {
    if (currentGameStateIndex < gameStates.length - 1) {
        ++currentGameStateIndex;
    } else {
        // Try to add the next state (used by the spectator)
        // If a state is added, call this function again
        fetchNextState();

        return;
    }

    // Render the next game state
    updateReplay();
}

function onAutoReplayChange(forceValue = undefined) {
    autoreplay = forceValue === undefined ? !autoreplay : forceValue;

    if (forceValue !== undefined) {
        uiAutoReplay.checked = autoreplay;
    }

    if (autoreplay)
        autoreplayLoop();
    else
        window.clearTimeout(autoreplayLoop);
}

// When a key is pressed
function onKey(e) {
    let useful = true;
    switch (e.key.toUpperCase()) {
    case " ":
        // Toggle autoreplay
        onAutoReplayChange();
        uiAutoReplay.checked = autoreplay;
        break;
    case "N":
        // Next state
        onNextClick();
        break;
    case "B":
        // Previous state
        onPrevClick();
        break;
    default:
        useful = false;
        break;
    }

    if (useful)
        e.preventDefault();
}

function updateReplay() {
    if (gameStates.length == 0)
        return;

    // gameState is the rendered state
    gameState = gameStates[currentGameStateIndex];

    // Update GUI
    let gameEnded = hasGameEnded();
    uiStateIndicator.textContent =
        gameEnded ? `Partie terminée (${gameStates.length} tours)`
                  : `${currentGameStateIndex + 1} / ${gameStates.length} tours`
    uiP1Points.textContent =
        `Joueur 1 : ${gameState.players['1'].points} points`;
    uiP2Points.textContent =
        `Joueur 2 : ${gameState.players['2'].points} points`;
    uiP1Babies.textContent = `Bébés sauvés du joueur 1 : ${
        gameState.players['1'].babies_on_back_1} (panda 1) / ${
        gameState.players['1'].babies_on_back_2} (panda 2)`;
    uiP2Babies.textContent = `Bébés sauvés du joueur 2 : ${
        gameState.players['2'].babies_on_back_1} (panda 1) / ${
        gameState.players['2'].babies_on_back_2} (panda 2)`;

    if (gameEnded) {
        showWinners();
    } else {
        hideWinners();
    }

    updateView();
}

// Timer when we need to make an auto replay step
function autoreplayLoop() {
    if (autoreplay) {
        autoreplayStep();

        // Loop again
        window.setTimeout(autoreplayLoop, AUTOREPLAY_PERIOD_MS);
    }
}

// Auto replay game state update
function autoreplayStep() { onNextClick(); }

// Function to be called when the graphics are initialized
function startReplay() {
    autoreplay = uiAutoReplay.checked;

    if (autoreplay) {
        autoreplayLoop();
    }
}

// Called when there is a dump to load
// The dump is multiple game states dumps separated by a new line
function loadDump(data) {
    let lines = data.split('\n');

    if (lines.length === 0) {
        console.error('Empty dump, cannot parse');
        return;
    }

    // Parse
    for (let line of lines) {
        let gs = parseJSON(line);
        if (gs == null)
            continue;
        gameStates.push(gs);
    }

    // Render
    mapWidth = gameStates[0].width;
    mapHeight = gameStates[0].height;

    wwwTileWidth = wwwWidth / mapWidth;

    updateViewSize();

    app.renderer.resize(mapWidth, mapHeight);
    updateReplay();
    startReplay();
}

function showWinners() {
    uiWinner.hidden = false;

    if (!uiWinnerImg.classList.contains('winner-img')) {
        uiWinnerImg.classList.add('winner-img');
        uiWinnerTitle.classList.add('winner-title');
    }

    let gs = gameStates[gameStates.length - 1];
    if (gs.players['1'].points == gs.players['2'].points) {
        uiWinnerTitle.textContent = 'Match nul !';
    } else {
        let p1Wins = gs.players['1'].points > gs.players['2'].points;
        let winner =
            `Joueur ${p1Wins ? '1' : '2'}`;
        uiWinnerTitle.textContent = `Bravo ${winner}`;

        let pref = '/static/img/';
        uiWinnerImg.src = pref + (p1Wins ? 'panda1.png' : 'panda2.png');
    }
}

function hideWinners() {
    uiWinner.hidden = true;
    uiWinnerImg.classList.remove('winner-img');
    uiWinnerTitle.classList.remove('winner-title');
}


