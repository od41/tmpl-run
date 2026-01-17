import * as THREE from 'three';

export class Player {
  constructor() {
    this.position = new THREE.Vector3(0, 0, 0);
    this.currentLane = 2; // Center lane (1, 2, 3)
    this.targetLanePosition = 0;
    this.velocity = new THREE.Vector3(0, 0, 0);

    // Jump state
    this.isJumping = false;
    this.canJump = true;
    this.jumpForce = 15;
    this.gravity = 30;
    this.jumpDuration = 0;
    this.maxJumpDuration = 0.6;

    // Slide state
    this.isSliding = false;
    this.slideDuration = 0;
    this.maxSlideDuration = 0.5;

    // Animation
    this.laneTransitionSpeed = 10;

    // Bounds
    this.minLaneX = -3;
    this.maxLaneX = 3;
  }

  reset() {
    this.position.set(0, 0, 0);
    this.currentLane = 2;
    this.targetLanePosition = 0;
    this.velocity.set(0, 0, 0);
    this.isJumping = false;
    this.canJump = true;
    this.isSliding = false;
    this.slideDuration = 0;
    this.jumpDuration = 0;
  }

  jump() {
    if (!this.canJump) return;
    this.isJumping = true;
    this.canJump = false;
    this.jumpDuration = 0;
    this.velocity.y = this.jumpForce;
  }

  slide() {
    if (this.isJumping) return;
    this.isSliding = true;
    this.slideDuration = 0;
  }

  update(delta) {
    // Update lane position smoothly
    const currentLaneX = (this.currentLane - 1) * 3;
    if (Math.abs(this.position.x - currentLaneX) > 0.1) {
      this.position.x += (currentLaneX - this.position.x) * this.laneTransitionSpeed * delta;
    } else {
      this.position.x = currentLaneX;
    }

    // Update jump
    if (this.isJumping) {
      this.jumpDuration += delta;
      this.velocity.y -= this.gravity * delta;
      this.position.y += this.velocity.y * delta;

      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocity.y = 0;
        this.isJumping = false;
        this.canJump = true;
        this.jumpDuration = 0;
      }
    }

    // Update slide
    if (this.isSliding) {
      this.slideDuration += delta;
      if (this.slideDuration >= this.maxSlideDuration) {
        this.isSliding = false;
        this.slideDuration = 0;
      }
    }
  }

  getState() {
    return {
      position: this.position.clone(),
      isJumping: this.isJumping,
      isSliding: this.isSliding,
      currentLane: this.currentLane,
    };
  }
}

