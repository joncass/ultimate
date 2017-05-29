'use strict';

const GameEngine = require('lance-gg').GameEngine;

const Player = require('./Player');
const Disc = require('./Disc');
const MOVEMENT_STEP = 5;
const PADDING = 20;
const WIDTH = 800;
const HEIGHT = 500;
const PLAYER_WIDTH = 10;
const PLAYER_HEIGHT = 50;

class UltimateGame extends GameEngine {
  constructor(options) {
    super(options);
  }

  start() {
    super.start();

    this.on('postStep', () => {
      this.postStepHandleDisc();
    });

    this.on('objectAdded', (object) => {
      if (object.id == 1 && object.class == Player) {
        this.player1 = object;
      }
      else if (object.id == 2 && object.class == Player) {
        this.player2 = object;
      }
      else if (object.class == Disc) {
        this.disc = object;
      }
      else {
        throw new Error('Unexpected object was added!');
      }
    });
  }
  initGame() {
    this.addObjectToWorld(
      new Player(++this.world.idCount, PADDING, 1)
    );
    this.addObjectToWorld(
      new Player(++this.world.idCount, WIDTH - PADDING, 2)
    );
    this.addObjectToWorld(
      new Disc(++this.world.idCount, WIDTH / 2, HEIGHT / 2)
    );
  }

  registerClasses(serializer) {
    serializer.registerClass(require('./Player'));
    serializer.registerClass(require('./Disc'));
  }

  processInput(inputData, playerId) {
    super.processInput(inputData, playerId);

    // get the player tied to the player socket
    const player = this.world.getPlayerObject(playerId);
    if (player) {
      if (
        inputData.input === 'up'
        && player.position.y > 0
      ) {
        player.position.y -= MOVEMENT_STEP;
      }
      else if (
        inputData.input === 'down'
        && player.position.y < HEIGHT - PLAYER_HEIGHT
      ) {
        player.position.y += MOVEMENT_STEP;
      }
      else if (
        inputData.input === 'right'
        && player.position.x < WIDTH - PLAYER_WIDTH
      ) {
        player.position.x += MOVEMENT_STEP;
      }
      else if (
        inputData.input === 'left'
        && player.position.x > PLAYER_WIDTH
      ) {
        player.position.x -= MOVEMENT_STEP;
      }
    }
  }


  postStepHandleDisc() {
    if (!this.disc) {
      return;
    }

    // CHECK LEFT EDGE:
    if (
      this.disc.position.x <= PADDING + PLAYER_WIDTH
      && this.disc.position.y >= this.player1.y
      && this.disc.position.y <= this.player1.position.y + PLAYER_HEIGHT
      && this.disc.velocity.x < 0
    ) {
      // disc moving left hit player 1 player
      this.disc.velocity.x *= -1;
      this.disc.position.x = PADDING + PLAYER_WIDTH + 1;
    }
    else if (this.disc.position.x <= 0) {
      // disc hit left wall
      this.disc.velocity.x *= -1;
      this.disc.position.x = 0;
      console.log(`player 2 scored`);
    }

    // CHECK RIGHT EDGE:
    if (
      this.disc.position.x >= WIDTH - PADDING - PLAYER_WIDTH
      && this.disc.position.y >= this.player2.position.y
      && this.disc.position.y <= this.player2.position.y + PLAYER_HEIGHT
      && this.disc.velocity.x > 0
    ) {
      // disc moving right hits player 2 player
      this.disc.velocity.x *= -1;
      this.disc.position.x = WIDTH - PADDING - PLAYER_WIDTH - 1;
    }
    else if (this.disc.position.x >= WIDTH ) {
      // disc hit right wall
      this.disc.velocity.x *= -1;
      this.disc.position.x = WIDTH - 1;
      console.log(`player 1 scored`);
    }

    // disc hits top
    if (this.disc.position.y <= 0) {
      this.disc.position.y = 1;
      this.disc.velocity.y *= -1;
    }
    else if (this.disc.position.y >= HEIGHT) {
      // disc hits bottom
      this.disc.position.y = HEIGHT - 1;
      this.disc.velocity.y *= -1;
    }
  }

}

module.exports = UltimateGame;
