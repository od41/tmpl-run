import * as THREE from 'three';
import { Scene } from './core/Scene.js';
import { Camera } from './core/Camera.js';
import { Renderer } from './core/Renderer.js';
import { InputManager } from './input/InputManager.js';
import { GameState } from './GameState.js';

export class Game {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;

    // Core systems
    this.renderer = new Renderer(this.width, this.height);
    this.scene = new Scene();
    this.camera = new Camera(this.aspect);
    this.input = new InputManager();
    this.gameState = new GameState();

    // Game loop
    this.clock = new THREE.Clock();
    this.isRunning = false;

    // Performance monitoring
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
    this.fps = 60;
  }

  start() {
    this.isRunning = true;
    this.gameState.startGame();
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
  }

  updateHUD() {
    document.getElementById('distance').textContent = Math.floor(this.gameState.distance);
    document.getElementById('coins').textContent = this.gameState.coins;
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
}

