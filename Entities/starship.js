import * as THREE from '../node_modules/three/build/three.module.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Entity } from './entity.js';

export class Starship extends Entity {
  modelStarship;

  constructor(scene, x, y, z) {
    super(x, y, z, 0, 0, 0, 0.25);
    const loader = new OBJLoader();
    loader.load('../models/starship.obj', (obj) => {
      this.modelStarship = obj;
      scene.add(obj);
    });
  }
}
