import { Tool } from './types';
import { Selection } from '../Selection';
import { ThreeScene } from '../three/Scene';

export interface SelectToolContext {
  selection: Selection;
  scene: ThreeScene;
}

export class SelectTool implements Tool {
  private readonly context: SelectToolContext;

  constructor(context: SelectToolContext) {
    this.context = context;
  }

  performAction = (x: number, y: number, shiftKey: boolean): void => {
    // If the user is holding down shift,
    // perform additive selection (third arg)
    this.context.selection.pick(x, y, shiftKey);
    // If nothing is selected, nothing will be highlighted
    this.context.scene.highlightMeshes(this.context.selection);
  };
}
