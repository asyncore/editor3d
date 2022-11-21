import * as THREE from 'three';

export interface SceneConfig {
  backgroundColor?: string;
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
    this.scene.add(plane);
    
    const division = 20;
    const grid = new THREE.GridHelper(planeDim, division, centerLineColor, gridColor);
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
  
  addBox = (x: number, y: number, z: number) => {
    const boxDim = 4;
    const boxGeo = new THREE.BoxGeometry(boxDim, boxDim, boxDim);
    const boxMat = new THREE.MeshPhongMaterial({color: 'purple'});
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(x, y, z);
    this.scene.add(box);
  }
  
  addSphere = (x: number, y: number, z: number) => {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 32;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: 'gold'});
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.set(x, y, z);
    this.scene.add(sphereMesh);
  }
  
  /** @internal */
  getThreeObject = () => this.scene;
}
