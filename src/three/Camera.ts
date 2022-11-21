import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface CameraConfig {
  canvas: HTMLCanvasElement,
  width: number;
  height: number;
}

export class ThreeCamera {
  private readonly camera: THREE.PerspectiveCamera;
  private readonly config: CameraConfig;
  
  constructor(config: CameraConfig) {
    this.config = config;
    const fov = 45;
    const near = 0.1;
    const far = 1000;
    
    this.camera = new THREE.PerspectiveCamera(fov, config.width / config.height, near, far);
    this.camera.position.set(20, 20, 20);
    this.setupControls()
  }
  
  setupControls = (): void => {
    const controls = new OrbitControls(this.camera, this.config.canvas);
    controls.target.set(0, 0, 0);
    controls.update();
  }
  
  update(width: number, height: number) {
    this.config.width = width;
    this.config.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
  
  /** @internal */
  getThreeObject = () => this.camera;
  getConfig = () => this.config;
}
