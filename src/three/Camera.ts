import * as THREE from 'three';

export interface CameraConfig {
  width: number;
  height: number;
}

export class ThreeCamera {
  private readonly camera: THREE.PerspectiveCamera;
  
  constructor(config: CameraConfig) {
    const fov = 45;
    const near = 0.1;
    const far = 1000;
    
    this.camera = new THREE.PerspectiveCamera(fov, config.width / config.height, near, far);
    this.camera.position.set(0, 10, 20);
    this.camera.rotation.set(-0.3, 0, 0);
  }
  
  update(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
  
  /** @internal */
  getThreeObject = () => this.camera;
}
