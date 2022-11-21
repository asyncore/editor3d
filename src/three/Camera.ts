import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface CameraConfig {
  canvas: HTMLCanvasElement,
  width: number;
  height: number;
}

export class ThreeCamera {
  readonly config: CameraConfig;

  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;

  constructor(config: CameraConfig) {
    this.config = config;
    const fov = 45;
    const near = 0.1;
    const far = 1000;

    this.camera = new THREE.PerspectiveCamera(fov, config.width / config.height, near, far);
    this.camera.position.set(20, 20, 20);

    // Setup orbit controls
    this.controls = new OrbitControls(this.camera, this.config.canvas);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  addChangeListener = (callback: (event: any) => void): void => {
    this.controls.addEventListener('change', callback);
  }

  removeChangetListener = (callback: (event: any) => void): void => {
    this.controls.removeEventListener('change', callback);
  }

  update(width: number, height: number) {
    this.config.width = width;
    this.config.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }


  /** @internal */
  _getThreeObject = () => this.camera;
}
