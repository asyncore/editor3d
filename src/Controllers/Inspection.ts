import { ThreeScene } from '../ThreeWrappers/Scene';

export type number3 = [number, number, number];

export type MultiValueProperty = number | 'Mixed';

export type MultiValueProperty3 = [MultiValueProperty, MultiValueProperty, MultiValueProperty];

export interface InspectionContext {
  scene: ThreeScene;
}

export function roundNumber(value: number, digits = 3) {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
}

export class Inspection {
  private readonly context: InspectionContext;

  constructor(context: InspectionContext) {
    this.context = context;
  }

  getMultiPosition = (...objectIds: number[]): MultiValueProperty3 | null => {
    const posXSet = new Set<number | null>();
    const posYSet = new Set<number | null>();
    const posZSet = new Set<number | null>();
    objectIds.forEach((objectId) => {
      const position = this.context.scene.getPositionById(objectId);
      if (position) {
        posXSet.add(roundNumber(position[0]));
        posYSet.add(roundNumber(position[1]));
        posZSet.add(roundNumber(position[2]));
      }
    });
    if (posXSet.size === 0) {
      return null;
    }
    const x = posXSet.size > 1 ? 'Mixed' : posXSet.values().next().value;
    const y = posYSet.size > 1 ? 'Mixed' : posYSet.values().next().value;
    const z = posZSet.size > 1 ? 'Mixed' : posZSet.values().next().value;
    return [x, y, z];
  };

  getMultiScaling = (...objectIds: number[]): MultiValueProperty3 | null => {
    const sclXSet = new Set<number | null>();
    const sclYSet = new Set<number | null>();
    const sclZSet = new Set<number | null>();
    objectIds.forEach((objectId) => {
      const factor = this.context.scene.getScalingById(objectId);
      if (factor) {
        const percentage = factor.map((f) => f * 100);
        sclXSet.add(roundNumber(percentage[0]));
        sclYSet.add(roundNumber(percentage[1]));
        sclZSet.add(roundNumber(percentage[2]));
      }
    });
    if (sclXSet.size === 0) {
      return null;
    }
    const x = sclXSet.size > 1 ? 'Mixed' : sclXSet.values().next().value;
    const y = sclYSet.size > 1 ? 'Mixed' : sclYSet.values().next().value;
    const z = sclZSet.size > 1 ? 'Mixed' : sclZSet.values().next().value;
    return [x, y, z];
  };

  getMultiRotation = (...objectIds: number[]): MultiValueProperty3 | null => {
    const rotXSet = new Set<number | null>();
    const rotYSet = new Set<number | null>();
    const rotZSet = new Set<number | null>();
    objectIds.forEach((objectId) => {
      const radian = this.context.scene.getRotationById(objectId);
      if (radian) {
        const degrees = radian.map((r) => (r / Math.PI) * 180);
        rotXSet.add(roundNumber(degrees[0]));
        rotYSet.add(roundNumber(degrees[1]));
        rotZSet.add(roundNumber(degrees[2]));
      }
    });
    if (rotXSet.size === 0) {
      return null;
    }
    const x = rotXSet.size > 1 ? 'Mixed' : rotXSet.values().next().value;
    const y = rotYSet.size > 1 ? 'Mixed' : rotYSet.values().next().value;
    const z = rotZSet.size > 1 ? 'Mixed' : rotZSet.values().next().value;
    return [x, y, z];
  };
}
