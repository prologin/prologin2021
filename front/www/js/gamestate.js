
/*
 - map
 - pandas (positions)
 - bebe pandas (positions)
 - tiles
*/

// The main game state
let gameState = null;

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
  loadGame(game_string) {
    // format
    let str = game_string.replace(/ /g, '');
    str = str.replace(/\n/g, '');
    console.log('str', str);
    // reset/init
    this.initMap([[]]);
    this.initPandas([]);
    this.initBabyPandas([]);
    this.initBridges([]);
    // read map str
    let x = 0, y = 0, obj = null;
    for (var i = 0; i < str.length; i += 2) {
      var c1 = str[i];
      var c2 = str[i+1];
      console.log('c12', c1, c2);
      switch(c1) {
        case '_': // water
          obj = null;
          break;
        case 'P': // panda
          obj = [c1, parseInt(c2), x, y]
          this.pandas.push(obj); // use hex for id's ?
          break;
        case 'B': // baby panda
          obj = [c1, parseInt(c2), x, y]
          this.baby_pandas.push(obj);
          break;
        default: // bridge ?
          obj = [c1, parseInt(c2), x, y];
          this.bridges.push(obj);
          break;
      }
      //
      this.map[y][x] = obj;

      // incr coordinates
      x++;
      if (x == this.width) {
        this.x = 0;
        this.y++;
      }
    }
  }
}

/*
function test() {
  const s = '__ __ __ P1\n11 __ B2 __\n02 __ P2 __ __';
  let gs = new GameState(4, 3);
  gs.loadGame(s);
  return gs;
}

let gs = test();
*/






//
