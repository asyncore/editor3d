import * as THREE from "three";

export function calculateTangentSpherePosition(
  centerPoint: THREE.Vector3,
  surfacePoint: THREE.Vector3,
  radiusA: number,
  radiusB: number
): THREE.Vector3 {
  const normal = new THREE.Vector3().subVectors(surfacePoint, centerPoint).normalize();
  normal.multiplyScalar(radiusA + radiusB);
  return normal.add(centerPoint);
}
