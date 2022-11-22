import { ThreeRaycaster } from '../ThreeWrappers/Raycaster';
import { GeomType } from '../ThreeWrappers/Scene';

interface SelectionContext {
  raycaster: ThreeRaycaster;
}

export class Selection {
  private readonly selectionSet: Set<number>;
  private readonly context: SelectionContext;
  private cbSelectionChanged: ((selectedIds: number[]) => void) | null;

  constructor(context: SelectionContext) {
    this.context = context;
    this.selectionSet = new Set<number>();
    this.cbSelectionChanged = null;
  }

  setSelectionChanged = (callback: (selectedIds: number[]) => void): void => {
    this.cbSelectionChanged = callback;
  };

  isSelectable = (type: GeomType | undefined): boolean => {
    return type === 'box' || type === 'sphere';
  };

  count = (): number => this.selectionSet.size;

  has = (objectId: number): boolean => {
    return this.selectionSet.has(objectId);
  };

  isSelected = (objectId: number) => this.has(objectId);

  forEach = (callback: (objectId: number) => void): void => {
    this.selectionSet.forEach(callback);
  };

  add = (...objectIds: number[]): void => {
    let added = false;
    objectIds.forEach((id) => {
      if (!this.selectionSet.has(id)) {
        this.selectionSet.add(id);
        added = true;
      }
    });
    if (added && this.cbSelectionChanged) {
      this.cbSelectionChanged(this.list());
    }
  };

  remove = (...objectIds: number[]): void => {
    let removed = false;
    objectIds.forEach((id) => {
      if (this.selectionSet.has(id)) {
        this.selectionSet.delete(id);
        removed = true;
      }
    });
    if (removed && this.cbSelectionChanged) {
      this.cbSelectionChanged(this.list());
    }
  };

  set = (...objectIds: number[]): void => {
    const idsSubset = objectIds.every((id) => this.selectionSet.has(id));
    const sizeBefore = this.selectionSet.size;
    this.selectionSet.clear();
    objectIds.forEach((id) => {
      this.selectionSet.add(id);
    });
    const sizeAfter = this.selectionSet.size;
    const sameSet = idsSubset && sizeBefore === sizeAfter;
    if (!sameSet && this.cbSelectionChanged) {
      this.cbSelectionChanged(this.list());
    }
  };

  clear = (): void => {
    if (this.selectionSet.size > 0) {
      this.selectionSet.clear();
      if (this.cbSelectionChanged) {
        this.cbSelectionChanged(this.list());
      }
    }
  };

  list = () => {
    return Array.from(this.selectionSet.values());
  };

  pick = (x: number, y: number, additive: boolean) => {
    const hit = this.context.raycaster.cast(x, y, this.isSelectable);
    if (hit) {
      if (this.isSelected(hit.id)) {
        // if the selection is additive, the picked object will be unselected
        // Otherwise, only the picked object will be selected
        if (additive) {
          this.remove(hit.id);
        } else {
          this.set(hit.id);
        }
      } else {
        // If the selection is additive, the picked object will be added
        // to the selection. Otherwise, only the picked object will be selected
        if (additive) {
          this.add(hit.id);
        } else {
          this.set(hit.id);
        }
      }
    } else {
      // If the pick didn't hit any object, clear the selection
      // Unless the selection is additive
      if (!additive) {
        this.clear();
      }
    }
  };
}
