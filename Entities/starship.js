import * as THREE from '../node_modules/three/build/three.module.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Entity } from './entity.js';

export class Starship extends Entity {
  modelStarship;
  throttle = 0;
  camera;
  force = 0.01;
  isStarshipLoaded = false;
  angle = 0;
  friction = 0.9;
  controls;

  constructor(controls, scene, camera, x, y, z, mass) {
    super(x, y, z, 0, 0, 0, 0.25);
    this.controls = controls;
    this.mass = mass;
    this.camera = camera;
    const loader = new OBJLoader();
    loader.load('../models/starship.obj', (obj) => {
      this.isStarshipLoaded = true;
      this.modelStarship = obj;
      this.controls.target = obj.position;
      scene.add(obj);
      document.addEventListener('keydown', (event) => {
        switch (event.keyCode) {
          case 87:
            this.throttle = 1;
            break;
          case 83:
            this.throttle = -1;
            break;
        }
      });

      document.addEventListener('keyup', () => {
        this.throttle = 0;
      });
    });
  }

  update(dt) {
    if (this.isStarshipLoaded) {
      var cameraDirection = new THREE.Vector3();
      var starShipDirection = new THREE.Vector3();
      this.modelStarship.getWorldDirection(starShipDirection);
      this.camera.getWorldDirection(cameraDirection);

      var dx = cameraDirection.x - starShipDirection.x;
      var dy = cameraDirection.y - starShipDirection.y;
      var dz = cameraDirection.z - starShipDirection.z;
      var magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);
      dx /= magnitude;
      dy /= magnitude;
      dz /= magnitude;

      const fx = this.force * dx * this.throttle;
      const fy = this.force * dy * this.throttle;
      const fz = this.force * dz * this.throttle;

      this.vx += (fx / this.mass) * dt;
      this.vy += (fy / this.mass) * dt;
      this.vz += (fz / this.mass) * dt;

      if (this.throttle === 0) {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vz *= this.friction;
      }

      const cross = cameraDirection.cross(starShipDirection);
      this.angle = (magnitude / this.mass) * this.throttle * 0.1;
      this.modelStarship.rotateOnAxis(cross, this.angle);

      this.modelStarship.position.x += this.vx * dt;
      this.modelStarship.position.y += this.vy * dt;
      this.modelStarship.position.z += this.vz * dt;
    }
  }
}
