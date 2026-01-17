import * as THREE from 'three';
import { Player } from './entities/Player.js';
import { ObstacleGenerator } from './systems/ObstacleGenerator.js';
import { CollisionDetector } from './systems/CollisionDetector.js';

export class GameState {
  constructor() {
    this.player = new Player();
    this.distance = 0;
    this.coins = 0;
    this.speed = 20; // units per second
    this.maxSpeed = 50;
    this.acceleration = 5; // units per second squared
    this.isGameOver = false;
    this.isPlaying = false;

    // New systems for Week 2
    this.obstacleGenerator = new ObstacleGenerator();
    this.collisionDetector = new CollisionDetector();
    this.lastObstacles = [];
  }

  startGame() {
    this.isPlaying = true;
    this.distance = 0;
    this.coins = 0;
    this.speed = 20;
    this.isGameOver = false;
    this.player.reset();
    this.obstacleGenerator.reset();
    this.collisionDetector.reset();
    this.lastObstacles = [];
  }

  updatePlayer(input, delta) {
    if (!this.isPlaying) return;

    // Handle lane movement
    if (input.moveLeft && this.player.currentLane > 0) {
      this.player.currentLane--;
      this.player.targetLanePosition = (this.player.currentLane - 1) * 3;
    }
    if (input.moveRight && this.player.currentLane < 3) {
      this.player.currentLane++;
      this.player.targetLanePosition = (this.player.currentLane - 1) * 3;
    }

    // Handle jump
    if (input.jump && this.player.canJump) {
      this.player.jump();
    }

    // Handle slide
    if (input.slide) {
      this.player.slide();
    }

    this.player.update(delta);
  }

  update(delta, elapsed) {
    if (!this.isPlaying) return;

    // Increase speed over time
    if (this.speed < this.maxSpeed) {
      this.speed = Math.min(this.speed + this.acceleration * delta, this.maxSpeed);
    }

    // Update distance based on speed
    this.distance += this.speed * delta;

    // Gradually increase difficulty
    const speedMultiplier = Math.min(1 + this.distance / 5000, 2);
    this.maxSpeed = 50 * speedMultiplier;

    // Generate and update obstacles
    this.obstacleGenerator.update(delta, this.distance, this.player.position, this.speed);

    // Check collisions
    const obstacles = this.obstacleGenerator.getObstacles();
    if (this.collisionDetector.checkCollision(this.player, obstacles)) {
      this.gameOver();
      return;
    }

    // Check boundary collisions
    if (this.collisionDetector.checkBoundaries(this.player)) {
      this.gameOver();
      return;
    }
  }

  gameOver() {
    this.isPlaying = false;
    this.isGameOver = true;
  }
}

