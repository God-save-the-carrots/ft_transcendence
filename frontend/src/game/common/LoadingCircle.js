import * as THREE from '../../threejs/three.js';
import {GameObject} from '../GameObject.js';

export default class LoadingCircle extends GameObject {
  constructor(params) {
    params = {
      color: 0xffffff,
      timer: 0,
      ...params,
    };
    const geometry = new THREE.TorusGeometry( 15, 1, 3, 100 );
    const material = new THREE.MeshPhongMaterial({color: params.color});
    super(geometry, material);

    this.updateCircle(0);
    this.timer = params.timer;
    this.current = 0;
  }

  update(delta) {
    this.current += delta;
    this.current = Math.min(this.current, this.timer);
    this.updateCircle(this.current / this.timer);
  }

  updateCircle(percent = 0) { // 0 ~ 1
    if (this.circle) this.remove(this.circle);
    const angle = Math.PI * 2 * percent;
    const geometry = new THREE.CircleGeometry(15, 100, Math.PI * 0.5, angle);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
    });
    this.circle = new THREE.Mesh(geometry, material);
    this.add(this.circle);
  }
}
