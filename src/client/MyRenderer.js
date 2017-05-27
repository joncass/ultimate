'use strict';

const Renderer = require('lance-gg').render.Renderer;

class MyRenderer extends Renderer {

  constructor(gameEngine, clientEngine) {
    super(gameEngine, clientEngine);
    this.sprites = {};
  }

  draw() {
    super.draw();

    for (const objId of Object.keys(this.sprites)) {
      if (this.sprites[objId].el) {
        const position = this.gameEngine.world.objects[objId].position;
        const style = this.sprites[objId].el.style;

        style.top = position.y + 'px';
        style.left = position.x + 'px';
      }
    }
  }

  addSprite(obj, objName) {
    if (objName === 'paddle') {
      objName += obj.id;
    }

    this.sprites[obj.id] = {
      el: document.querySelector('.' + objName),
    };
  }
}

module.exports = MyRenderer;
