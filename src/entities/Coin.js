import * as THREE from 'three';

export class Coin {
  constructor(position) {
    this.position = new THREE.Vector3();
    this.position.copy(position);
    this.mesh = null;
    this.radius = 0.4;
    this.collected = false;
    this.rotationSpeed = 3; // radians per second

    this.createMesh();
  }

  createMesh() {
    // Create coin as a cylinder with golden material
    const geometry = new THREE.CylinderGeometry(this.radius, this.radius, 0.1, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffd700, // Gold
      metalness: 0.8,
      roughness: 0.1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(this.position);
    mesh.position.y += 0.5; // Float above ground
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.mesh = mesh;
  }

  getMesh() {
    return this.mesh;
  }

  update(delta, playerSpeed) {
    if (!this.collected && this.mesh) {
      // Move backward relative to player
      this.position.z += playerSpeed * delta;
      this.mesh.position.z = this.position.z;

      // Rotate coin for visual appeal
      this.mesh.rotation.y += this.rotationSpeed * delta;

      // Gentle bobbing motion
      this.mesh.position.y = 0.5 + Math.sin(Date.now() * 0.003) * 0.2;
    }
  }

  getBoundingBox() {
    const box = new THREE.Box3();
    box.setFromObject(this.mesh);
    return box;
  }

  isOffScreen(playerPosition) {
    // Remove coin if it's too far behind the player
    return this.position.z > playerPosition.z + 50;
  }

  collect() {
    this.collected = true;
  }

  isCollected() {
    return this.collected;
  }
}

