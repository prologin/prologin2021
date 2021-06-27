// The main game state
let gameState = null;

class MapTile {
  // constructor
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.bridge = null;
  }
  // methods
  isEmpty() { return this.bridge === null; }
  isBridge() { return !this.isEmpty(); }
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


class Player {
  // constructor
  constructor(id) {
    this.id = id;
    this.pandas = [];
    this.baby_pandas = [];
    this.points = 0;
  }
}


class GameState {
  // constructor
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = this.initMap();
    this.panda_map = this.initPandaMap();
    this.players = {'1': new Player(1),
                    '2': new Player(2)};
  }
  // methods
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
        map[i][j] = null;
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
        if (i != map_str.length - 1) {
          continue;
        }
      }

      // - buffer has ended ! -

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
  }
  processTileBuffer(buffer, x, y) {
    console.log("process: " + buffer + "\n");
    // ___ empty/water
    if (buffer == '___') {
      console.log('water');
      return;
    }

    // a baby panda ?
    if (buffer[0] == 'C') { // } || buffer[0] == 'Z' /*buffer.substring(1) == '00'*/) {
      this.panda_map[y][x] = new BabyPanda(this.players['1'], parseInt(buffer.substring(1)));
      console.log('Baby panda: ' + buffer);
      return;
    }
    if (buffer[0] == 'Z') { // } || buffer[0] == 'Z' /*buffer.substring(1) == '00'*/) {
      this.panda_map[y][x] = new BabyPanda(this.players['Z'], parseInt(buffer.substring(1)));
      console.log('Baby panda: ' + buffer);
      return;
    }

    // a panda (with a bridge) !
    console.log('Panda: ' + buffer);
    // panda
    let player = (buffer[0] == 'A' || buffer[0] == 'B') ? '1' : '2';
    this.panda_map[y][x] = new Panda(this.players[player], buffer[0]);
    // bridge
    let direction = parseInt(buffer[1]);
    let value = parseInt(buffer[2]);
    this.map[y][x].bridge = [direction, value]

    return;
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
  let gs = new GameState(width, height);
  gs.loadMap(map);

  return gs;
}

var test_str = '3 3\n\
A11 ___ ___\n\
C99 ___ Z00\n\
B23 X45 Y61';

// let gs = loadGameStateFromMapStr(test_str);

//
