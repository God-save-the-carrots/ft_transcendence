import * as THREE from "../../three.js";
import Button from "../common/Button.js";
import { NetworkScene } from "../Scene.js";
import Ball from "./Ball.js";
import Player from "./Player.js";
import Wall from "./Wall.js";
import { zaxis } from "../preset.js";

export default class PhongGame extends NetworkScene {
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
        this.setOnmessage("init", this.#netInit.bind(this))
        this.setOnmessage("update", this.#netUpdate.bind(this))
        this.setOnmessage("end", this.#netEnd.bind(this))
        this.initKeyEvent();
        this.loadMenu();
        this.camera.position.z = 30;
    }

    // TODO
    loadMenu() {
        // this.addGameObject(this.#createObject("button", {
        // }));
        // const light = new THREE.PointLight(0xffffff, 200);
        // light.position.set(0, 0, 10);
        // this.add(light);

        this.#waitQ();
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

    #netEnd(data) {
        console.log(data.result); // TODO: show result
        this.socket.close();
        alert("TODO: restart game"); // TODO: return to main menu
    }

    initKeyEvent() {
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
                this.send({type: "move", data: action});
            }
        });
    }
}
