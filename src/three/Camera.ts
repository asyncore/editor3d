import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface CameraContext {
  canvas: HTMLCanvasElement;
}

export class ThreeCamera {
  readonly context: CameraContext;

  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;

  constructor(context: CameraContext) {
    this.context = context;
    const fov = 45;
    const near = 0.1;
    const far = 1000;
    const aspect = context.canvas.clientWidth / context.canvas.clientWidth;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(20, 20, 20);

    // Setup orbit controls
    this.controls = new OrbitControls(this.camera, this.context.canvas);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  addChangeListener = (callback: (event: any) => void): void => {
    this.controls.addEventListener('change', callback);
  };

  removeChangetListener = (callback: (event: any) => void): void => {
    this.controls.removeEventListener('change', callback);
  };

  update(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  /** @internal */
  _getThreeObject = () => this.camera;
}
