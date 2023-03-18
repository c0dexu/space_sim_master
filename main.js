import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Galaxy } from './Entities/galaxy.js';
import { Starship } from './Entities/starship.js';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });

const fov = 65;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 200;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const controls = new OrbitControls(camera, renderer.domElement);
const scene = new THREE.Scene();
const galaxy = new Galaxy(0, 0, 0, 900);

const starship = new Starship(controls, scene, camera, 0, 0, 0, 0.25);

const asdf = new THREE.SphereGeometry(10);
const sdf = new THREE.MeshPhongMaterial();
sdf.color.setRGB(0.25, 0.3, 0.01);
const qwert = new THREE.Mesh(asdf, sdf);

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass();

bloomPass.renderToScreen = true;

bloomPass.strength = 1.5;
// bloomPass.radius = 1.25;

composer.addPass(renderPass);
composer.addPass(bloomPass);

controls.enablePan = false;
controls.enableZoom = false;

controls.update();

galaxy.generateSimpleSpiral(5, 1, 0.1, 0.35, 100, 0.25, 1);

camera.position.z = 5;
controls.update();
scene.add(galaxy.obj3d);
composer.renderer.domElement = canvas;

camera.layers.enable(1);

onWindowResize();

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  composer.setSize(width, height);
}

window.addEventListener('resize', onWindowResize);

var direction = new THREE.Vector3();
var cameraOffset = 5;

function render(time) {
  camera.updateProjectionMatrix();
  renderer.autoClear = false;
  renderer.clear();
  camera.layers.set(1);
  composer.render();
  renderer.clearDepth();
  camera.layers.set(0);
  renderer.render(scene, camera);
  direction.subVectors(camera.position, controls.target);
  direction.normalize().multiplyScalar(cameraOffset);
  controls.update();
  starship.update(0.1);
  camera.position.copy(direction.add(controls.target));
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
