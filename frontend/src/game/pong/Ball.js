import * as THREE from '../../threejs/three.js';
import {NetworkObject} from '../GameObject.js';

export default class Ball extends NetworkObject {
  /**
   * @param {{id, tag, type}} net
   * @param {Object} params
   */
  constructor(net, params) {
    params = {
      scale: {x: 1, y: 1},
      color: 0xff0000,
      ...params,
    };
    const geometry = new THREE.SphereGeometry(params.scale.x * 0.5);
    const material = new THREE.MeshPhongMaterial({color: params.color});
    super(geometry, material, params, net);

    this.castShadow = true;
    this.receiveShadow = true;

    this.#addLight();

    this.transformTo(params);
  }

  #addLight() {
    const light = new THREE.PointLight(0xffffff, 200);
    light.position.set(0, 0, 10);
    light.castShadow = true;
    light.shadow.normalBias = 0.2;
    this.add(light);
  }
};
