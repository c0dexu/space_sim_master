import * as THREE from '../node_modules/three/build/three.module.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Entity } from './entity.js';

export class Starship extends Entity {
  modelStarship;
  throttle = 0;
  camera;
  force = 0.075;
  isStarshipLoaded = false;
  angle = 0;
  friction = 0.9;
  controls;
  starshipMaterial;
  lightTop;
  lightBottom;
  maxVelocity = 2;

  constructor(controls, scene, camera, x, y, z, mass) {
    super(x, y, z, 0, 0, 0, 0.25);
    this.controls = controls;
    this.mass = mass;
    this.camera = camera;
    const meshes = [];
    const loader = new OBJLoader();
    loader.load('../models/starship.obj', (obj) => {
      this.lightTop = new THREE.PointLight(0xffffff, 1.5);
      this.lightBottom = new THREE.PointLight(0xffffff, 1);
      scene.add(this.lightTop);
      scene.add(this.lightBottom);
      this.starshipMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.78,
        roughness: 0.078,
      });
      this.isStarshipLoaded = true;
      this.modelStarship = obj;

      obj.traverse((child) => {
        meshes.push(child);
      });

      console.log(meshes);

      meshes.forEach((mesh) => {
        mesh.material = this.starshipMaterial;
      });

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

      const fx =
        this.force *
        (cameraDirection.x / starShipDirection.length()) *
        this.throttle;
      const fy =
        this.force *
        (cameraDirection.y / starShipDirection.length()) *
        this.throttle;
      const fz =
        this.force *
        (cameraDirection.z / starShipDirection.length()) *
        this.throttle;

      if (this.throttle === 0) {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vz *= this.friction;
      } else {
        if (
          this.vx * this.vx + this.vy * this.vy + this.vz * this.vz <
          this.maxVelocity
        ) {
          this.vx += (fx / this.mass) * dt;
          this.vy += (fy / this.mass) * dt;
          this.vz += (fz / this.mass) * dt;
        } else {
          this.vx =
            (this.maxVelocity * cameraDirection.x) / starShipDirection.length();
          this.vy =
            (this.maxVelocity * cameraDirection.y) / starShipDirection.length();
          this.vz =
            (this.maxVelocity * cameraDirection.z) / starShipDirection.length();
        }
      }

      var cross = cameraDirection.cross(starShipDirection);
      cross = cross.normalize();

      var steer = new THREE.Vector3(dx, dy, dz);
      var finalVector = new THREE.Vector3();
      finalVector.x = starShipDirection.x - steer.x * dt * this.throttle * 2;
      finalVector.y = starShipDirection.y - steer.y * dt * this.throttle * 2;
      finalVector.z = starShipDirection.z - steer.z * dt * this.throttle * 2;

      this.modelStarship.lookAt(finalVector);

      this.modelStarship.position.x += this.vx * dt;
      this.modelStarship.position.y += this.vy * dt;
      this.modelStarship.position.z += this.vz * dt;

      this.lightTop.position.set(
        this.modelStarship.position.x,
        this.modelStarship.position.y + 3,
        this.modelStarship.position.z
      );

      this.lightBottom.position.set(
        this.modelStarship.position.x,
        this.modelStarship.position.y - 3,
        this.modelStarship.position.z
      );
    }
  }
}
