import * as THREE from '../../threejs/three.js';
import {GameObject} from '../GameObject.js';

export default class PointLight extends GameObject {
  constructor(params) {
    params = {
      color: 0xffffff,
      intensity: 100,
      distance: 0,
      position: {x: 0, y: 0, z: 0},
      ...params,
    };
    super(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial());
    this.position.set(params.position.x, params.position.y, params.position.z);

    const {color, intensity, distance} = params;
    this.add(new THREE.PointLight(color, intensity, distance));
  }
}
