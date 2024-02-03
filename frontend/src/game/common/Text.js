import { TextGeometry } from "../../threejs/geometries/TextGeometry.js";
import { FontLoader } from "../../threejs/loaders/FontLoader.js";
import * as THREE from "../../threejs/three.js";
import { GameObject } from "../GameObject.js";

const loader = new FontLoader();
let font;
loader.load("/src/threejs/fonts/optimer_regular.typeface.json", function ( response ) {
    font = response;
} );

export default class Text extends GameObject {
    constructor(params) {
        params = {
            color: 0xffffff,
            position: { x: 0, y: 0, z: 0 },
            text: "hello threejs",
            ...params,
        }
        const materials = [
            new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
        ];
        const geometry = new TextGeometry(params.text, {
            font,
            size: 0.1,
            height: 1,
            curveSegments: 100,

            bevelThickness: 1,
            bevelSize: 5,
            bevelEnabled: true
        });
        super(geometry, materials);
        this.position.set(params.position.x, params.position.y, params.position.z);
        this.rotation.x = 0;
        this.rotation.y = Math.PI * 2;
    }
}
