import * as THREE from 'three';

export class Renderer {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x1a1a1a);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // Append to DOM
    const container = document.getElementById('canvas-container');
    container.appendChild(this.renderer.domElement);
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }

  onWindowResize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  dispose() {
    this.renderer.dispose();
    const container = document.getElementById('canvas-container');
    if (this.renderer.domElement.parentNode === container) {
      container.removeChild(this.renderer.domElement);
    }
  }
}

