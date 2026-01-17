import * as THREE from 'three';

export class CollisionDetector {
  constructor() {
    this.playerBounds = null;
    this.obstacleBounds = [];
  }

  checkCollision(player, obstacles) {
    // Get player bounds
    const playerBox = this.getPlayerBounds(player);

    // Check each obstacle
    for (const obstacle of obstacles) {
      const obstacleBox = obstacle.getBoundingBox();

      // Perform AABB (Axis-Aligned Bounding Box) collision detection
      if (this.isCollidingAABB(playerBox, obstacleBox)) {
        // Check if player can avoid collision
        if (this.canAvoidCollision(player, obstacle)) {
          continue; // Player avoided this obstacle
        }
        return true; // Collision detected
      }
    }

    return false; // No collision
  }

  getPlayerBounds(player) {
    const position = player.position;
    const size = new THREE.Vector3(2, 2, 2);

    // Adjust bounds based on player state
    if (player.isSliding) {
      size.y = 1; // Smaller height when sliding
    }

    const box = new THREE.Box3();
    box.setFromCenterAndSize(position, size);
    return box;
  }

  isCollidingAABB(box1, box2) {
    return box1.intersectsBox(box2);
  }

  canAvoidCollision(player, obstacle) {
    const obstacleType = obstacle.type;
    const playerState = player.getState();

    // Jump obstacles - can be avoided by jumping
    if (obstacleType === 'jump' && playerState.isJumping && player.position.y > 1) {
      return true;
    }

    // Slide obstacles - can be avoided by sliding
    if (obstacleType === 'slide' && playerState.isSliding) {
      return true;
    }

    // Turn obstacles - check if player is in correct lane
    // (For now, treat turns like regular obstacles that require lane avoidance)
    if (obstacleType === 'turn') {
      return false; // Turn obstacles always cause collision if hit
    }

    return false;
  }

  checkBoundaries(player) {
    // Check if player is out of bounds
    if (player.position.x < -4 || player.position.x > 4) {
      return true; // Out of bounds
    }

    if (player.position.y < -10) {
      return true; // Fell off the world
    }

    return false;
  }

  reset() {
    this.playerBounds = null;
    this.obstacleBounds = [];
  }
}

