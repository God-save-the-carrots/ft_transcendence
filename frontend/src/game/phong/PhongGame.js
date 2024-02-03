import * as THREE from "../../three.js";
import Button from "../common/Button.js";
import { NetworkScene } from "../Scene.js";
import Ball from "./Ball.js";
import Player from "./Player.js";
import Wall from "./Wall.js";
import { zaxis } from "../preset.js";

export default class PhongGame extends NetworkScene {
    static STATE_MENU = 0;
    static STATE_PHONG = 1;
    static STATE_PHONG_TOURNAMENT = 2;
    constructor(width, height, token) {
        super(width, height)
        this.token = token;
        this.intraId = token; // TODO: get intraId in jwt token
        this.factory = {
            "player": Player,
            "wall": Wall,
            "ball": Ball,
            "button": Button,
        }
        this.#initKeyEvent();
        this.selectedButton = null;
        this.raycaster = new THREE.Raycaster();
        this.state = PhongGame.STATE_MENU;
        this.loadMenu();
        this.setOnmessage("init", this.#netInit.bind(this))
        this.setOnmessage("update", this.#netUpdate.bind(this))
        this.setOnmessage("step", this.#netStep.bind(this))
    }

    loadMenu() {
        this.loadDefaultScene();
        const commonGame = this.#createObject("button", {
            position: { x: -10, y: 0, z: 0 },
            color: 0xffff00,
            callback: this.loadPhong.bind(this),
        });
        this.addGameObject(commonGame);
        const tournamentGame = this.#createObject("button", {
            position: { x: 10, y: 0, z: 0 },
            color: 0x0000ff,
            callback: this.loadPhong.bind(this),
        });
        this.addGameObject(tournamentGame);
        const globalLight = new THREE.PointLight(0xffffff, 500);
        this.add(globalLight);
        globalLight.position.set(0, 0, 20);
        const light = new THREE.PointLight(0xffffff, 200);
        this.renderer.domElement.addEventListener("mousemove", e => {
            const pos = this.#getMouseWorldPosition(e.offsetX, e.offsetY);
            light.position.set(pos.x, pos.y, light.position.z);
            this.selectedButton = this.#selectButton(e.offsetX, e.offsetY);
        });
        this.renderer.domElement.addEventListener("click", _ => {
            if (this.selectedButton != null) this.selectedButton.invoke();
        });
        light.position.set(9999, 9999, 10);
        this.add(light);
    }

    loadPhong() {
        this.loadDefaultScene();
    }

    #getMouseWorldPosition(screenX, screenY) {
        const rect = new THREE.Vector2();
        this.camera.getViewSize(this.camera.position.z, rect);
        const ratio = {
            x: screenX / this.renderer.domElement.width,
            y: screenY / this.renderer.domElement.height,
        }
        return new THREE.Vector2(
            ratio.x * rect.x - rect.x * .5,
            ratio.y * -rect.y + rect.y * .5
        )
    }

    #selectButton(screenX, screenY) {
        const mouse = new THREE.Vector2();
        mouse.x = (screenX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(screenY / this.renderer.domElement.clientHeight) * 2 + 1;

        this.raycaster.setFromCamera(mouse, this.camera);

        return this.raycaster
            .intersectObjects(this.children, false)
            .map(x => x.object)
            .filter(x => x instanceof Button)[0];
    }

    async #waitQ() {
        super.waitQ(this.token, "phong");
    }

    #createObject(type, params) {
        if (this.factory[type] == null) throw new Error("receive unknown tag object");
        return new this.factory[type](params);
    }

    #netInit(data) {

        // create objects
        for (const rawObject of data.objects) {
            let mesh = null;
            const { position, rotation, scale } = rawObject.transform;
            const net = {id: rawObject.id, tag: rawObject.tag, type: rawObject.type };
            if (net.tag == "player") mesh = new Player(net, {position, rotation, scale});
            if (net.tag == "wall") mesh = new Wall(net, {position, rotation, scale});
            if (net.tag == "ball") mesh = new Ball(net, {position, rotation, scale});
            if (mesh == null) throw new Error("receive unknown tag object");
            this.addGameObject(mesh);
        }
    
        // rotate camera angle for player
        for (const player of data.players) {
            if (player.intra_id != this.intraId) continue
            const unit = this.getNetworkObject(player.unit_id);
            const rawUnit = data.objects.filter(x => x.id == unit.net.id)[0]
            const rad = Math.acos(rawUnit.transform.rotation.x) * (rawUnit.transform.rotation.y > 0 ? 1 : -1);
            const { camera } = this;
            camera.position.set(unit.position.x, unit.position.y, camera.position.z);
            camera.setRotationFromAxisAngle(zaxis, rad - Math.PI * 0.5);
            camera.rotateX(Math.PI / 12);
        }
    }
    
    #netUpdate(data) {
        for (const i in data.changed) {
            const item = data.changed[i]
            const mesh = this.getNetworkObject(item.id);
            if (item.to != null) mesh.to = {...mesh.to, ...item.to}
            if (item.acc != null) mesh.acc = {...mesh.acc, ...item.acc}
        }
        if (data.debug.detected_wall_id != null) {
            const touchedWall = this.getNetworkObject(data.debug.detected_wall_id);
            touchedWall.material.color.b = 1
            touchedWall.material.color.g = 1
        }
    }

    #netStep(data) {
        if (data?.level === "end game") {
            this.loadMenu();
        }
        if (data?.level === "end round") {
            this.destroyRenderer();
            this.loadDefaultScene();
        }
    }

    #initKeyEvent() {
        this.key = {};
        window.addEventListener('keydown', (e) => this.key[e.key] = true);
        window.addEventListener('keyup', (e) => this.key[e.key] = false);
        const action = { move: 0 }
        this.addRenderHook(() => {
            const pos = this.key['ArrowLeft'] || this.key['a'] ? 1 : 0;
            const neg = this.key['ArrowRight'] || this.key['d'] ? -1 : 0;
            const move = pos + neg;

            if (action.move != move && this.socket.readyState == this.socket.OPEN) {
                action.move = move;
                if (this.socket.readyState == this.socket.OPEN) {
                    this.send({type: "move", data: action});
                }
            }
        });
    }
}
