import * as THREE from 'three';
import { Player } from './entities/Player.js';
import { ObstacleGenerator } from './systems/ObstacleGenerator.js';
import { CoinGenerator } from './systems/CoinGenerator.js';
import { CollisionDetector } from './systems/CollisionDetector.js';

export class GameState {
  constructor(audioManager = null) {
    this.player = new Player();
    this.distance = 0;
    this.coinsCollected = 0;
    this.score = 0;
    this.speed = 15; // units per second
    this.maxSpeed = 30;
    this.acceleration = 0.002; // units per second squared
    this.isGameOver = false;
    this.isPlaying = false;

    // New systems for Week 2 and Week 3
    this.obstacleGenerator = new ObstacleGenerator();
    this.coinGenerator = new CoinGenerator();
    this.collisionDetector = new CollisionDetector();
    this.lastObstacles = [];
    this.lastCoins = [];

    // Audio
    this.audioManager = audioManager;

    // Scoring
    this.multiplier = 1;
    this.obstaclesAvoided = 0;
    this.lastCoinsCollected = 0;
  }

  setAudioManager(audioManager) {
    this.audioManager = audioManager;
  }

  startGame() {
    this.isPlaying = true;
    this.distance = 0;
    this.coinsCollected = 0;
    this.score = 0;
    this.speed = 15;
    this.isGameOver = false;
    this.multiplier = 1;
    this.obstaclesAvoided = 0;
    this.lastCoinsCollected = 0;
    this.player.reset();
    this.obstacleGenerator.reset();
    this.coinGenerator.reset();
    this.collisionDetector.reset();
    this.lastObstacles = [];
    this.lastCoins = [];
  }

  updatePlayer(input, delta) {
    if (!this.isPlaying) return;

    // Handle lane movement (lanes: 1, 2, 3)
    if (input.moveLeft && this.player.currentLane > 1) {
      this.player.currentLane--;
    }
    if (input.moveRight && this.player.currentLane < 3) {
      this.player.currentLane++;
    }

    // Handle jump
    if (input.jump && this.player.canJump) {
      this.player.jump();
      this.audioManager?.playSound('jump', 0.2);
    }

    // Handle slide
    if (input.slide) {
      this.player.slide();
      this.audioManager?.playSound('slide', 0.15);
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

    // Enhanced scoring: distance + coins + multiplier bonus
    const distanceScore = Math.floor(this.distance);
    const coinScore = this.coinsCollected * 10;
    const multiplierBonus = Math.floor((this.obstaclesAvoided / 5) * this.multiplier);
    
    this.score = (distanceScore + coinScore + multiplierBonus) * this.multiplier;

    // Update multiplier based on consecutive obstacles avoided
    if (this.obstaclesAvoided % 5 === 0 && this.obstaclesAvoided > 0) {
      this.multiplier = Math.min(this.multiplier + 0.1, 3);
    }

    // Gradually increase difficulty
    const speedMultiplier = Math.min(1 + this.distance / 5000, 2);
    this.maxSpeed = 30 * speedMultiplier;

    // Generate and update obstacles
    this.obstacleGenerator.update(delta, this.distance, this.player.position, this.speed);

    // Generate and update coins
    this.coinGenerator.update(delta, this.distance, this.player.position, this.speed);

    // Check obstacle collisions
    const obstacles = this.obstacleGenerator.getObstacles();
    if (this.collisionDetector.checkCollision(this.player, obstacles)) {
      this.gameOver();
      return;
    }

    // Check coin collisions
    const coins = this.coinGenerator.getCoins();
    const collectedCoins = this.collisionDetector.checkCoinCollision(this.player, coins);
    for (const coin of collectedCoins) {
      this.coinGenerator.collectCoin(coin);
      this.coinsCollected += 1;
      this.audioManager?.playSound('coin', 0.1);
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
    this.audioManager?.playSound('crash', 0.3);
  }
}

