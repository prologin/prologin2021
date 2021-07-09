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
        // obstacle
        else if (this.map[i][j].isObstacle()) {
          buffer0 = '#';
          buffer1 = '#';
          buffer2 = '#';
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

