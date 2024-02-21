import * as THREE from '../threejs/three.js';
import {NetworkObject} from './GameObject.js';

import {EffectComposer} from '../threejs/postprocessing/EffectComposer.js';
import {RenderPass} from '../threejs/postprocessing/RenderPass.js';
import {UnrealBloomPass} from '../threejs/postprocessing/UnrealBloomPass.js';
import {OutputPass} from '../threejs/postprocessing/OutputPass.js';
import {color1} from "../game/preset.js";

const url = `ws://${window.location.hostname}:4444`;

export class Scene extends THREE.Scene {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
    /**
     * key is threejs uuid
     * @type {Map<String, Object3D>}
     */
    this.objects = new Map();
    /**
     * key is serverside id
     * @type {Map<String, NetworkObject>}
     */
    this.networkObjects = new Map();

    // set backgound color
    this.background = new THREE.Color('lightblue');

    // for delta time
    this.clock = new THREE.Clock();

    // external event
    this.domEvents = {};
    this.renderHooks = [];
    this.renderHandleEvent = 0;
    this.renderer = new THREE.WebGLRenderer();

    this.composer = new EffectComposer(this.renderer);

    const renderScene = new RenderPass(this, this.camera);
    this.composer.addPass(renderScene);

    const screenVector = new THREE.Vector2(width, height);
    const bloomPass = new UnrealBloomPass(screenVector, 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 0;
    bloomPass.radius = 0;
    this.composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);

    this.composer.setSize(width, height);
  }

  loadDefaultScene() {
    // delete old objects
    const deleteList = [];
    this.traverse((x) => deleteList.push(x));
    deleteList.forEach((x) => this.remove(x));
    this.objects = new Map();
    this.networkObjects = new Map();

    // delete old events
    this.removeAllDomEventListener();

    // init render camera
    const aspect = this.width / this.height;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.composer.passes[0].camera = this.camera;
    this.cameraHolder = new THREE.Object3D();
    this.cameraHolder.position.z = 42;
    this.cameraHolder.add(this.camera);
    this.add(this.cameraHolder);

    // add background
    const background = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshPhongMaterial({color: color1}),
    );
    background.receiveShadow = true;
    background.castShadow = true;
    background.position.set(0, 0, -1);
    this.add(background);

    // add ambient light
    this.ambient = new THREE.AmbientLight(0xffffff, 0.2);
    this.add(this.ambient);
    this.#startAnimate();
  }

  #startAnimate() {
    cancelAnimationFrame(this.renderHandleEvent);
    const scene = this;
    function animate() {
      scene.renderHandleEvent = requestAnimationFrame(animate);
      scene.render();
    }
    animate();
  }

  getRenderer() {
    return this.renderer;
  }

  getCanvas() {
    return this.renderer.domElement;
  }

  render() {
    if (this.composer) this.composer.render();
    else this.renderer.render(this, this.camera);
    const delta = this.clock.getDelta();

    this.update(delta);
    this.objects.forEach((obj) => obj.update(delta));
    this.renderHooks.forEach((hook) => hook());
  }

  update(delta) { }

  addRenderHook(hook) {
    this.renderHooks.push(hook);
  }

  addGameObject(gameObject) {
    if (gameObject == null) throw new Error('gameObject is null');
    if (gameObject instanceof NetworkObject) {
      this.networkObjects.set(gameObject.net.id, gameObject);
    }
    this.objects.set(gameObject.uuid, gameObject);
    this.add(gameObject);
    return gameObject;
  }

  addGameObjectTo(gameObject, parent) {
    if (gameObject == null) throw new Error('gameObject is null');
    if (gameObject instanceof NetworkObject) {
      this.networkObjects.set(gameObject.net.id, gameObject);
    }
    this.objects.set(gameObject.uuid, gameObject);
    parent.add(gameObject);
    return gameObject;
  }

  getNetworkObject(id) {
    return this.networkObjects.get(id);
  }

  static cleanMaterial(material) {
    if (material.map) material.map.dispose();
    if (material.lightMap) material.lightMap.dispose();
    if (material.bumpMap) material.bumpMap.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.specularMap) material.specularMap.dispose();
    if (material.envMap) material.envMap.dispose();
    material.dispose();
  }

  destroyRenderer() {
    cancelAnimationFrame(this.renderHandleEvent);
    this.traverse(function(object) {
      if (object.isMesh) {
        object.geometry.dispose();
        if (object.material.isMaterial) {
          Scene.cleanMaterial(object.material);
        } else if (Array.isArray(object.material)) {
          object.material.forEach(Scene.cleanMaterial);
        }
      }
    });
    this.objects = new Map();
    this.networkObjects = new Map();
    this.renderer.dispose();
    delete this.renderer;
  }

  destroy() {
    this.destroyRenderer();
  }

  addDomEventListener(type, callback) {
    if (this.domEvents[type] == null) {
      const domEvent = {
        delegator: (e) => domEvent.events.forEach((func) => func(e)),
        events: [],
      };
      this.domEvents[type] = domEvent;
      this.renderer.domElement.addEventListener(type, domEvent.delegator);
    }
    this.domEvents[type].events.push(callback);
  }

  removeAllDomEventListener() {
    for (const type in this.domEvents) {
      if (Object.hasOwn(this.domEvents, type) == false) continue;
      const delegator = this.domEvents[type].delegator;
      this.renderer.domElement.removeEventListener(type, delegator);
      delete this.domEvents[type];
    }
  }
};

