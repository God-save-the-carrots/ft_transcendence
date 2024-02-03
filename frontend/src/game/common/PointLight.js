import * as THREE from "../../three.js";

export default class Button extends THREE.PointLight {
    constructor(params) {
        params = {
            color: 0xffffff,
            intensity: 100,
            distance: 0,
            position: { x: 0, y: 0, z: 0 },
            ...params,
        }
        super(params.color, params.intensity, params.distance);
        this.position.set(params.position.x, params.position.y, params.position.z);
    }

    update() {
    }
}
