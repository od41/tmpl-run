export class UIManager {
  constructor(onPlayClick, onMenuClick, onSettingsClick) {
    this.onPlayClick = onPlayClick;
    this.onMenuClick = onMenuClick;
    this.onSettingsClick = onSettingsClick;
    
    this.currentScreen = 'menu';
    this.setupMenus();
    this.attachEventListeners();
  }

  setupMenus() {
    // Main Menu
    this.mainMenu = document.getElementById('main-menu');
    this.playButton = document.getElementById('play-btn');
    this.settingsButton = document.getElementById('settings-btn');
    this.highScoreDisplay = document.getElementById('high-score');

    // Game Over Screen
    this.gameOverScreen = document.getElementById('game-over-screen');
    this.finalScoreDisplay = document.getElementById('final-score');
    this.finalCoinsDisplay = document.getElementById('final-coins');
    this.finalDistanceDisplay = document.getElementById('final-distance');
    this.playAgainButton = document.getElementById('play-again-btn');
    this.menuButton = document.getElementById('menu-btn');
    this.newHighScoreText = document.getElementById('new-high-score');

    // Settings Screen
    this.settingsScreen = document.getElementById('settings-screen');
    this.soundToggle = document.getElementById('sound-toggle');
    this.musicToggle = document.getElementById('music-toggle');
    this.qualitySelect = document.getElementById('quality-select');
    this.closeSettingsButton = document.getElementById('close-settings-btn');

    // In-Game HUD
    this.hud = document.getElementById('hud');
    this.distanceDisplay = document.getElementById('distance');
    this.coinsDisplay = document.getElementById('coins');
    this.scoreDisplay = document.getElementById('score-value');
  }

  attachEventListeners() {
    this.playButton.addEventListener('click', () => this.showGame());
    this.playAgainButton.addEventListener('click', () => this.showGame());
    this.menuButton.addEventListener('click', () => this.showMenu());
    this.settingsButton.addEventListener('click', () => this.showSettings());
    this.closeSettingsButton.addEventListener('click', () => this.showMenu());

    // Settings toggles
    this.soundToggle.addEventListener('change', (e) => {
      localStorage.setItem('sound-enabled', e.target.checked);
    });
    this.musicToggle.addEventListener('change', (e) => {
      localStorage.setItem('music-enabled', e.target.checked);
    });
    this.qualitySelect.addEventListener('change', (e) => {
      localStorage.setItem('quality-setting', e.target.value);
    });

    // Load saved settings
    this.soundToggle.checked = localStorage.getItem('sound-enabled') !== 'false';
    this.musicToggle.checked = localStorage.getItem('music-enabled') !== 'false';
    this.qualitySelect.value = localStorage.getItem('quality-setting') || 'high';
  }

  showMenu() {
    this.hideAll();
    this.mainMenu.style.display = 'flex';
    this.currentScreen = 'menu';
    this.updateHighScoreDisplay();
  }

  showGame() {
    this.hideAll();
    this.hud.style.display = 'block';
    this.currentScreen = 'game';
    this.onPlayClick?.();
  }

  showGameOver(stats) {
    this.hideAll();
    this.gameOverScreen.style.display = 'flex';
    this.currentScreen = 'gameover';

    // Update stats
    this.finalScoreDisplay.textContent = Math.floor(stats.score);
    this.finalCoinsDisplay.textContent = stats.coinsCollected;
    this.finalDistanceDisplay.textContent = Math.floor(stats.distance);

    // Check for new high score
    const highScore = this.getHighScore();
    const isNewHighScore = stats.score > highScore;
    
    if (isNewHighScore) {
      this.newHighScoreText.style.display = 'block';
      this.setHighScore(stats.score);
    } else {
      this.newHighScoreText.style.display = 'none';
    }
  }

  showSettings() {
    this.hideAll();
    this.settingsScreen.style.display = 'flex';
    this.currentScreen = 'settings';
  }

  hideAll() {
    this.mainMenu.style.display = 'none';
    this.gameOverScreen.style.display = 'none';
    this.settingsScreen.style.display = 'none';
    this.hud.style.display = 'none';
  }

  updateHUD(stats) {
    if (this.currentScreen === 'game') {
      this.distanceDisplay.textContent = Math.floor(stats.distance);
      this.coinsDisplay.textContent = stats.coinsCollected;
      this.scoreDisplay.textContent = Math.floor(stats.score);
    }
  }

  getHighScore() {
    return parseInt(localStorage.getItem('high-score') || '0', 10);
  }

  setHighScore(score) {
    localStorage.setItem('high-score', Math.floor(score).toString());
  }

  updateHighScoreDisplay() {
    this.highScoreDisplay.textContent = this.getHighScore().toLocaleString();
  }

  getSoundEnabled() {
    return this.soundToggle.checked;
  }

  getMusicEnabled() {
    return this.musicToggle.checked;
  }

  getQualitySetting() {
    return this.qualitySelect.value;
  }
}

