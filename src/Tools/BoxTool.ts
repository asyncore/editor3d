import { Tool } from './types';
import { ThreeScene } from '../ThreeWrappers/Scene';
import { Creation } from '../Controllers/Creation';

export interface CreateToolContext {
  creation: Creation;
  scene: ThreeScene;
}

export class BoxTool implements Tool {
  private readonly context: CreateToolContext;

  constructor(context: CreateToolContext) {
    this.context = context;
  }

  performAction = (x: number, y: number, _: boolean): void => {
    this.context.creation.createBoxAt(x, y);
  };
}
