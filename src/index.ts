import * as PIXI from 'pixi.js';
import Penguin from './penguin';
import setupWS from './websocket';

const app = new PIXI.Application({
  width: 640,
  height: 360,
  backgroundColor: 0x00ffd4,
});

// Fit screen size
// app.renderer.view.style.position = 'absolute'
// app.renderer.view.style.display = 'block'
// app.renderer.autoResize = true
// app.renderer.resize(window.innerWidth, window.innerHeight)

document.body.appendChild(app.view);

PIXI.loader.add('assets/penguin/penguin.json').load(setup);

function setup() {
  const frames = [0, 1, 0, 2];
  const textures = {
    left: frames.map(frame => PIXI.Texture.fromFrame(`penguin-0-${frame}`)),
    up: frames.map(frame => PIXI.Texture.fromFrame(`penguin-1-${frame}`)),
    right: frames.map(frame => PIXI.Texture.fromFrame(`penguin-2-${frame}`)),
    down: frames.map(frame => PIXI.Texture.fromFrame(`penguin-3-${frame}`)),
  };

  Penguin.init(app.stage, textures);
  const penguin = new Penguin();
  penguin.addKeyboardControl();
  penguin.joinStage();

  setupWS(penguin);
}
