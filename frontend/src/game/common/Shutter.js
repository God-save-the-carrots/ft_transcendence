import * as THREE from '../../threejs/three.js';
import {GameObject} from '../GameObject.js';

export default class Shutter extends GameObject {
  constructor(params) {
    params = {
      size: 10,
      count: 6,
      color: 'gray',
      position: {x: 0, y: 0, z: 0},
      ...params,
    };
    super(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial());
    this.position.set(params.position.x, params.position.y, params.position.z);
    this.size = params.size;
    this.items = [];

    const rectSize = 10000;
    const count = params.count;
    for (let i = 0; i < count; i++) {
      const angle = ((Math.PI * 2) / count) * i;
      const geometry = new THREE.PlaneGeometry(rectSize, rectSize);
      const material = new THREE.MeshPhongMaterial({
        color: params.color,
        side: THREE.DoubleSide,
      });
      const rect = new THREE.Mesh(geometry, material);
      rect.position.set(Math.sin(angle) * rectSize * 0.5, Math.cos(angle) * rectSize * 0.5, 0);
      const axis = new THREE.Vector3(rect.position.x, rect.position.y, rect.position.z).normalize();
      rect.rotateOnAxis(axis, Math.PI / count * .75);
      rect.rotateOnAxis(new THREE.Vector3(0, 0, 1), -angle);
      const object = new THREE.Object3D();
      object.add(rect);
      const {x, y} = {x: Math.sin(angle), y: Math.cos(angle)};
      object.normalPosition = {x, y};
      object.position.set(x * this.size, y * this.size);
      this.add(object);
      this.items.push(object);
    }

    window.test = this;
  }

  update() {
    for (const item of this.items) {
      const {normalPosition} = item;
      item.position.x = item.position.x * 0.8 + normalPosition.x * this.size * 0.2;
      item.position.y = item.position.y * 0.8 + normalPosition.y * this.size * 0.2;
    }
  }

  setSize(size) {
    this.size = size;
    return this;
  }
}
