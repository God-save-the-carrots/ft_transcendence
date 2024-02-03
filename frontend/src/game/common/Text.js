import * as THREE from "../../threejs/three.js";
import { TextGeometry } from "../../threejs/geometries/TextGeometry.js";
import { FontLoader } from "../../threejs/loaders/FontLoader.js";
import { GameObject } from "../GameObject.js";

const loader = new FontLoader();
let initload = false;
let font = null;

export default class Text extends GameObject {
    constructor(params) {
        params = {
            color: 0xffffff,
            position: { x: 0, y: 0, z: 0 },
            text: "hello threejs",
            refreshCallback: () => {},
            ...params,
        }
        super(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial());
        this.params = params;
        this.position.set(params.position.x, params.position.y, params.position.z)

        this.firstFrame = false;
        if (font) this.refresh();
        this.loadfont();
    }

    loadfont() {
        if (initload) return;
        initload = true;
        loader.load("/src/threejs/fonts/optimer_regular.typeface.json", x => {
            font = x;
        });
    }
    update() {
        if (font == null || this.firstFrame) return;
        this.refresh();
        this.firstFrame = true;
    }
    refresh() {
        if (this.textObject) {
            this.remove(this.textObject);
        }
        this.textObject = this.createText(this.params);
        this.add(this.textObject);
        this.params.refreshCallback(this.textObject.geometry.boundingBox);
    }
    createText(params) {
        const materials = [
            new THREE.MeshPhongMaterial( { color: params.color, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: params.color } ) // side
        ];
        const geometry = new TextGeometry(params.text, {
            font,
            size: 5,
            height: 0.1,
            curveSegments: 4,
            bevelThickness: 0.1,
            bevelSize: 0.2,
            bevelEnabled: true
        });
        geometry.computeBoundingBox();
        const mesh = new THREE.Mesh(geometry, materials)
        const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        const height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
        mesh.position.set(-width*0.5, -height*0.5, 0);
        return mesh;
    }
}
