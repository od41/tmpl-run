import { Game } from './Game.js';

// Initialize the game
const game = new Game();

// Start the game loop
game.start();

// Handle window resize
window.addEventListener('resize', () => {
  game.onWindowResize();
});

