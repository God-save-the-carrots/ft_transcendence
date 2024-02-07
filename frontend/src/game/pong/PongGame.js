import * as THREE from '../../threejs/three.js';
import Button from '../common/Button.js';
import PointLight from '../common/PointLight.js';
import {NetworkScene} from '../Scene.js';
import Ball from './Ball.js';
import Player from './Player.js';
import Wall from './Wall.js';
import {zaxis} from '../preset.js';
import Text from '../common/Text.js';
import Icon from '../common/Icon.js';
import LoadingCircle from '../common/LoadingCircle.js';

export default class PongGame extends NetworkScene {
  static STATE_MENU = 0;
  static STATE_WAIT = 1;
  static STATE_PONG = 2;
  static STATE_PONG_TOURNAMENT = 3;
  constructor(width, height, token) {
    super(width, height);
    this.token = token;
    this.intraId = token; // TODO: get intraId in jwt token
    this.factory = {
      'player': Player,
      'wall': Wall,
      'ball': Ball,
      'button': Button,
      'light': PointLight,
      'text': Text,
      'icon': Icon,
      'timer': LoadingCircle,
    };
    this.#initKeyEvent();
    this.selectedButton = null;
    this.raycaster = new THREE.Raycaster();
    this.loadMenu();
    this.setOnmessage('ready', this.#netReady.bind(this));
    this.setOnmessage('match', this.#netMatch.bind(this));
    this.setOnmessage('init', this.#netInit.bind(this));
    this.setOnmessage('update', this.#netUpdate.bind(this));
    this.setOnmessage('step', this.#netStep.bind(this));
    this.setOnmessage('sync', this.#netSync.bind(this));
    this.setOnmessage('score', this.#netScore.bind(this));
  }

  loadMenu() {
    this.state = PongGame.STATE_MENU;
    this.loadDefaultScene();
    const ready = (type) => {
      this.loadReady();
      this.waitQ(this.token, type);
    };
    this.addGameObject(this.#createObject('button', {
      position: {x: -7, y: 0, z: 0},
      size: {width: 12, height: 12},
      color: 'lightpink',
      icon: 'normal-game.png',
      buttonParam: 'pong',
      callback: ready,
    }));
    this.addGameObject(this.#createObject('button', {
      position: {x: 7, y: 0, z: 0},
      size: {width: 12, height: 12},
      color: 'skyblue',
      icon: 'tournament.png',
      buttonParam: 'pong_4',
      callback: ready,
    }));
    this.addGameObject(this.#createObject('light', {
      position: {x: 0, y: 0, z: 20},
      intensity: 500,
    }));
    this.#addTrackingMouseLight();
    this.#addButtonEvents();
  }

  loadReady() {
    this.state = PongGame.STATE_WAIT;
    this.loadDefaultScene();
    this.addGameObject(this.#createObject('button', {
      position: {x: 0, y: 0, z: 0},
      color: 'gray',
      icon: 'close.png',
      size: {width: 12, height: 12},
      callback: async () => {
        const success = await this.cancelWaitQ();
        if (success) this.loadMenu();
      },
    }));
    this.addGameObject(this.#createObject('light', {
      position: {x: 0, y: 0, z: 20},
      intensity: 500,
    }));
    this.#addTrackingMouseLight();
    this.#addButtonEvents();
  }

  #addTrackingMouseLight() {
    const light = this.addGameObject(this.#createObject('light', {
      position: {x: 0, y: 0, z: 50},
      intensity: 1000,
    }));
    this.addDomEventListener('mousemove', (e) => {
      const pos = this.#getMouseWorldPosition(e.offsetX, e.offsetY);
      light.position.set(pos.x, pos.y, light.position.z);
    });
  }

  #addButtonEvents() {
    this.addDomEventListener('mousemove', (e) => {
      if (this.selectedButton) this.selectedButton.hover(false);
      this.selectedButton = this.#selectButton(e.offsetX, e.offsetY);
      if (this.selectedButton) this.selectedButton.hover(true);
    });
    this.addDomEventListener('click', (_) => {
      if (this.selectedButton != null) this.selectedButton.invoke();
    });
  }

  #getMouseWorldPosition(screenX, screenY) {
    const rect = new THREE.Vector2();
    this.camera.getViewSize(this.camera.position.z, rect);
    const ratio = {
      x: screenX / this.renderer.domElement.width,
      y: screenY / this.renderer.domElement.height,
    };
    return new THREE.Vector2(
        ratio.x * rect.x - rect.x * .5,
        ratio.y * -rect.y + rect.y * .5,
    );
  }

  #selectButton(screenX, screenY) {
    const mouse = new THREE.Vector2();
    mouse.x = (screenX / this.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(screenY / this.renderer.domElement.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(mouse, this.camera);

    return this.raycaster
        .intersectObjects(this.children, false)
        .map((x) => x.object)
        .filter((x) => x instanceof Button)[0];
  }

  #createObject(type, params) {
    if (this.factory[type] == null) {
      const error = 'receive unknown tag object';
      throw new Error(error);
    }
    return new this.factory[type](params);
  }

  #netReady(data) {
    const {timer} = data;
    this.addGameObject(this.#createObject('timer', {timer}));
  }

  #netMatch(data) {
    const {status} = data;
    if (status === 'fail') this.loadReady();
    if (status === 'success') this.loadDefaultScene(); // TODO:
  }

  #netInit(data) {
    this.loadDefaultScene();

    // create objects
    for (const rawObject of data.objects) {
      let mesh = null;
      const net = {id: rawObject.id, tag: rawObject.tag, type: rawObject.type};
      if (net.tag == 'player') mesh = new Player(net, rawObject.transform);
      if (net.tag == 'wall') mesh = new Wall(net, rawObject.transform);
      if (net.tag == 'ball') mesh = new Ball(net, rawObject.transform);
      if (mesh == null) throw new Error('receive unknown tag object');
      this.addGameObject(mesh);
    }

    // rotate camera angle for player
    for (const player of data.players) {
      if (player.intra_id != this.intraId) continue;
      const unit = this.getNetworkObject(player.unit_id);
      const rawUnit = data.objects.filter((x) => x.id == unit.net.id)[0];
      const upside = (rawUnit.transform.rotation.y > 0 ? 1 : -1);
      const rad = Math.acos(rawUnit.transform.rotation.x) * upside;
      const {camera} = this;
      camera.position.set(unit.position.x, unit.position.y, camera.position.z);
      camera.setRotationFromAxisAngle(zaxis, rad - Math.PI * 0.5);
      camera.rotateX(Math.PI / 12);
    }
  }

  #netUpdate(data) {
    for (const i in data.changed) {
      if (Object.hasOwn(data.changed, i) == false) continue;
      const item = data.changed[i];
      const mesh = this.getNetworkObject(item.id);
      if (item.to != null) mesh.to = {...mesh.to, ...item.to};
      if (item.acc != null) mesh.acc = {...mesh.acc, ...item.acc};
    }
    if (data.debug.detected_wall_id != null) {
      const touchedWall = this.getNetworkObject(data.debug.detected_wall_id);
      touchedWall.material.color.b = 1;
      touchedWall.material.color.g = 1;
    }
  }

  #netStep(data) {
    if (data?.level === 'start game') {
      this.loadDefaultScene();
    }
    if (data?.level === 'start round') {

    }
    if (data?.level === 'end round') {

    }
    if (data?.level === 'end game') {
      this.loadMenu();
    }
  }

  #netSync(data) {
    for (const ob of data.objects) {
      const obj = this.networkObjects.get(ob.id);
      obj.position.x = ob.transform.position.x;
      obj.position.y = ob.transform.position.y;
      obj.transformTo({
        position: {x: obj.position.x, y: obj.position.y},
      });
    }
  }

  #netScore(data) {
    const {score} = data;
    console.log(score);
  }

  #initKeyEvent() {
    this.key = {};
    window.addEventListener('keydown', (e) => this.key[e.key] = true);
    window.addEventListener('keyup', (e) => this.key[e.key] = false);
    const action = {move: 0};
    this.addRenderHook(() => {
      const pos = this.key['ArrowLeft'] || this.key['a'] ? 1 : 0;
      const neg = this.key['ArrowRight'] || this.key['d'] ? -1 : 0;
      const move = pos + neg;

      if (action.move != move && this.socket.readyState == this.socket.OPEN) {
        action.move = move;
        if (this.socket.readyState == this.socket.OPEN) {
          this.send({type: 'move', data: action});
        }
      }
    });
  }
}
