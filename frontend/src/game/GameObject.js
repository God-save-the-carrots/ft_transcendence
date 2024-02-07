import * as THREE from "../threejs/three.js";
import { zaxis } from "./preset.js";

export class GameObject extends THREE.Mesh {
  constructor(geometry, material, params) {
    super(geometry, material);

        if (params == null) return;
        const { position, rotation, color } = params;
        if (position != null) {
            this.position.x = position.x;
            this.position.y = position.y;
            this.position.z = position.z;
        }
        if (rotation != null) {
            const rad = Math.acos(rotation.x) * (rotation.y > 0 ? 1 : -1);
            this.setRotationFromAxisAngle(zaxis, rad + Math.PI * 0.5)
            this.position.set(position.x, position.y, 0);
        }
        if (color != null) {
            this.material.color.set(color)
        }
    }
    if (rotation != null) {
      const rad = Math.acos(rotation.x) * (rotation.y > 0 ? 1 : -1);
      this.setRotationFromAxisAngle(zaxis, rad + Math.PI * 0.5);
      this.position.set(position.x, position.y, 0);
    }
    if (color != null) {
      this.material.color.set(color);
    }
  }

  update(delta) { }
};

export class NetworkObject extends GameObject {

    /**
     * @param {{id, tag, type}} net
     */
  constructor(geometry, material, params, net) {
    super(geometry, material, params);

    /**
         * @type {TransformValue}
         */
    this.to = {
      position: {x: 0, y: 0},
      rotation: {x: 0, y: 0},
      scale: {x: 0, y: 0},
      color: {r: 0, g: 0, b: 0},
    };
    /**
        * @type {{
        *  position:{x:number,y:number}
        * }}
        */
    this.acc = {
      position: {x: 0, y: 0},
    };

    this.dense = 0.35;
    this.net = net;
  }

  /**
     * @param {number} delta
     */
  update(delta) {
    this.to.position.x += this.acc.position.x * delta;
    this.to.position.y += this.acc.position.y * delta;

    this.position.x = this.position.x * (1 - this.dense) +
                      this.to.position.x * this.dense;
    this.position.y = this.position.y * (1 - this.dense) +
                      this.to.position.y * this.dense;

    // TODO: change to this.to.color
    if (this.material.color.b > 0) this.material.color.b -= 1 / 60;
    if (this.material.color.g > 0) this.material.color.g -= 1 / 60;
  }

  /**
     * @param {TransformValue} value
     */
  transformTo(value) {
    Object.keys(value)
        .filter((key) => this.to[key] != null)
        .forEach((key) => this.to[key] = value[key]);
  }
};
