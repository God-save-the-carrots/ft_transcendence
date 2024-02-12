import * as THREE from '../../threejs/three.js';
import {TextGeometry} from '../../threejs/geometries/TextGeometry.js';

export default class Scoreboard extends THREE.Object3D {
  constructor(data, font) {
      super();
      this.font = font;
      this.players = {};

      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      data.forEach((player, index) => {
          const nameGeom = new TextGeometry(player.intra_id, {
              font: this.font,
              size: 2,
              height: 0.1,
          });
          const nameMesh = new THREE.Mesh(nameGeom, material);
          nameMesh.position.set(index * 15, 5, 0);
          this.add(nameMesh);

          const scoreGeom = new TextGeometry('0', {
              font: this.font,
              size: 2,
              height: 0.1,
          });
          const scoreMesh = new THREE.Mesh(scoreGeom, material);
          scoreMesh.position.set(index * 15, 0, 0);
          this.add(scoreMesh);

          this.players[player.unit_id] = {
              nameMesh: nameMesh,
              scoreMesh: scoreMesh,
              score: 0,
          };
      });
      this.position.set(-10, 20, 0);
  }

  update() {}

  updateScore(data) {
    for (const update_data of data) {
        const player = this.players[update_data.unit_id];
        if (player === undefined) continue;
        if (player.score == update_data.score) continue;
        player.score = update_data.score;
        const newScoreGeom = new TextGeometry(`${update_data.score}`, {
            font: this.font,
            size: 2,
            height: 0.1,
        });
        player.scoreMesh.geometry.dispose();
        player.scoreMesh.geometry = newScoreGeom;
    }
  }
}