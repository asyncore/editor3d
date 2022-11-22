import { ThreeCamera } from '../ThreeWrappers/Camera';
import { ThreeScene } from '../ThreeWrappers/Scene';
import { ThreeRenderer } from '../ThreeWrappers/Renderer';
import { ThreeRaycaster } from '../ThreeWrappers/Raycaster';
import { Selection } from './Selection';
import { createTool, Tool, ToolMode } from '../Tools/types';
import { Creation } from './Creation';
import { Inspection } from './Inspection';

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
  private readonly inspection: Inspection;

  private cameraChanged: boolean;

  private tool: Tool | null;

  constructor(context: EditorContext) {
    this.context = context;

    // Initialize Three.js wrappers
    this.scene = new ThreeScene({ backgroundColor: 'skyblue' });
    this.camera = new ThreeCamera(context);
    this.renderer = new ThreeRenderer({ ...context, scene: this.scene, camera: this.camera });
    const raycaster = new ThreeRaycaster({ scene: this.scene, camera: this.camera });

    // Initialize the selectio, creation, and inspection controllers
    this.selection = new Selection({ raycaster });
    this.creation = new Creation({ raycaster, scene: this.scene });
    this.inspection = new Inspection({ scene: this.scene });

    // Handle camera events to detect clicks correctly
    this.cameraChanged = false;
    this.camera.addChangeListener(() => {
      this.cameraChanged = true;
    });

    this.tool = null;

    this.scene.addBox(12, 2, 3, 4);
    this.scene.addSphere(-12, 5, -3, 5);

    requestAnimationFrame(this.render);
  }

  handleResize = (width: number, height: number): void => {
    this.renderer.resize(width, height);
  };

  handleMouseUp = (x: number, y: number, shiftKey: boolean): void => {
    // Only perform action if the camera is not changing (dragging)
    if (!this.cameraChanged && this.tool) {
      this.tool.performAction(x, y, shiftKey);
    }
    // Clear the flag regardless
    this.cameraChanged = false;
  };

  getSelection = (): Selection => this.selection;

  getCreation = (): Creation => this.creation;

  getInspection = (): Inspection => this.inspection;

  activateTool = (tool: ToolMode) => {
    this.tool = createTool(tool, { selection: this.selection, creation: this.creation, scene: this.scene });
  };

  render = (): void => {
    this.renderer.render();
    requestAnimationFrame(this.render);
  };
}

export default Editor;
