import * as THREE from "../../threejs/three.js";
import { GameObject } from "../GameObject.js";
import Text from "./Text.js";

export default class Button extends GameObject {
    constructor(params) {
        params = {
            color: 0xff0000,
            textColor: 0xffffff,
            text: "",
            width: 10,
            ...params,
        }
        const geometry = new THREE.BoxGeometry(params.width, 10, 2);
        const material = new THREE.MeshPhongMaterial({ color: params.color });
        super(geometry, material, params);

        this.text = new Text({
            position: { x: 0, y: 0, z: 1 },
            text: params.text,
            color: params.textColor,
            refreshCallback: this.resize.bind(this),
        });;
        this.add(this.text);
        this.callback = params.callback;

        this.hoverPosition = 0;
        this.lastInvokeTime = new Date();
    }

    update() {
        this.text.update();
        const DENSE = 0.2;
        const z = this.position.z * (1 - DENSE) + this.hoverPosition * DENSE;
        this.position.set(this.position.x, this.position.y, z);
    }

    invoke() {
        if (this.callback == null) return;
        const current = new Date();
        if (current - this.lastInvokeTime > 200) { // 0.2 sec
            this.callback();
            this.lastInvokeTime = current;
        }
    }

    resize(size) {
        const {min, max} = size;
        const targetWidth = max.x - min.x;
        if (this.geometry.parameters.width < targetWidth) {
            this.geometry.dispose();
            this.geometry = new THREE.BoxGeometry(targetWidth + 5, 10, 2);
        }
    }

    hover(active) {
        this.hoverPosition = active ? 1 : 0;
    }
};
