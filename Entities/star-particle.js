import * as THREE from '../node_modules/three/build/three.module.js';
import { Entity } from './entity.js';

export class StarParticle extends Entity {
  planeGeometry;
  planeMaterial;
  galaxyReference;
  starMesh;
  lodStar;
  light;
  temperature;
  constructor(x, y, z) {
    super(x, y, z, 0, 0, 0, 1);
    this.planeGeometry = new THREE.SphereGeometry(0.1, 20, 20);
    this.planeMaterial = new THREE.MeshBasicMaterial();
    this.planeMaterial.color.setRGB(1, 1, 1);
    this.starMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.lodStar = new THREE.LOD();
    this.lodStar.addLevel(this.starMesh, 0);
  }

  calculateStarColor(temperature) {
    this.temperature = temperature;
    if (temperature >= 50 && temperature < 5000) {
      this.planeMaterial.color.setRGB(196 / 255, 45 / 255, 60 / 255);
    }

    if (temperature >= 5000 && temperature < 10000) {
      this.planeMaterial.color.setRGB(196 / 255, 73 / 255, 59 / 255);
    }

    if (temperature >= 10000 && temperature < 30000) {
      this.planeMaterial.color.setRGB(232 / 255, 247 / 255, 251 / 255);
    }

    if (temperature >= 30000) {
      this.planeMaterial.color.setRGB(192 / 255, 191 / 255, 242 / 255);
    }
  }
}
