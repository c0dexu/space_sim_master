export class Entity {
  vx;
  vy;
  vz;

  px;
  py;
  pz;

  mass;

  constructor(px, py, pz, vx, vy, vz, mass) {
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.mass = mass;
    this.px = px;
    this.py = py;
    this.pz = pz;
  }
}
