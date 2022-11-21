import * as THREE from 'three';
import { Object3D } from 'three';
import { Selection } from '../Selection';

export interface SceneConfig {
  backgroundColor?: string;
}

export type GeomType = 'ground' | 'box' | 'sphere' | 'selection';

export function setGeomType(object: THREE.Object3D, type: GeomType): void {
  object.userData['GeomType'] = type;
}

export function getGeomType(object: THREE.Object3D): GeomType | undefined {
  return object.userData['GeomType'];
}

export function isMesh(object: Object3D): object is THREE.Mesh {
  return object.type === 'Mesh';
}

export class ThreeScene {
  private readonly scene: THREE.Scene;
  // Used for keeping track of transient mesh ids
  // Key: solid mesh id, value: wireframe mesh id
  private readonly transientIdMap: Map<number, number>;

  constructor(config: SceneConfig) {
    const color = config.backgroundColor ?? 'skyBlue';
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(color);

    this.setupGround();
    this.setupLighting();

    this.transientIdMap = new Map<number, number>();
  }

  setupGround = (): void => {
    const planeColor = 'tan';
    const centerLineColor = 'orangered';
    const gridColor = 'sandybrown';

    const planeDim = 100;
    const planeGeo = new THREE.PlaneGeometry(planeDim, planeDim);
    const planeMat = new THREE.MeshPhongMaterial({
      color: planeColor,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = Math.PI * -.5;
    setGeomType(plane, 'ground');
    this.scene.add(plane);

    const division = 20;
    const grid = new THREE.GridHelper(planeDim, division, centerLineColor, gridColor);
    setGeomType(grid, 'ground');
    this.scene.add(grid);
  }

  setupLighting = (): void => {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(15, 20, 10);
    light.target.position.set(0, 0, 0);
    this.scene.add(light);
    this.scene.add(light.target);
  }

  addBox = (x: number, y: number, z: number): number => {
    const boxDim = 4;
    const boxGeo = new THREE.BoxGeometry(boxDim, boxDim, boxDim);
    const boxMat = new THREE.MeshPhongMaterial({color: 'purple'});
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(x, y, z);
    setGeomType(box, 'box');
    this.scene.add(box);
    return box.id;
  }

  addWireframeBox = (x: number, y: number, z: number): number => {
    const boxDim = 4.05;
    const boxGeo = new THREE.BoxGeometry(boxDim, boxDim, boxDim);
    const boxWrf = new THREE.WireframeGeometry(boxGeo);
    const boxSeg = new THREE.LineSegments(boxWrf);
    boxSeg.material = new THREE.LineBasicMaterial({color: 'lime'});
    boxSeg.material.opacity = 0.75;
    boxSeg.material.transparent = true;
    boxSeg.position.set(x, y, z);
    setGeomType(boxSeg, 'selection');
    this.scene.add(boxSeg);
    return boxSeg.id;
  }

  addSphere = (x: number, y: number, z: number): number => {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 32;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: 'gold'});
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(x, y, z);
    setGeomType(sphere, 'sphere');
    this.scene.add(sphere);
    return sphere.id;
  }

  addWireframeSphere = (x: number, y: number, z: number): number => {
    const sphereRadius = 3.05;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 32;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereWrf = new THREE.WireframeGeometry(sphereGeo);
    const sphereSeg = new THREE.LineSegments(sphereWrf);
    sphereSeg.material = new THREE.LineBasicMaterial({color: 'lime'});
    sphereSeg.material.opacity = 0.75;
    sphereSeg.material.transparent = true;
    sphereSeg.position.set(x, y, z);
    setGeomType(sphereSeg, 'selection');
    this.scene.add(sphereSeg);
    return sphereSeg.id;
  }

  removeMesh = (objectId: number): boolean => {
    const object = this.scene.getObjectById(objectId);
    if (object) {
      this.scene.remove(object);
      return true;
    }
    return false;
  }

  getAllMeshes = (): THREE.Mesh[] => {
    return this.scene.children.filter(isMesh);
  }

  highlightMeshes = (selection: Selection): void => {
    if (selection.count() > 0) {
      selection.forEach(objectId => {
        // If the object is highlighted already, don't add another transient mesh
        if (!this.transientIdMap.has(objectId)) {
          const object = this.scene.getObjectById(objectId);
          if (object) {
            const pos = object.position;
            const type = getGeomType(object);
            let transientId: number | null = null;
            if (type === 'sphere') {
              transientId = this.addWireframeSphere(pos.x, pos.y, pos.z);
            } else if (type === 'box') {
              transientId = this.addWireframeBox(pos.x, pos.y, pos.z);
            }
            if (transientId) {
              this.transientIdMap.set(objectId, transientId);
            }
          }
        }
        // Remove the other transient meshes (and delete its id) that are NOT in the selection.
        this.transientIdMap.forEach((transientId, objectId, map) => {
          if (!selection.has(objectId)) {
            map.delete(objectId);
            this.removeMesh(transientId);
          }
        })
      })
    } else {
      // remove all the transient meshes and then clear the map
      this.transientIdMap.forEach((transientId, _objectId) => {
        this.removeMesh(transientId);
      })
      // then clear the map because no transient mesh remains
      this.transientIdMap.clear();
    }
  }

  /** @internal */
  _getThreeObject = () => this.scene;
}
