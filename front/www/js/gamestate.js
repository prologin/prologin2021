
/*
 - map
 - pandas (positions)
 - bebe pandas (positions)
 - tiles
*/

// The main game state
let gameState = null;

/*
class Player
class Tile

deux matrices :
 - map
 - panda_matrix


*/

class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}


class Player {
  constructor() {
    this.pandas = [];
    this.points = 0;
  }
}


class GameState {
  // constructor
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = [];
    this.pandas = [];
    this.baby_pandas = [];
    this.bridges = [];
  }
  // methods
  init(map, pandas, baby_pandas, bridges) {
    initMap(map);
    initPandas(pandas);
    initBabyPandas(baby_pandas);
    initBridges(bridges);
  }
  initMap(map) {
    this.map = map;
  }
  initPandas(pandas) {
    this.pandas = pandas;
  }
  initBabyPandas(baby_pandas) {
    this.baby_pandas = baby_pandas;
  }
  initBridges(bridges) {
    this.bridges = bridges;
  }
  loadGame(map_str) {
    // reset/init
    this.initMap([[]]);
    this.initPandas([]);
    this.initBabyPandas([]);
    this.initBridges([]);
    // read map str
    var x = 0, y = 0, buffer = '';
    for (let i = 0; i < map_str.length; i++) {
      // get current char
      let c = map_str[i];

      // currently reading buffer ?
      if (c !== ' ' && c !== '\n') {
        // add char of tile to buffer and continue
        buffer += c;
        continue;
      }

      // - buffer has ended ! -

      // add hte buffer to the map (pas sur ?)
      this.map[y][x] = buffer; // j'avoue ne pas avoir bien compris qqchose, mais j'espère que cette ligne est OK ?

      // process & reset buffer
      this.processTileBuffer(buffer);
      buffer = '';

      // goto next coordinates
      x++;
      if (x == this.width) {
        this.x = 0;
        this.y++;
      }
    }
  }
  processTileBuffer(buffer) {
    console.log("process: " + buffer + "\n");
    // water tile
    if (buffer == '__') {
      return;
    }
    // panda tile
    if (buffer[0] == 'P') {
      let id = parseInt(buffer.substring(1));
      this.pandas.push(id);
    }
    // bridge tile
    if (buffer[0] == 'B') {
      let id = parseInt(buffer.substring(1));
      this.baby_pandas.push(id);
    }
    // baby panda
    let id = parseInt(buffer);
    this.baby_pandas.push(id);
  }
}

function test() {
  let test_map_str = '__ __ __ P1\n__ __ 11 __\nB2 __ 02\n__ P2 __ __';
  let gs = new GameState(4, 4);
  gs.loadGame(test_map_str);
  return gs;
}

// let gs = test();


/*


3 3
__ __ 12|P1|B2
P4 12|B5 __
__ __ __


*/

//
