import * as THREE from 'three';

export class Camera {
  constructor(aspect) {
    this.aspect = aspect;

    // Create camera with FOV optimized for 3D runner
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

    // Set initial position: behind and above the player
    this.camera.position.set(0, 8, -15);
    this.camera.lookAt(0, 0, 50);

    // Camera follow offset
    this.targetPosition = new THREE.Vector3(0, 8, -15);
    this.followSpeed = 5;
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
  }

  update(delta) {
    // Smooth camera follow
    this.camera.position.lerp(this.targetPosition, this.followSpeed * delta);

    // Update shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= delta;
      const shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      this.camera.position.x += shakeX;
      this.camera.position.y += shakeY;
    }

    // Always look ahead
    const lookAheadZ = 50;
    this.camera.lookAt(0, 3, lookAheadZ);
  }

  followPlayer(playerPosition) {
    // Position camera relative to player
    this.targetPosition.copy(playerPosition);
    this.targetPosition.x = 0;
    this.targetPosition.y = playerPosition.y + 8;
    this.targetPosition.z = playerPosition.z - 15;
  }

  shake(intensity = 0.5, duration = 0.2) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  onWindowResize(width, height, aspect) {
    this.aspect = aspect;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  getCamera() {
    return this.camera;
  }
}

