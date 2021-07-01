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

class PandaMapTile {
  // constructor
  constructor(x, y) {
    this.x = x;
    this.y = y;
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


class Player {
  // constructor
  constructor(id) {
    this.id = id;
    this.pandas = [];
    this.baby_pandas = [];
    this.points = 0;
    this.babies_on_back = 0;
  }
}


class GameState {
  // constructor
  constructor(width, height, debug = false) {
    this.debug = debug;
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
    if (this.debug) console.log("process: " + buffer + "\n");
    // ___ empty/water
    if (buffer == '___') {
      if (this.debug) console.log('water');
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
    if (buffer[0] != '_') {
      if (this.debug) console.log('Panda: ' + buffer);
      let player = (buffer[0] == 'A' || buffer[0] == 'B') ? '1' : '2';
      let panda = new Panda(player, buffer[0]);
      this.panda_map[y][x].panda = panda;
      this.players[player].pandas.push(panda);
    }

    // bridge
    if (this.debug) console.log('Bridge: ' + buffer);
    let direction = parseInt(buffer[1]);
    let value = parseInt(buffer[2]);
    this.map[y][x].bridge = [direction, value]

    return;
  }
  //
  exportToMapStr() {
    let s = this.width + ' ' + this.height + '\n';
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let buffer0 = '_', buffer1 = '_', buffer2 = '_';
        // bridge
        if (this.map[i][j].isBridge()) {
          buffer1 = this.map[i][j].bridge[0].toString();
          buffer2 = this.map[i][j].bridge[1].toString();
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

var test_str = '4 3\n\
A11 ___ ___ Z01\n\
C99 ___ Z00 ___\n\
B23 X45 Y61 ___';

// let gs = loadGameStateFromMapStr(test_str);

//
