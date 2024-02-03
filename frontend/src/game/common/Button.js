import * as THREE from "../../threejs/three.js";
import { GameObject } from "../GameObject.js";
import Text from "./Text.js";
import Icon from "./Icon.js"

export default class Button extends GameObject {
    constructor(params) {
        params = {
            color: 0xff0000,
            textColor: 0xffffff,
            size: { width: 10, height: 10 },
            buttonParam: null,
            ...params,
        }
        const geometry = new THREE.BoxGeometry(params.size.width, params.size.height, 2);
        const material = new THREE.MeshPhongMaterial({ color: params.color });
        super(geometry, material, params);

        if (params.text) {
            this.text = new Text({
                position: { x: 0, y: 0, z: 1 },
                text: params.text,
                color: params.textColor,
                refreshCallback: this.resize.bind(this),
            });
            this.add(this.text);
        }
        if (params.icon) {
            this.icon = new Icon({
                position: { x: 0, y: 0, z: 2 },
                size: { width: params.size.width - 2, height: params.size.height - 2 },
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
        if (this.text) this.text.update();
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

    resize(size) {
        const {min, max} = size;
        const targetWidth = max.x - min.x;
        if (this.geometry.parameters.width < targetWidth) {
            this.geometry.dispose();
            this.geometry = new THREE.BoxGeometry(targetWidth + 5, 10, 2);
        }
    }

    hover(active) {
        this.hoverPosition = active ? 2 : 0;
    }
};
