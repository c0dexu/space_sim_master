import * as THREE from '../node_modules/three/build/three.module.js';
import { Entity } from './entity.js';

export class StarParticle extends Entity {
  planeGeometry;
  planeMaterial;
  galaxyReference;
  starMesh;
  constructor(x, y, z, r, g, b) {
    super(x, y, z, 0, 0, 0, 1);
    this.planeGeometry = new THREE.SphereGeometry(0.065, 20, 20);
    this.planeMaterial = new THREE.MeshBasicMaterial();
    this.planeMaterial.color.setRGB(r, g, b);
    this.starMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
  }
}
