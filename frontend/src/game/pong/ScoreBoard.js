import * as THREE from '../../threejs/three.js';
import { GameObject } from '../GameObject.js';
import Text from '../common/Text.js';

export default class Scoreboard extends GameObject {
  constructor(params) {
    params = {
      position: {x: 0, y: 0, z: 0},
      color: 'white',
      opacity: 1.0,
      name: '',
      score: 0,
      ...params,
    }

    super(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial());
    this.position.set(params.position.x, params.position.y, params.position.z);
    this.nameText = new Text({text: params.name, opacity: params.opacity});
    this.scoreText = new Text({text: params.score, opacity: params.opacity});
    this.scoreText.position.set(0, -10, 0);
    
    const group = new THREE.Group();
    group.add(this.nameText);
    group.add(this.scoreText);
    group.scale.set(0.2, 0.2, 0.2);
    this.add(group);
  }

  updateScore(score) {
    this.scoreText.setText(String(score));
  }
}
