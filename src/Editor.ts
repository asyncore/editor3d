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
  private cameraChanged: boolean;

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

    // Handle camera events to detect clicks correctly
    this.cameraChanged = false;
    this.camera.addChangeListener(() => {
      this.cameraChanged = true;
    });

    requestAnimationFrame(this.render);
  }

  handleResize = (width: number, height: number): void => {
    this.renderer.resize(width, height);
  }

  handleMouseUp = (x: number, y: number, shiftKey: boolean): void => {
    // Only perform picking if the camera is not changing (dragging)
    if (!this.cameraChanged) {
      // If the user is holding down shift,
      // perform additive selection (third arg)
      this.selection.pick(x, y, shiftKey);
      // If nothing is selected, nothing will be highlighted
      this.scene.highlightMeshes(this.selection);
    }
    // Clear the flag regardless
    this.cameraChanged = false;
  }

  render = (): void => {
    this.renderer.render();
    requestAnimationFrame(this.render);
  }
}

export default Editor;
