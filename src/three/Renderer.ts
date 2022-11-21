import * as THREE from 'three';
import { ThreeCamera } from './Camera';
import { ThreeScene } from './Scene';

export interface RendererContext {
  camera: ThreeCamera;
  scene: ThreeScene;
}

export class ThreeRenderer {
  private readonly scene: ThreeScene;
  private readonly camera: ThreeCamera;
  private readonly renderer: THREE.WebGLRenderer;

  constructor(context: RendererContext) {
    this.scene = context.scene;
    this.camera = context.camera;
    const canvas = context.camera.context.canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  }

  resize = (width: number, height: number): void => {
    this.renderer.setSize(width, height, false);
    this.camera.update(width, height);
  };

  render = (): void => {
    this.renderer.render(this.scene._getThreeObject(), this.camera._getThreeObject());
  };
}
