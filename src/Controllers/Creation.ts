import { ThreeRaycaster } from '../ThreeWrappers/Raycaster';
import { GeomType, getRadius, getSize, ThreeScene } from '../ThreeWrappers/Scene';
import { calculateTangentSpherePosition } from '../ThreeWrappers/util';

export interface CreationContext {
  raycaster: ThreeRaycaster;
  scene: ThreeScene;
}

export class Creation {
  private readonly context: CreationContext;

  constructor(context: CreationContext) {
    this.context = context;
  }

  isCreatable = (type: GeomType | undefined): boolean => {
    return type === 'box' || type === 'sphere' || type === 'ground';
  };

  createBoxAt(x: number, y: number) {
    const hit = this.context.raycaster.cast(x, y, this.isCreatable);
    const size = 1 + Math.random() * 4;
    if (hit) {
      if (hit.type === 'ground') {
        this.context.scene.addBox(hit.point.x, hit.point.y + size / 2, hit.point.z, size);
      } else if (hit.type === 'box') {
        const mesh = this.context.scene.getMeshById(hit.id);
        const y = mesh ? mesh.position.y + (getSize(mesh) ?? 0) / 2 : hit.point.y;
        this.context.scene.addBox(hit.point.x, y + size / 2, hit.point.z, size);
      } else if (hit.type === 'sphere') {
        const mesh = this.context.scene.getMeshById(hit.id);
        const x = mesh ? mesh.position.x : hit.point.x;
        const y = mesh ? mesh.position.y + (getRadius(mesh) ?? 0) : hit.point.y;
        const z = mesh ? mesh.position.z : hit.point.z;
        this.context.scene.addBox(x, y + size / 2, z, size);
      }
    }
  }

  createSphereAt(x: number, y: number) {
    const hit = this.context.raycaster.cast(x, y, this.isCreatable);
    const radius = 0.5 + Math.random() * 2.5;
    if (hit) {
      if (hit.type === 'ground') {
        this.context.scene.addSphere(hit.point.x, hit.point.y + radius, hit.point.z, radius);
      } else if (hit.type === 'sphere') {
        const mesh = this.context.scene.getMeshById(hit.id);
        if (mesh) {
          const { x, y, z } = calculateTangentSpherePosition(mesh.position, hit.point, radius, getRadius(mesh) ?? 0);
          this.context.scene.addSphere(x, y, z, radius);
        } else {
          const { x, y, z } = hit.point;
          this.context.scene.addSphere(x, y + radius, z, radius);
        }
      } else if (hit.type === 'box') {
        const mesh = this.context.scene.getMeshById(hit.id);
        const x = mesh ? mesh.position.x : hit.point.x;
        const y = mesh ? mesh.position.y + (getSize(mesh) ?? 0) / 2 : hit.point.y;
        const z = mesh ? mesh.position.z : hit.point.z;
        this.context.scene.addSphere(x, y + radius, z, radius);
      }
    }
  }
}