export class NetworkScene extends Scene {
  constructor(width, height) {
    super(width, height);
    /**
         * @type {WebSocket}
         */
    this.socket = null;
    this.waitingServer = false;
    this.onmessages = {};
  }

  /**
   * 소켓을 열고 대기큐 등록.
   * @param {string} authToken
   * @param {string} gameType
   * @param {Object} data
   * @return {boolean} 대기큐 등록 성공 여부 (인증 포함)
   */
  async waitQ(authToken, gameType, data) {
    if (this.waitingServer) {
      console.log('block double waiting');
      return false;
    }
    try {
      this.waitingServer = true;
      if (this.socket == null || this.socket.CLOSED) {
        this.socket = new WebSocket(url);
        this.#initSocketEvent();
      }
      await this.#waitConnectServer(authToken, gameType, data);
    } catch (e) {
      console.error(e);
      return false;
    } finally {
      this.#initSocketEvent();
      this.waitingServer = false;
    }
    return true;
  }

  #waitConnectServer(authToken, gameType, data) {
    return new Promise((res, rej) => {
      this.socket.onerror = (e) => {
        this.socket.close();
        rej(e);
      };
      this.socket.onopen = (e) => {
        this.socket.send(JSON.stringify({
          type: 'auth',
          token: authToken,
          game: gameType,
          data,
        }));
      };
      this.socket.onmessage = (e) => {
        this.onmessage(e);
        const data = JSON.parse(e.data);
        if (data.type !== 'auth' || data.status !== 'success') {
          this.socket.close();
          rej(new Error('error: server bad response'));
          return;
        }
        res();
      };
    });
  }

  cancelWaitQ() {
    return new Promise((res, rej) => {
      if (this.socket == null || this.socket.readyState != this.socket.OPEN) {
        res(true);
        return;
      }
      if (this.waitingServer) {
        res(false); // 인증 중이라면 대기 큐를 취소할 수 없음
        return;
      }
      this.socket.send(JSON.stringify({
        type: 'close',
      }));
      this.socket.onmessage = (e) => {
        this.onmessage(e);
        const data = JSON.parse(e.data);
        if (data.status === 'success') this.socket.close();
        this.#initSocketEvent();
        res(data.status === 'success');
      };
    });
  }

  #initSocketEvent() {
    this.socket.onmessage = this.onmessage.bind(this);
    this.socket.onopen = null;
    this.socket.onerror = null;
  }

  onmessage(e) {
    const data = JSON.parse(e.data);
    if (data?.type == null) return;
    const func = this.onmessages[data.type];
    if (func != null) func(data);
  }

  setOnmessage(type, callback) {
    this.onmessages[type] = callback;
  }

  send(data) {
    if (this.socket == null || this.socket.readyState == false) {
      throw new Error('socket not open');
    }
    this.socket.send(JSON.stringify(data));
  }

  destroy() {
    super.destroy();
    try {
      this.socket.close();
    } catch (e) {}
  }
}
