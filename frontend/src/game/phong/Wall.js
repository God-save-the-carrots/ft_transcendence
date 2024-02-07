import * as THREE from "../../threejs/three.js";
import { NetworkObject } from "../GameObject.js";

export default class Wall extends NetworkObject {
    /**
     * @param {{id, tag, type}} net
     */
    constructor(net, params) {
        params = {
            scale: {x: 1, y: 1},
            color: 0xff0000,
            rotation: {x: 0, y: 1},
            position: {x: 0, y: 0},
            ...params,
        }
        const geometry = new THREE.BoxGeometry(params.scale.x, params.scale.y, 1);
        const material = new THREE.MeshPhongMaterial({ color: params.color });
        super(geometry, material, params, net);

        this.castShadow = true;
        this.receiveShadow = true;

        this.transformTo(params);
    }
};
