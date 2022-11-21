import * as THREE from 'three';
import { ThreeCamera } from './Camera';
import { getGeomType, GeomType, ThreeScene } from './Scene';
import { Vector3 } from 'three';

export interface RaycasterContext {
  camera: ThreeCamera;
  scene: ThreeScene;
}

export interface RaycastHit {
  id: number;
  point: Vector3;
  type: GeomType | undefined;
}

export class ThreeRaycaster {
  private readonly context: RaycasterContext;
  private readonly raycaster: THREE.Raycaster;

  constructor(context: RaycasterContext) {
    this.context = context;
    this.raycaster = new THREE.Raycaster();
  }

  cast = (x: number, y: number, filterFn: (type: GeomType | undefined) => boolean): RaycastHit | null => {
    // Calculate the mouse position in normalized coordinates
    const canvas = this.context.camera.context.canvas;
    const xNorm = (x / canvas.clientWidth) * 2 - 1;
    const yNorm = (-y / canvas.clientHeight) * 2 + 1;
    const coords = new THREE.Vector2(xNorm, yNorm);

    console.log(`Raycast at (${xNorm},${yNorm})`);

    // update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(coords, this.context.camera._getThreeObject());

    // NOTE: I don't know how efficient it is to pass all the meshes in the scene to this
    // Probably makes sense to use some BVH like octrees or scene graphs to optimize this
    const intersections = this.raycaster.intersectObjects(this.context.scene.getAllMeshes());

    const filteredIntersections = intersections.filter((intersection) => filterFn(getGeomType(intersection.object)));

    if (filteredIntersections.length > 0) {
      const first = filteredIntersections[0];
      return { id: first.object.id, point: first.point, type: getGeomType(first.object) };
    }

    return null;
  };
}
