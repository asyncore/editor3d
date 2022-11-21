import { HitType, ThreeRaycaster } from './three/Raycaster';

interface SelectionConfig {
  raycaster: ThreeRaycaster
}

export class Selection {
  private readonly selectionSet: Set<string>;
  private readonly config: SelectionConfig;

  constructor(config: SelectionConfig) {
    this.config = config;
    this.selectionSet = new Set<string>();
  }

  isSelectable = (type: HitType | undefined): boolean => {
    return type === 'box' || type === 'sphere';
  }

  isPickable = (type: HitType | undefined): boolean => {
    return type === 'box' || type === 'sphere' || type === 'ground';
  }

  pick = (x: number, y: number, additive: boolean) => {
    const hit = this.config.raycaster.cast(x, y, this.isPickable);
    if (hit) {
      if (this.isSelectable(hit.type)) {
        // If the user is holding down shift, perform additive selection
        if (this.isSelected(hit.id) && additive) {
          this.remove(hit.id);
        } else if (!this.isSelected(hit.id)) {
          // If the selection is additive, only the picked object will be selected
          // Otherwise it will be added to the selection
          if (!additive) {
            this.clear();
          }
          this.add(hit.id);
        }
      } else {
        // If the pick hit an unselectable object, clear the selection
        this.clear();
      }
    } else {
      // If the pick didn't hit any object, clear the selection
      this.clear();
    }
  }

  isSelected = (objectId: string): boolean => {
    return this.selectionSet.has(objectId);
  }

  add = (...objectIds: string[]): void => {
    objectIds.forEach((id) => {
      this.selectionSet.add(id);
    });
  };

  remove = (...objectIds: string[]): void => {
    objectIds.forEach((id) => {
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
}

