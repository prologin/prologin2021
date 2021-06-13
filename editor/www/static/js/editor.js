// Init app
let app = new PIXI.Application({width : VIEW_WIDTH, height : VIEW_HEIGHT});

document.body.appendChild(app.view);

const texture = PIXI.Texture.from('static/images/panda.png');

let sprite = new PIXI.Sprite(texture);

app.stage.addChild(sprite);
