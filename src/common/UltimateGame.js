'use strict';

const GameEngine = require('lance-gg').GameEngine;

const Player = require('./Player');
const Disc = require('./Disc');
const MOVEMENT_STEP = 5;
const PADDING = 20;
const WIDTH = 800;
const HEIGHT = 500;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 50;

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
        this.paddle1 = object;
      }
      else if (object.id == 2 && object.class == Player) {
        this.paddle2 = object;
      }
      else if (object.class == Disc) {
        this.ball = object;
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

    // get the player paddle tied to the player socket
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
        && player.position.y < HEIGHT - PADDLE_HEIGHT
      ) {
        player.position.y += MOVEMENT_STEP;
      }
      else if (
        inputData.input === 'right'
        && player.position.x < WIDTH - PADDLE_WIDTH
      ) {
        player.position.x += MOVEMENT_STEP;
      }
      else if (
        inputData.input === 'left'
        && player.position.x > PADDLE_WIDTH
      ) {
        player.position.x -= MOVEMENT_STEP;
      }
    }
  }


  postStepHandleDisc() {
    if (!this.ball) {
      return;
    }

    // CHECK LEFT EDGE:
    if (
      this.ball.position.x <= PADDING + PADDLE_WIDTH
      && this.ball.position.y >= this.paddle1.y
      && this.ball.position.y <= this.paddle1.position.y + PADDLE_HEIGHT
      && this.ball.velocity.x < 0
    ) {
      // ball moving left hit player 1 paddle
      this.ball.velocity.x *= -1;
      this.ball.position.x = PADDING + PADDLE_WIDTH + 1;
    }
    else if (this.ball.position.x <= 0) {
      // ball hit left wall
      this.ball.velocity.x *= -1;
      this.ball.position.x = 0;
      console.log(`player 2 scored`);
    }

    // CHECK RIGHT EDGE:
    if (
      this.ball.position.x >= WIDTH - PADDING - PADDLE_WIDTH
      && this.ball.position.y >= this.paddle2.position.y
      && this.ball.position.y <= this.paddle2.position.y + PADDLE_HEIGHT
      && this.ball.velocity.x > 0
    ) {
      // ball moving right hits player 2 paddle
      this.ball.velocity.x *= -1;
      this.ball.position.x = WIDTH - PADDING - PADDLE_WIDTH - 1;
    }
    else if (this.ball.position.x >= WIDTH ) {
      // ball hit right wall
      this.ball.velocity.x *= -1;
      this.ball.position.x = WIDTH - 1;
      console.log(`player 1 scored`);
    }

    // ball hits top
    if (this.ball.position.y <= 0) {
      this.ball.position.y = 1;
      this.ball.velocity.y *= -1;
    }
    else if (this.ball.position.y >= HEIGHT) {
      // ball hits bottom
      this.ball.position.y = HEIGHT - 1;
      this.ball.velocity.y *= -1;
    }
  }

}

module.exports = UltimateGame;
