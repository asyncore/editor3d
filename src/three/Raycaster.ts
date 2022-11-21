import * as THREE from 'three';
import { ThreeCamera } from './Camera';
import { ThreeScene } from './Scene';

export interface RaycasterConfig {
  camera: ThreeCamera,
  scene: ThreeScene,
}

export type HitType = 'ground' | 'box' | 'sphere' | 'selection';

export function setHitType(object: THREE.Object3D, hit: HitType): void {
  object.userData['HitType'] = hit;
}

export function getHitType(object: THREE.Object3D): HitType | undefined {
  return object.userData['HitType'];
}

export interface RaycastHit {
  type: HitType | undefined;
  id: string;
}

export class ThreeRaycaster {
  private readonly config: RaycasterConfig;
  private readonly raycaster: THREE.Raycaster;

  constructor(config: RaycasterConfig) {
    this.config = config;
    this.raycaster = new THREE.Raycaster();
  }

  cast = (
    x: number,
    y: number,
    filterFn: (hitType: HitType | undefined) => boolean,
  ): RaycastHit | null => {
    // Calculate the mouse position in normalized coordinates
    const cameraConfig = this.config.camera.config;
    const xNorm = x / cameraConfig.width * 2 - 1;
    const yNorm = -y / cameraConfig.height * 2 + 1;
    const coords = new THREE.Vector2(xNorm, yNorm);

    // update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(coords, this.config.camera._getThreeObject());

    // NOTE: I don't know how efficient it is to pass all the meshes in the scene to this
    // Probably makes sense to use some BVH like octrees or scene graphs to optimize this
    const intersections = this.raycaster.intersectObjects(this.config.scene.getAllMeshes());

    const filteredObjects = intersections
      .map(intersection => intersection.object)
      .filter(object => filterFn(getHitType(object)));

    if (filteredObjects.length > 0) {
      return {id: filteredObjects[0].uuid, type: getHitType(filteredObjects[0])};
    }

    return null;
  }
}