'use strict';

const GameEngine = require('lance-gg').GameEngine;

const Paddle = require('./Paddle');
const Ball = require('./Ball');
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
      this.postStepHandleBall();
    });

    this.on('objectAdded', (object) => {
      if (object.id == 1 && object.class == Paddle) {
        this.paddle1 = object;
      }
      else if (object.id == 2 && object.class == Paddle) {
        this.paddle2 = object;
      }
      else if (object.class == Ball) {
        this.ball = object;
      }
      else {
        throw new Error('Unexpected object was added!');
      }
    });
  }
  initGame() {
    this.addObjectToWorld(
      new Paddle(++this.world.idCount, PADDING, 1)
    );
    this.addObjectToWorld(
      new Paddle(++this.world.idCount, WIDTH - PADDING, 2)
    );
    this.addObjectToWorld(
      new Ball(++this.world.idCount, WIDTH / 2, HEIGHT / 2)
    );
  }

  registerClasses(serializer) {
    serializer.registerClass(require('./Paddle'));
    serializer.registerClass(require('./Ball'));
  }

  processInput(inputData, playerId) {
    super.processInput(inputData, playerId);

    // get the player paddle tied to the player socket
    const playerPaddle = this.world.getPlayerObject(playerId);
    if (playerPaddle) {
      if (inputData.input === 'up') {
        playerPaddle.position.y -= MOVEMENT_STEP;
      }
      else if (inputData.input === 'down') {
        playerPaddle.position.y += MOVEMENT_STEP;
      }
    }
  }


  postStepHandleBall() {
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
