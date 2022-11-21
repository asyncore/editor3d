import * as THREE from 'three';
import { Object3D } from 'three';
import { setHitType } from './Raycaster';

export interface SceneConfig {
  backgroundColor?: string;
}

export function isMesh(object: Object3D): object is THREE.Mesh {
  return object.type === 'Mesh';
}

export class ThreeScene {
  private readonly scene: THREE.Scene;

  constructor(config: SceneConfig) {
    const color = config.backgroundColor ?? 'skyBlue';
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(color);

    this.setupGround();
    this.setupLighting();
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
    setHitType(plane, 'ground');
    this.scene.add(plane);

    const division = 20;
    const grid = new THREE.GridHelper(planeDim, division, centerLineColor, gridColor);
    setHitType(grid, 'ground');
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

  addBox = (x: number, y: number, z: number): void => {
    const boxDim = 4;
    const boxGeo = new THREE.BoxGeometry(boxDim, boxDim, boxDim);
    const boxMat = new THREE.MeshPhongMaterial({color: 'purple'});
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(x, y, z);
    setHitType(box, 'box');
    this.scene.add(box);
  }

  addSphere = (x: number, y: number, z: number): void => {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 32;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: 'gold'});
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(x, y, z);
    setHitType(sphere, 'sphere');
    this.scene.add(sphere);
  }

  getAllMeshes = (): THREE.Mesh[] => {
    return this.scene.children.filter(isMesh);
  }

  /** @internal */
  _getThreeObject = () => this.scene;
}
