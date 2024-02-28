import * as THREE from '../../threejs/three.js';
import {GameObject} from '../GameObject.js';
import Text from './Text.js';
import Icon from './Icon.js';

export default class CircleButton extends GameObject {
  constructor(params) {
    params = {
      color: 0xff0000,
      segments: 100,
      size: {radius: 8},
      buttonParam: null,
      ...params,
    };
    const geometry = new THREE.CircleGeometry(params.size.radius, params.segments);
    const material = new THREE.MeshPhongMaterial({
      color: params.color,
      transparent: true,
      opacity: 0,
    });
    super(geometry, material, params);

    if (params.icon) {
      this.icon = new Icon({
        position: {x: 0, y: 0, z: 2},
        size: {width: params.size.radius * 2, height: params.size.radius * 2},
        path: params.icon,
      });
      this.add(this.icon);
    }

    this.callback = params.callback;
    this.buttonParam = params.buttonParam;

    this.hoverPosition = 0;
    this.lastInvokeTime = new Date();
  }

  update() {
    if (this.icon) this.icon.update();
    const DENSE = 0.2;
    const z = this.position.z * (1 - DENSE) + this.hoverPosition * DENSE;
    this.position.set(this.position.x, this.position.y, z);
  }

  invoke() {
    if (this.callback == null) return;
    const current = new Date();
    if (current - this.lastInvokeTime > 200) { // 0.2 sec
      this.callback(this.buttonParam);
      this.lastInvokeTime = current;
    }
  }

  hover(active) {
    this.hoverPosition = active ? 2 : 0;
  }
};
