
/*
 - map
 - pandas (positions)
 - bebe pandas (positions)
 - tiles
*/

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
  // getters
  loadGame(str) {
    // format
    str = str.replace(/ /g, '');
    str = str.replace(/\n/g, '');
    // reset/init
    initMap([]);
    initPandas([]);
    initBabyPandas([]);
    initBridges([]);
    // read map str
    let x = 0, y = 0, obj = null;
    for (var i = 0; i < str.length; i += 2) {
      var c1 = str[i];
      var c2 = str[i+1];
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
      map[y][x] = obj;

      // incr coordinates
      x++;
      if (x == this.width) {
        this.x = 0;
        this.y++;
      }
    }
  }
}











//
