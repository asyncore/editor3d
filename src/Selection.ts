import { ThreeRaycaster } from './three/Raycaster';
import { GeomType } from './three/Scene';

interface SelectionConfig {
  raycaster: ThreeRaycaster
}

export class Selection {
  private readonly selectionSet: Set<number>;
  private readonly config: SelectionConfig;

  constructor(config: SelectionConfig) {
    this.config = config;
    this.selectionSet = new Set<number>();
  }

  isSelectable = (type: GeomType | undefined): boolean => {
    return type === 'box' || type === 'sphere';
  }

  isPickable = (type: GeomType | undefined): boolean => {
    return type === 'box' || type === 'sphere' || type === 'ground';
  }

  count = (): number => this.selectionSet.size;

  has = (objectId: number): boolean => {
    return this.selectionSet.has(objectId);
  }

  isSelected = (objectId: number) => this.has(objectId);

  forEach = (callback: (objectId: number) => void): void => {
    this.selectionSet.forEach(callback);
  }

  add = (...objectIds: number[]): void => {
    objectIds.forEach(id => {
      this.selectionSet.add(id);
    });
  };

  remove = (...objectIds: number[]): void => {
    objectIds.forEach(id => {
      if (this.selectionSet.has(id)) {
        this.selectionSet.delete(id);
      }
    });
  };

  clear = (): void => {
    this.selectionSet.clear();
  }

  list = () => {
    return Array.from(this.selectionSet.values());
  }

  pick = (x: number, y: number, additive: boolean) => {
    const hit = this.config.raycaster.cast(x, y, this.isPickable);
    if (hit) {
      if (this.isSelectable(hit.type)) {
        if (this.isSelected(hit.id)) {
          // if the selection is additive, the picked object will be unselected
          // Otherwise, only the picked object will be selected
          if (additive) {
            this.remove(hit.id);
          } else {
            this.clear();
            this.add(hit.id);
          }
        } else {
          // If the selection is additive, the picked object will be added
          // to the selection. Otherwise, only the picked object will be selected
          if (!additive) {
            this.clear();
          }
          this.add(hit.id);
        }
      } else {
        // If the pick hit an unselectable object, clear the selection
        // Unless the selection is additive
        if (!additive) {
          this.clear();
        }
      }
    } else {
      // If the pick didn't hit any object, clear the selection
      // Unless the selection is additive
      if (!additive) {
        this.clear();
      }
    }
  }
}
