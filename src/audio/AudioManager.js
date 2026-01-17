export class AudioManager {
  constructor() {
    this.soundsEnabled = localStorage.getItem('sound-enabled') !== 'false';
    this.musicEnabled = localStorage.getItem('music-enabled') !== 'false';
    
    // Create audio context
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Sound effects
    this.sounds = {
      jump: null,
      slide: null,
      coin: null,
      crash: null,
      footstep: null
    };
    
    // Music
    this.musicOscillator = null;
    this.musicGain = null;
    this.isPlayingMusic = false;
  }

  setSoundEnabled(enabled) {
    this.soundsEnabled = enabled;
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (!enabled && this.isPlayingMusic) {
      this.stopMusic();
    } else if (enabled && !this.isPlayingMusic) {
      this.startMusic();
    }
  }

  // Simple sound generation using Web Audio API
  playSound(type, duration = 0.1) {
    if (!this.soundsEnabled) return;

    const now = this.audioContext.currentTime;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
      
      switch (type) {
        case 'coin':
          oscillator.frequency.setValueAtTime(800, now);
          oscillator.frequency.exponentialRampToValueAtTime(1200, now + duration);
          break;
        case 'jump':
          oscillator.frequency.setValueAtTime(400, now);
          oscillator.frequency.exponentialRampToValueAtTime(600, now + duration);
          break;
        case 'slide':
          oscillator.frequency.setValueAtTime(300, now);
          oscillator.frequency.exponentialRampToValueAtTime(200, now + duration);
          break;
        case 'crash':
          oscillator.frequency.setValueAtTime(100, now);
          oscillator.frequency.linearRampToValueAtTime(50, now + duration);
          gainNode.gain.setValueAtTime(0.5, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
          break;
        case 'footstep':
          oscillator.frequency.setValueAtTime(200, now);
          oscillator.frequency.exponentialRampToValueAtTime(150, now + duration * 0.5);
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
          break;
      }
      
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  startMusic() {
    if (!this.musicEnabled || this.isPlayingMusic) return;

    const now = this.audioContext.currentTime;
    
    try {
      this.musicOscillator = this.audioContext.createOscillator();
      this.musicGain = this.audioContext.createGain();
      
      this.musicOscillator.connect(this.musicGain);
      this.musicGain.connect(this.audioContext.destination);
      
      // Simple background ambience
      this.musicOscillator.frequency.setValueAtTime(110, now);
      this.musicGain.gain.setValueAtTime(0.05, now);
      
      this.musicOscillator.start();
      this.isPlayingMusic = true;
      
      // Modulate frequency for interest
      this.modulateMusic();
    } catch (e) {
      console.log('Music not available');
    }
  }

  modulateMusic() {
    if (!this.isPlayingMusic || !this.musicOscillator) return;
    
    const now = this.audioContext.currentTime;
    
    // Create a simple melody pattern
    const pattern = [110, 130, 110, 140];
    let index = 0;
    
    const loop = () => {
      if (!this.isPlayingMusic) return;
      
      const freq = pattern[index % pattern.length];
      this.musicOscillator.frequency.setTargetAtTime(freq, now, 0.1);
      
      index++;
      setTimeout(loop, 400);
    };
    
    loop();
  }

  stopMusic() {
    if (!this.isPlayingMusic || !this.musicOscillator) return;
    
    try {
      this.musicOscillator.stop();
      this.isPlayingMusic = false;
    } catch (e) {
      console.log('Could not stop music');
    }
  }

  pause() {
    if (this.isPlayingMusic) {
      this.stopMusic();
    }
  }

  resume() {
    if (this.musicEnabled && !this.isPlayingMusic) {
      this.startMusic();
    }
  }

  dispose() {
    this.stopMusic();
  }
}

