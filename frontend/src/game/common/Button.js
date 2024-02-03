import * as THREE from "../../threejs/three.js";
import { GameObject } from "../GameObject.js";

export default class Button extends GameObject {
    constructor(params) {
        params = {
            color: 0xff0000,
            ...params,
        }
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshPhongMaterial({ color: params.color });
        super(geometry, material, params);

        this.callback = params.callback;
    }

    update() {
    }

    invoke() {
        if (this.callback != null) this.callback();
    }
};
