import * as THREE from '../node_modules/three/build/three.module.js';
import { StarParticle } from './star-particle.js';

export class Galaxy {
  px;
  py;
  pz;
  obj3d = new THREE.Object3D();
  radius;
  stars = [];
  boundingBox;

  constructor(x, y, z, radius) {
    this.px = x;
    this.py = y;
    this.pz = z;
    this.obj3d.position.set(x, y, z);
    this.radius = radius;
  }

  generateSimpleSpiral(num_stars, dr, pulse, dt, dd, w, ff) {
    var n = num_stars;
    for (var r = 0; r < this.radius; r += dr) {
      const x = this.px + r * Math.cos(pulse);
      const y = this.py;
      const z = this.pz + r * ff * Math.sin(pulse);
      pulse += w * dt;
      var i = 0;

      while (i < n) {
        const dx = (Math.random() * 2 - 1) * dd;
        const dy = (Math.random() * 2 - 1) * dd;
        const dz = (Math.random() * 2 - 1) * dd;
        const star = new StarParticle(x + dx, y + dy, z + dz);
        star.starMesh.position.set(x + dx, y + dy, z + dz);
        star.galaxyReference = this;
        star.calculateStarColor(50 + Math.random(0, 1) * 30000);
        this.stars.push(star);
        this.obj3d.add(star.starMesh);
        i += 1;
      }
    }
    this.boundingBox = new THREE.Box3().setFromObject(this.obj3d);
  }
}
