import * as THREE from 'three';

export class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    this.scene.fog = new THREE.Fog(0x1a1a1a, 100, 200);

    this.setupLighting();
    this.setupEnvironment();
    this.setupPlayer();
  }

  setupLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light for shadows and atmosphere
    const directionalLight = new THREE.DirectionalLight(0xffd700, 0.8);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    this.scene.add(directionalLight);

    // Point light for atmosphere
    const pointLight = new THREE.PointLight(0xff9500, 0.4);
    pointLight.position.set(-10, 10, 20);
    this.scene.add(pointLight);
  }

  setupEnvironment() {
    // Ground/Path
    const groundGeometry = new THREE.PlaneGeometry(12, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b7355,
      roughness: 0.8,
      metalness: 0.0,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = 50;
    this.scene.add(ground);

    // Side walls for lane boundaries
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x654321,
      roughness: 0.9,
      metalness: 0.0,
    });

    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(2, 10, 200);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    leftWall.position.set(-7, 5, 50);
    this.scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    rightWall.position.set(7, 5, 50);
    this.scene.add(rightWall);

    // Decorative columns
    this.addDecorativeColumns();
  }

  addDecorativeColumns() {
    const columnMaterial = new THREE.MeshStandardMaterial({
      color: 0xa0a0a0,
      roughness: 0.6,
      metalness: 0.2,
    });

    for (let i = 0; i < 10; i++) {
      const columnGeometry = new THREE.CylinderGeometry(0.8, 0.8, 8, 16);
      const column = new THREE.Mesh(columnGeometry, columnMaterial);
      column.castShadow = true;
      column.receiveShadow = true;

      const xPos = i % 2 === 0 ? -5 : 5;
      column.position.set(xPos, 4, i * 20 - 100);
      this.scene.add(column);
    }
  }

  setupPlayer() {
    // Simple player character as a box for now
    const playerGeometry = new THREE.BoxGeometry(1.5, 2.5, 1);
    const playerMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4a574,
      roughness: 0.7,
      metalness: 0.1,
    });

    this.playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    this.playerMesh.castShadow = true;
    this.playerMesh.receiveShadow = true;
    this.playerMesh.position.set(0, 1.25, 0);
    this.scene.add(this.playerMesh);
  }

  updatePlayerPosition(position) {
    if (this.playerMesh) {
      this.playerMesh.position.copy(position);
      this.playerMesh.position.y += 1.25; // Offset for mesh center
    }
  }

  getScene() {
    return this.scene;
  }
}

