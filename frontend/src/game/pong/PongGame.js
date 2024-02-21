import * as THREE from '../../threejs/three.js';
import RectButton from '../common/RectButton.js';
import CircleButton from '../common/CircleButton.js';
import PointLight from '../common/PointLight.js';
import {NetworkScene} from '../Scene.js';
import Ball from './Ball.js';
import Player from './Player.js';
import Wall from './Wall.js';
import ScoreBoard from './ScoreBoard.js';
import {zaxis} from '../preset.js';
import Text from '../common/Text.js';
import Icon from '../common/Icon.js';
import LoadingCircle from '../common/LoadingCircle.js';
import Shutter from '../common/Shutter.js';
import {color2, color3, color4} from '../preset.js';

export default class PongGame extends NetworkScene {
  static STATE_MENU = 0;
  static STATE_WAIT = 1;
  static STATE_PONG = 2;
  static STATE_PONG_TOURNAMENT = 3;
  static STATE_END = 4;
  static SHUTTER_SIZE_SMALL = 0;
  static SHUTTER_SIZE_LARGE = 10;
  static SHUTTER_SIZE_HUGE = 15;
  static SHUTTER_HEIGHT = -15;
  constructor(width, height, token) {
    super(width, height);
    this.token = token;
    this.intraId = token; // TODO: get intraId in jwt token
    this.factory = {
      'player': Player,
      'wall': Wall,
      'ball': Ball,
      'rectButton': RectButton,
      'circleButton': CircleButton,
      'light': PointLight,
      'text': Text,
      'icon': Icon,
      'timer': LoadingCircle,
      'shutter': Shutter,
    };
    this.#initKeyEvent();
    this.shutter = null;
    this.selectedButton = null;
    this.scoreboards = {};
    this.raycaster = new THREE.Raycaster();
    this.infoCallbacks = [];
    this.alias = 'anonymous';
    this.loadMenu();
    this.setOnmessage('ready', this.#netReady.bind(this));
    this.setOnmessage('match', this.#netMatch.bind(this));
    this.setOnmessage('init', this.#netInit.bind(this));
    this.setOnmessage('update', this.#netUpdate.bind(this));
    this.setOnmessage('step', this.#netStep.bind(this));
    this.setOnmessage('sync', this.#netSync.bind(this));
    this.setOnmessage('score', this.#netScore.bind(this));
    this.setOnmessage('info', this.#netInfo.bind(this));
  }

  loadMenu() {
    this.state = PongGame.STATE_MENU;
    this.loadDefaultScene();
    const ready = (type) => {
      this.loadReady();
      this.waitQ(this.token, type, {alias: this.alias});
    };
    this.addGameObject(this.#createObject('rectButton', {
      position: {x: -7, y: 0, z: 0},
      size: {width: 12, height: 12},
      color: 'lightpink',
      icon: 'normal-game.png',
      buttonParam: 'pong',
      callback: ready,
    }));
    this.addGameObject(this.#createObject('rectButton', {
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
    this.addGameObjectTo(this.#createObject('shutter', {
      color: color2,
      size: PongGame.SHUTTER_SIZE_LARGE,
      position: {x: 0, y: 0, z: PongGame.SHUTTER_HEIGHT},
    }), this.cameraHolder);
  }

  loadReady() {
    this.state = PongGame.STATE_WAIT;
    this.loadDefaultScene();
    this.addGameObject(this.#createObject('circleButton', {
      position: {x: 0, y: 0, z: 0},
      color: color4,
      icon: 'back.png',
      size: {radius: 8},
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
    this.addGameObjectTo(this.#createObject('shutter', {
      color: color2,
      size: PongGame.SHUTTER_SIZE_LARGE,
      position: {x: 0, y: 0, z: PongGame.SHUTTER_HEIGHT},
    }), this.cameraHolder);
  }

  loadEndConfirm() {
    this.state = PongGame.STATE_END;
    this.loadDefaultScene();
    this.addGameObject(this.#createObject('circleButton', {
      position: {x: 0, y: 0, z: 0},
      color: color4,
      icon: 'exit.png',
      size: {radius: 8},
      callback: async () => {
        this.#netInfo({
          'type': 'info',
          'cause': 'end_game_confirm',
        });
        this.loadMenu();
      },
    }));
    this.addGameObject(this.#createObject('light', {
      position: {x: 0, y: 0, z: 20},
      intensity: 500,
    }));
    this.#addTrackingMouseLight();
    this.#addButtonEvents();
    this.addGameObjectTo(this.#createObject('shutter', {
      color: color2,
      size: PongGame.SHUTTER_SIZE_SMALL,
      position: {x: 0, y: 0, z: PongGame.SHUTTER_HEIGHT},
    }).setSize(PongGame.SHUTTER_SIZE_LARGE), this.cameraHolder);
  }

  subscribeInfo(callback) {
    this.infoCallbacks.push(callback);
  }

  unsubscribeInfo(callback) {
    this.infoCallbacks = this.infoCallbacks.filter((x) => x != callback);
  }

  unsubscribeInfoAll() {
    this.infoCallbacks = [];
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
    this.camera.getViewSize(this.cameraHolder.position.z, rect);
    const ratio = {
      x: screenX / this.currentWidth,
      y: screenY / this.currentHeight,
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
        .filter((x) => x instanceof RectButton || x instanceof CircleButton)[0];
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
    this.addGameObject(this.#createObject('timer', {
      color: color3,
      timer,
    }));
  }

  #netMatch(data) {
    const {status} = data;
    if (status === 'fail') this.loadReady();
    if (status === 'success') this.loadDefaultScene();
  }

  #netInit(data) {
    this.loadDefaultScene();
    this.cameraHolder.position.z = 30;

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

    // create scoreboard
    this.scoreboards = {};
    for (const player of data.players) {
      const unit = this.getNetworkObject(player.unit_id);
      this.scoreboards[player.intra_id] = new ScoreBoard({
        name: player.alias,
        score: 0,
        opacity: 0.5,
        position: {
          x: unit.position.x * 0.5,
          y: unit.position.y * 0.5,
          z: 0.1,
        },
      });
      this.addGameObject(this.scoreboards[player.intra_id]);
    }

    // rotate camera angle for player
    for (const player of data.players) {
      if (player.intra_id != this.intraId) continue;
      const unit = this.getNetworkObject(player.unit_id);
      const rawUnit = data.objects.filter((x) => x.id == unit.net.id)[0];
      const upside = (rawUnit.transform.rotation.y > 0 ? 1 : -1);
      const rad = Math.acos(rawUnit.transform.rotation.x) * upside;

      const angle = rad - Math.PI * 0.5;

      const {cameraHolder} = this;
      const {x, y} = unit.position;
      cameraHolder.position.set(x, y, cameraHolder.position.z);
      cameraHolder.setRotationFromAxisAngle(zaxis, angle);
      cameraHolder.rotateX(Math.PI / 12);

      // rotate scoreboards
      for (const intraId in this.scoreboards) {
        if (Object.hasOwn(this.scoreboards, intraId) == false) continue;
        const scoreboard = this.scoreboards[intraId];
        scoreboard.setRotationFromAxisAngle(zaxis, angle);
      }
    }

    this.shutter = this.#createObject('shutter', {
      color: color2,
      size: PongGame.SHUTTER_SIZE_SMALL,
      position: {x: 0, y: 0, z: PongGame.SHUTTER_HEIGHT},
    }).setSize(PongGame.SHUTTER_SIZE_HUGE);
    this.addGameObjectTo(this.shutter, this.cameraHolder);
    this.addGameObject(this.#createObject('light', {
      position: {x: 0, y: 0, z: 42},
      intensity: 100,
    }));
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
      this.#addTrackingMouseLight();
      this.shutter = this.#createObject('shutter', {
        color: color2,
        size: PongGame.SHUTTER_SIZE_LARGE,
        position: {x: 0, y: 0, z: PongGame.SHUTTER_HEIGHT},
      }).setSize(PongGame.SHUTTER_SIZE_SMALL);
      this.addGameObjectTo(this.shutter, this.cameraHolder);
    }
    if (data?.level === 'start round') {

    }
    if (data?.level === 'end round') {
      this.shutter.setSize(PongGame.SHUTTER_SIZE_SMALL);
    }
    if (data?.level === 'end game') {
      this.loadEndConfirm();
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
    for (const playerScore of score) {
      const scoreboard = this.scoreboards[playerScore.intra_id];
      scoreboard.updateScore(playerScore.score);
    }
  }

  #netInfo(data) {
    for (const cb of this.infoCallbacks) cb({...data});
  }

  #initKeyEvent() {
    this.key = {};
    window.addEventListener('keydown', (e) => this.key[e.key] = true);
    window.addEventListener('keyup', (e) => this.key[e.key] = false);
    window.addEventListener('keydown', (e) => {
      if (e.key != 'f') return;
      this.toggleFullScreen();
    });
    window.addEventListener('resize', (e) => {
      if (this.getRenderer()?.domElement == null) return;
      const elem = this.getRenderer().domElement;
      const isFullScreen = document.fullscreenElement == elem;
      this.currentWidth = isFullScreen ? window.innerWidth : this.width;
      this.currentHeight = isFullScreen ? window.innerHeight : this.height;
      this.camera.left = -(this.currentWidth / this.currentHeight);
      this.camera.right = this.currentWidth / this.currentHeight;
      this.camera.updateProjectionMatrix();
      this.getRenderer().setSize(this.currentWidth, this.currentHeight);
      if (this.composer != null) {
        this.composer.setSize(this.currentWidth, this.currentHeight);
      }
    });
    const action = {move: 0};
    this.addRenderHook(() => {
      const pos = this.key['ArrowLeft'] || this.key['a'] ? 1 : 0;
      const neg = this.key['ArrowRight'] || this.key['d'] ? -1 : 0;
      const move = pos + neg;

      if (this.socket == null) return;
      if (action.move != move && this.socket.readyState == this.socket.OPEN) {
        action.move = move;
        this.send({type: 'move', data: action});
      }
    });
  }

  toggleFullScreen() {
    const elem = this.getRenderer()?.domElement;
    if (elem == null) return;
    if (document.fullscreenElement == null) elem.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  }

  setAlias(alias) {
    this.alias = alias;
  }
}
