const ClientEngine = require('lance-gg').ClientEngine;
const MyRenderer = require('../client/MyRenderer');

class MyClientEngine extends ClientEngine {
  constructor(gameEngine, options) {
    super(gameEngine, options, MyRenderer);
    const engine = this;

    engine.serializer.registerClass(require('../common/PlayerAvatar'));
    engine.gameEngine.on('client__preStep', engine.preStep.bind(engine));

    // keep a reference for key press state
    engine.pressedKeys = {
      down: false,
      up: false,
      left: false,
      right: false,
      space: false,
    };

    document.onkeydown = (e) => {
      engine.onKeyChange(e, true);
    };
    document.onkeyup = (e) => {
      engine.onKeyChange(e, false);
    };
  }

  // our pre-step is to process all inputs
  preStep() {
    if (this.pressedKeys.up) {
      this.sendInput('up', { movement: true });
    }

    if (this.pressedKeys.down) {
      this.sendInput('down', { movement: true });
    }

    if (this.pressedKeys.left) {
      this.sendInput('left', { movement: true });
    }

    if (this.pressedKeys.right) {
      this.sendInput('right', { movement: true });
    }

    if (this.pressedKeys.space) {
      this.sendInput('space', { movement: true });
    }
  }

  onKeyChange(e, isDown) {
    e = e || window.event;

    if (e.keyCode == '38') {
      this.pressedKeys.up = isDown;
    }
    else if (e.keyCode == '40') {
      this.pressedKeys.down = isDown;
    }
    else if (e.keyCode == '37') {
      this.pressedKeys.left = isDown;
    }
    else if (e.keyCode == '39') {
      this.pressedKeys.right = isDown;
    }
    else if (e.keyCode == '32') {
      this.pressedKeys.space = isDown;
    }
  }
}

module.exports = MyClientEngine;
