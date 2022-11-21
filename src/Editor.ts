import { ThreeCamera } from './three/Camera';
import { ThreeScene } from './three/Scene';
import { ThreeRenderer } from './three/Renderer';
import { ThreeRaycaster } from './three/Raycaster';
import { Selection } from './Selection';
import { createTool, Tool, ToolMode } from './tools/types';
import { Creation } from './Creation';

interface EditorContext {
  canvas: HTMLCanvasElement;
}

class Editor {
  private readonly context: EditorContext;
  private readonly scene: ThreeScene;
  private readonly camera: ThreeCamera;
  private readonly renderer: ThreeRenderer;

  private readonly selection: Selection;
  private readonly creation: Creation;

  private cameraChanged: boolean;

  private tool: Tool;

  constructor(context: EditorContext) {
    this.context = context;

    // Initialize Three.js wrappers
    this.scene = new ThreeScene({ backgroundColor: 'skyblue' });
    this.camera = new ThreeCamera(context);
    this.renderer = new ThreeRenderer({ ...context, scene: this.scene, camera: this.camera });
    const raycaster = new ThreeRaycaster({ scene: this.scene, camera: this.camera });

    // Initialize the selection and creation objects
    this.selection = new Selection({ raycaster });
    this.creation = new Creation({ raycaster, scene: this.scene });

    // Handle camera events to detect clicks correctly
    this.cameraChanged = false;
    this.camera.addChangeListener(() => {
      this.cameraChanged = true;
    });

    this.tool = createTool('select', { selection: this.selection, creation: this.creation, scene: this.scene });

    requestAnimationFrame(this.render);
  }

  handleResize = (width: number, height: number): void => {
    this.renderer.resize(width, height);
  };

  handleMouseUp = (x: number, y: number, shiftKey: boolean): void => {
    // Only perform action if the camera is not changing (dragging)
    if (!this.cameraChanged) {
      this.tool.performAction(x, y, shiftKey);
    }
    // Clear the flag regardless
    this.cameraChanged = false;
  };

  activateTool = (tool: ToolMode) => {
    this.tool = createTool(tool, { selection: this.selection, creation: this.creation, scene: this.scene });
  };

  render = (): void => {
    this.renderer.render();
    requestAnimationFrame(this.render);
  };
}

export default Editor;
