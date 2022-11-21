import * as THREE from 'three';
import { ThreeCamera } from './Camera';
import { ThreeScene } from './Scene';

export interface RendererConfig {
  camera: ThreeCamera,
  scene: ThreeScene,
}

export class ThreeRenderer {
  private readonly scene: ThreeScene;
  private readonly camera: ThreeCamera;
  private readonly renderer: THREE.WebGLRenderer;

  constructor(config: RendererConfig) {
    this.scene = config.scene;
    this.camera = config.camera;
    const cameraConfig = config.camera.config;
    this.renderer = new THREE.WebGLRenderer({
      canvas: cameraConfig.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(cameraConfig.width, cameraConfig.height, false);
  }

  resize = (width: number, height: number): void => {
    this.renderer.setSize(width, height, false);
    this.camera.update(width, height);
  }

  render = (): void => {
    this.renderer.render(
      this.scene._getThreeObject(),
      this.camera._getThreeObject(),
    );
  }
}
