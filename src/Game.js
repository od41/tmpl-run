import * as THREE from 'three';
import { Scene } from './core/Scene.js';
import { Camera } from './core/Camera.js';
import { Renderer } from './core/Renderer.js';
import { InputManager } from './input/InputManager.js';
import { GameState } from './GameState.js';
import { AudioManager } from './audio/AudioManager.js';

export class Game {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;

    // Audio first
    this.audio = new AudioManager();

    // Core systems
    this.renderer = new Renderer(this.width, this.height);
    this.scene = new Scene();
    this.camera = new Camera(this.aspect);
    this.input = new InputManager();
    this.gameState = new GameState(this.audio);

    // Game loop
    this.clock = new THREE.Clock();
    this.isRunning = false;

    // Performance monitoring
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
    this.fps = 60;

    // UI Manager
    this.uiManager = null;
  }

  setUIManager(uiManager) {
    this.uiManager = uiManager;
  }

  start() {
    this.isRunning = true;
    this.gameState.startGame();
    this.audio.startMusic();
    this.animate();
  }

  animate = () => {
    if (!this.isRunning) return;

    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Update game systems
    this.update(delta, elapsed);

    // Update HUD
    this.updateHUD();

    // Render
    this.renderer.render(this.scene.getScene(), this.camera.getCamera());

    // Update FPS
    this.updateFPS();

    // Check for game over
    if (this.gameState.isGameOver && this.uiManager) {
      this.isRunning = false;
      this.uiManager.showGameOver({
        score: this.gameState.score,
        distance: this.gameState.distance,
        coinsCollected: this.gameState.coinsCollected
      });
    }
  };

  update(delta, elapsed) {
    // Update input state
    this.input.update();

    // Update camera
    this.camera.update(delta);

    // Update player based on input
    const playerInput = this.input.getInput();
    this.gameState.updatePlayer(playerInput, delta);

    // Update game state
    this.gameState.update(delta, elapsed);

    // Sync obstacles with scene
    this.updateObstaclesInScene();

    // Sync coins with scene
    this.updateCoinsInScene();

    // Update player position in scene
    this.scene.updatePlayerPosition(this.gameState.player.position);

    // Update environment
    this.scene.update(delta, this.gameState.speed);
  }

  updateObstaclesInScene() {
    const currentObstacles = this.gameState.obstacleGenerator.getObstacles();
    const previousObstacles = this.gameState.lastObstacles || [];

    // Remove obstacles that are no longer in the list
    for (const obstacle of previousObstacles) {
      if (!currentObstacles.includes(obstacle)) {
        this.scene.removeObstacle(obstacle);
      }
    }

    // Add new obstacles
    for (const obstacle of currentObstacles) {
      if (!previousObstacles.includes(obstacle)) {
        this.scene.addObstacle(obstacle);
      }
    }

    // Update reference
    this.gameState.lastObstacles = [...currentObstacles];
  }

  updateCoinsInScene() {
    const currentCoins = this.gameState.coinGenerator.getCoins();
    const previousCoins = this.gameState.lastCoins || [];

    // Remove coins that are no longer in the list or have been collected
    for (const coin of previousCoins) {
      if (!currentCoins.includes(coin) || coin.isCollected()) {
        this.scene.removeCoin(coin);
      }
    }

    // Add new coins
    for (const coin of currentCoins) {
      if (!previousCoins.includes(coin)) {
        this.scene.addCoin(coin);
      }
    }

    // Update reference
    this.gameState.lastCoins = [...currentCoins];
  }

  updateHUD() {
    if (this.uiManager) {
      this.uiManager.updateHUD({
        distance: this.gameState.distance,
        coinsCollected: this.gameState.coinsCollected,
        score: this.gameState.score
      });
    }
  }

  updateFPS() {
    this.frameCount++;
    const currentTime = performance.now();

    if (currentTime - this.lastFpsUpdate > 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
      document.getElementById('fps-value').textContent = this.fps;
    }
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;

    this.camera.onWindowResize(this.width, this.height, this.aspect);
    this.renderer.onWindowResize(this.width, this.height);
  }

  pause() {
    this.isRunning = false;
  }

  resume() {
    this.isRunning = true;
    this.clock.start();
    this.animate();
  }

  destroy() {
    this.isRunning = false;
    this.audio.dispose();
    this.renderer.dispose();
  }
}

