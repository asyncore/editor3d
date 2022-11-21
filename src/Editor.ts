import { ThreeCamera } from './three/Camera';
import { ThreeScene } from './three/Scene';
import { ThreeRenderer } from './three/Renderer';

interface EditorConfig {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

class Editor {
  private readonly scene: ThreeScene;
  private readonly camera: ThreeCamera;
  private readonly renderer: ThreeRenderer;
  
  constructor(config: EditorConfig) {
    
    this.scene = new ThreeScene({backgroundColor: 'skyblue'});
    
    this.camera = new ThreeCamera({
      width: config.width,
      height: config.height
    });
    
    this.renderer = new ThreeRenderer({
      ...config,
      scene: this.scene,
      camera: this.camera
    });
    
    this.scene.addBox(5, 2, 5);
    this.scene.addSphere(-5, 3, -5);
    
    requestAnimationFrame(this.render);
  }
  
  
  resize = (width: number, height: number): void => {
    this.renderer.resize(width, height);
  }
  
  render = (): void => {
    this.renderer.render();
    requestAnimationFrame(this.render);
  }
}

export default Editor;
