import * as THREE from '../../threejs/three.js';
import {FontLoader} from '../../threejs/loaders/FontLoader.js';
import {GameObject} from '../GameObject.js';

const loader = new FontLoader();

export default class Text extends GameObject {
  constructor(params) {
    params = {
      color: 0xffffff,
      position: {x: 0, y: 0, z: 0},
      text: 'hello threejs',
      refreshCallback: () => {},
      ...params,
    };
    super(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial());
    this.params = params;
    this.position.set(params.position.x, params.position.y, params.position.z);

    const fontPath = '/src/threejs/fonts/helvetiker_regular.typeface.json';
    loader.load(fontPath, (font) => {
      this.font = font;
      this.setText(this.params.text);
    });
    this.font = null;
  }

  createText(params, font) {
    const materials = new THREE.MeshPhongMaterial({color: 0xffffff});
    const shapes = font.generateShapes(params.text, 7);
    const geometry = new THREE.ShapeGeometry( shapes );
    geometry.computeBoundingBox();
    const mesh = new THREE.Mesh(geometry, materials);
    const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    const height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
    mesh.position.set(-width*0.5, -height*0.5, 0);
    return mesh;
  }

  setText(text) {
    this.params.text = text;
    if (this.font == null) return;
    if (this.textObject != null) this.remove(this.textObject);
    this.textObject = this.createText(this.params, this.font);
    this.add(this.textObject);
    this.params.refreshCallback(this.textObject.geometry.boundingBox);
  }
}
