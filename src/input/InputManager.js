export class InputManager {
  constructor() {
    this.keys = {};
    this.touchStart = null;
    this.input = {
      moveLeft: false,
      moveRight: false,
      jump: false,
      slide: false,
    };

    this.setupKeyboardInput();
    this.setupTouchInput();

    // Debounce lane changes to prevent multiple inputs per frame
    this.lastLaneChangeTime = 0;
    this.laneChangeCooldown = 0.15;
  }

  setupKeyboardInput() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  setupTouchInput() {
    document.addEventListener('touchstart', (e) => {
      this.touchStart = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    });

    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      if (!this.touchStart) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - this.touchStart.x;
      const deltaY = touch.clientY - this.touchStart.y;
      const deltaTime = Date.now() - this.touchStart.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Minimum swipe distance
      if (distance > 30) {
        const angle = Math.atan2(deltaY, deltaX);
        const absAngle = Math.abs(angle);

        // Determine swipe direction
        if (absAngle < Math.PI / 4) {
          // Right swipe
          this.input.moveRight = true;
        } else if (absAngle > (3 * Math.PI) / 4) {
          // Left swipe
          this.input.moveLeft = true;
        } else if (angle > 0) {
          // Down swipe
          this.input.slide = true;
        } else {
          // Up swipe
          this.input.jump = true;
        }
      }

      this.touchStart = null;
    });
  }

  update() {
    const currentTime = Date.now() / 1000;

    // Reset inputs
    this.input.moveLeft = false;
    this.input.moveRight = false;

    // Keyboard input
    if (this.keys['arrowleft'] || this.keys['a']) {
      if (currentTime - this.lastLaneChangeTime > this.laneChangeCooldown) {
        this.input.moveLeft = true;
        this.lastLaneChangeTime = currentTime;
      }
    }

    if (this.keys['arrowright'] || this.keys['d']) {
      if (currentTime - this.lastLaneChangeTime > this.laneChangeCooldown) {
        this.input.moveRight = true;
        this.lastLaneChangeTime = currentTime;
      }
    }

    this.input.jump = this.keys['arrowup'] || this.keys['w'] || this.keys[' '];
    this.input.slide = this.keys['arrowdown'] || this.keys['s'];
  }

  getInput() {
    return { ...this.input };
  }

  reset() {
    this.keys = {};
    this.input = {
      moveLeft: false,
      moveRight: false,
      jump: false,
      slide: false,
    };
  }
}

