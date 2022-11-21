import { ThreeCamera } from './three/Camera';
import { ThreeScene } from './three/Scene';
import { ThreeRenderer } from './three/Renderer';
import { ThreeRaycaster } from './three/Raycaster';
import { Selection } from './Selection';

interface EditorConfig {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

class Editor {
  private readonly config: EditorConfig;
  private readonly scene: ThreeScene;
  private readonly camera: ThreeCamera;
  private readonly renderer: ThreeRenderer;

  private readonly selection: Selection;

  constructor(config: EditorConfig) {
    this.config = config;

    // Initialize three.js services
    this.scene = new ThreeScene({backgroundColor: 'skyblue'});
    this.camera = new ThreeCamera(config);
    this.renderer = new ThreeRenderer({...config, scene: this.scene, camera: this.camera});
    const raycaster = new ThreeRaycaster({scene: this.scene, camera: this.camera})

    // Initialize the selection service
    this.selection = new Selection({raycaster});

    this.scene.addBox(5, 2, 5);
    this.scene.addSphere(-5, 3, -5);

    requestAnimationFrame(this.render);
  }


  handleResize = (width: number, height: number): void => {
    this.renderer.resize(width, height);
  }

  handleClick = (x: number, y: number, shiftKey: boolean): void => {
    this.selection.pick(x, y, shiftKey);
    console.log("Selected object ids:", this.selection.list());
  }

  render = (): void => {
    this.renderer.render();
    requestAnimationFrame(this.render);
  }
}

export default Editor;
