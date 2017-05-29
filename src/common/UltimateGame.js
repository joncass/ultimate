'use strict';

const GameEngine = require('lance-gg').GameEngine;

const Player = require('./Player');
const Disc = require('./Disc');
const MOVEMENT_STEP = 5;
const PADDING = 10;
const WIDTH = 800;
const HEIGHT = 500;
const PLAYER_WIDTH = 16;
const PLAYER_HEIGHT = 16;

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
    if (player && !player.hasDisc) {
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

    if (
      Math.abs(this.disc.position.x - this.player1.x) <= 10
      && Math.abs(this.disc.position.y - this.player1.y) <= 10
    ) {
      this.disc.velocity.x = 0;
      this.disc.velocity.y = 0;
      this.player1.hasDisc = true;
    }
    else if (
      Math.abs(this.disc.position.x - this.player2.x) <= 10
      && Math.abs(this.disc.position.y - this.player2.y) <= 10
    ) {
      this.disc.velocity.x = 0;
      this.disc.velocity.y = 0;
      this.player2.hasDisc = true;
    }

    // Bounce if the disc hits an edge
    if (this.disc.position.x <= 0) {
      // Left wall
      this.disc.velocity.x *= -1;
      this.disc.position.x = 0;
    }
    if (this.disc.position.x >= WIDTH ) {
      // Right wall
      this.disc.velocity.x *= -1;
      this.disc.position.x = WIDTH - 1;
    }
    if (this.disc.position.y <= 0) {
      // Top
      this.disc.position.y = 1;
      this.disc.velocity.y *= -1;
    }
    else if (this.disc.position.y >= HEIGHT) {
      // Bottom
      this.disc.position.y = HEIGHT - 1;
      this.disc.velocity.y *= -1;
    }
  }

}

module.exports = UltimateGame;
