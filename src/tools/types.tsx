import { SelectTool, SelectToolContext } from './SelectTool';
import { BoxTool, CreateToolContext } from './BoxTool';
import { SphereTool } from './SphereTool';


export type ToolContext = SelectToolContext & CreateToolContext;

export type ToolMode = 'select' | 'box' | 'sphere';

export interface Tool {
  performAction: (x: number, y: number, shiftKey: boolean) => void
}

export function createTool(tool: ToolMode, context: ToolContext): Tool {
  switch (tool) {
    case 'select':
      return new SelectTool(context);
    case 'box':
      return new BoxTool(context);
    case 'sphere':
      return new SphereTool(context);
  }
}
