'use strict';

const DynamicObject = require('lance-gg').serialize.DynamicObject;

class Player extends DynamicObject {
  constructor(id, x, playerId) {
    super(id);
    this.position.set(x, 0);
    this.playerId = playerId;
    this.class = Player;
  }

  onAddToWorld(gameEngine) {
    if (gameEngine.renderer) {
      gameEngine.renderer.addSprite(this, 'paddle');
    }
  }
}

module.exports = Player;
