import { Game } from './Game.js';
import { UIManager } from './ui/UIManager.js';

// Initialize UI Manager first
const uiManager = new UIManager(
  () => startGame(), // onPlayClick
  () => showMenu(),  // onMenuClick
  () => {}          // onSettingsClick
);

// Initialize the game
let game = null;

function startGame() {
  if (game) {
    game.destroy();
  }
  game = new Game();
  game.setUIManager(uiManager);
  game.start();
}

function showMenu() {
  if (game) {
    game.destroy();
    game = null;
  }
  uiManager.showMenu();
}

// Show main menu on startup
uiManager.showMenu();

// Handle window resize
window.addEventListener('resize', () => {
  if (game) {
    game.onWindowResize();
  }
});

