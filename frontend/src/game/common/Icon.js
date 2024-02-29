import * as THREE from '../../threejs/three.js';
import {GameObject} from '../GameObject.js';

const textureMap = {};

export default class Icon extends GameObject {
  constructor(params) {
    params = {
      size: {width: 10, height: 10},
      ...params,
    };
    const textureLoader = new THREE.TextureLoader();
    const texture = textureMap[params.path] ??
            textureLoader.load(`/public/assets/${params.path}`);
    textureMap[params.path] = texture;
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
    });
    const {width, height} = params.size;
    const geometry = new THREE.PlaneGeometry(width, height);
    super(geometry, material, params);
  }
}
