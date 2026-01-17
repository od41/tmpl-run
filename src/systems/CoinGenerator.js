import { Coin } from '../entities/Coin.js';

export class CoinGenerator {
  constructor() {
    this.coins = [];
    this.nextCoinDistance = 15;
    this.minSpacing = 3;
    this.maxSpacing = 8;
    this.lastSpacing = 0;

    // Seed-based random for reproducibility
    this.seed = 54321;
  }

  seededRandom() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  generateCoins(distance, playerPosition) {
    // Generate coins based on distance
    while (distance > this.nextCoinDistance) {
      this.createCoinPattern(this.nextCoinDistance);
      this.lastSpacing = this.minSpacing + this.seededRandom() * (this.maxSpacing - this.minSpacing);
      this.nextCoinDistance += this.lastSpacing;
    }

    // Remove coins that are off-screen
    this.coins = this.coins.filter(
      (coin) => !coin.isOffScreen(playerPosition) && !coin.isCollected()
    );
  }

  createCoinPattern(distance) {
    // Determine difficulty phase
    let phase = 0;
    if (distance > 500) phase = 1;
    if (distance > 1500) phase = 2;

    // Get pattern based on phase
    const pattern = this.getCoinPatternForPhase(phase);
    
    // Create coins in the pattern
    for (const coinLane of pattern) {
      const laneX = (coinLane - 2) * 3;
      const coin = new Coin({
        x: laneX,
        y: 0,
        z: -distance,
      });
      this.coins.push(coin);
    }
  }

  getCoinPatternForPhase(phase) {
    // Different coin patterns for different difficulty phases
    const patterns = {
      0: [
        [1, 2, 3],           // All three lanes
        [2],                 // Single middle coin
        [1, 3],              // Left and right
        [1, 2, 3],           // All three again
      ],
      1: [
        [1, 2],              // Left and middle
        [2, 3],              // Middle and right
        [1, 2, 3],           // All lanes
        [2],                 // Single
        [1, 3],              // Left and right (skip middle)
      ],
      2: [
        [1, 2],              // Dense patterns for hard phase
        [2, 3],
        [1, 3],
        [1, 2, 3],
        [2],
      ],
    };

    const phasePatterns = patterns[Math.min(phase, 2)];
    const randomIndex = Math.floor(this.seededRandom() * phasePatterns.length);
    return phasePatterns[randomIndex];
  }

  update(delta, distance, playerPosition, playerSpeed) {
    // Generate new coins
    this.generateCoins(distance, playerPosition);

    // Update all coins
    for (const coin of this.coins) {
      coin.update(delta, playerSpeed);
    }
  }

  getCoins() {
    return this.coins;
  }

  reset() {
    this.coins = [];
    this.nextCoinDistance = 15;
    this.seed = 54321;
  }

  collectCoin(coin) {
    coin.collect();
    return 10; // Points per coin
  }
}

