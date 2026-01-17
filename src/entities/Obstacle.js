import * as THREE from 'three';

export class Obstacle {
  constructor(position, type) {
    this.type = type; // 'jump', 'slide', 'turn'
    this.position = new THREE.Vector3();
    this.position.copy(position);
    this.mesh = null;
    this.width = 3;
    this.height = type === 'slide' ? 2 : 3;
    this.depth = 2;
    this.passed = false;

    this.createMesh();
  }

  createMesh() {
    // Determine color based on type
    const colors = {
      jump: 0xff6b6b,     // Red
      slide: 0xffd93d,    // Yellow
      turn: 0x6bcf7f,     // Green
    };

    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    const material = new THREE.MeshPhongMaterial({
      color: colors[this.type] || 0x999999,
      shininess: 100,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(this.position);
    mesh.position.y += this.height / 2; // Center on ground
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.mesh = mesh;
  }

  getMesh() {
    return this.mesh;
  }

  update(delta, playerSpeed) {
    // Obstacles move backward relative to the player
    this.position.z += playerSpeed * delta;
    this.mesh.position.z = this.position.z;
  }

  getBoundingBox() {
    const box = new THREE.Box3();
    box.setFromObject(this.mesh);
    return box;
  }

  isOffScreen(playerPosition) {
    // Remove obstacle if it's too far behind the player
    return this.position.z > playerPosition.z + 50;
  }
}

