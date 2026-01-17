import { Obstacle } from '../entities/Obstacle.js';

export class ObstacleGenerator {
  constructor() {
    this.obstacles = [];
    this.nextObstacleDistance = 10;
    this.minSpacing = 5;
    this.maxSpacing = 15;
    this.lastSpacing = 0;
    this.difficultyPhase = 0;

    // Seed-based random for reproducibility
    this.seed = 12345;
  }

  seededRandom() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  generateObstacles(distance, playerPosition) {
    // Generate obstacles based on distance
    while (distance > this.nextObstacleDistance) {
      this.createObstacle(this.nextObstacleDistance);
      this.lastSpacing = this.minSpacing + this.seededRandom() * (this.maxSpacing - this.minSpacing);
      this.nextObstacleDistance += this.lastSpacing;
    }

    // Remove obstacles that are off-screen
    this.obstacles = this.obstacles.filter(
      (obstacle) => !obstacle.isOffScreen(playerPosition)
    );
  }

  createObstacle(distance) {
    // Determine difficulty phase
    let phase = 0;
    if (distance > 500) phase = 1;
    if (distance > 1500) phase = 2;

    // Get difficulty-appropriate obstacle type and lane
    const { type, lanes } = this.getObstacleConfig(phase);
    const lane = lanes[Math.floor(this.seededRandom() * lanes.length)];

    // Create obstacle (lanes: 1, 2, 3 -> x: -3, 0, 3)
    const laneX = (lane - 2) * 3;
    const obstacle = new Obstacle(
      { x: laneX, y: 0, z: -distance },
      type
    );

    this.obstacles.push(obstacle);
  }

  getObstacleConfig(phase) {
    const obstacleTypes = {
      0: [
        { type: 'jump', lanes: [1, 2, 3], weight: 60 },
        { type: 'slide', lanes: [1, 2, 3], weight: 20 },
        { type: 'turn', lanes: [1, 2, 3], weight: 20 },
      ],
      1: [
        { type: 'jump', lanes: [1, 2, 3], weight: 45 },
        { type: 'slide', lanes: [1, 2, 3], weight: 30 },
        { type: 'turn', lanes: [1, 2, 3], weight: 25 },
      ],
      2: [
        { type: 'jump', lanes: [1, 2, 3], weight: 40 },
        { type: 'slide', lanes: [1, 2, 3], weight: 35 },
        { type: 'turn', lanes: [1, 2, 3], weight: 25 },
      ],
    };

    const configs = obstacleTypes[Math.min(phase, 2)];
    const totalWeight = configs.reduce((sum, config) => sum + config.weight, 0);
    let random = this.seededRandom() * totalWeight;

    for (const config of configs) {
      random -= config.weight;
      if (random <= 0) {
        return config;
      }
    }

    return configs[0];
  }

  update(delta, distance, playerPosition, playerSpeed) {
    // Generate new obstacles
    this.generateObstacles(distance, playerPosition);

    // Update all obstacles
    for (const obstacle of this.obstacles) {
      obstacle.update(delta, playerSpeed);
    }
  }

  getObstacles() {
    return this.obstacles;
  }

  reset() {
    this.obstacles = [];
    this.nextObstacleDistance = 10;
    this.seed = 12345;
  }
}

