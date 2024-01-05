import * as THREE from "./three.js"; // path for vscode
import client from "./client.js"

/**
 * @type {Map<String, THREE.Mesh>}
 */
const world = new Map();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 1000);
// scene.fog = new THREE.Fog('lightblue', 42, 50);
scene.background = new THREE.Color('lightblue');
const zaxis = new THREE.Vector3(0, 0, 1);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const geometryBackground = new THREE.PlaneGeometry(1000, 1000);
const materialBackground = new THREE.MeshPhongMaterial({ color: 0x666666 });

const background = new THREE.Mesh(geometryBackground, materialBackground);
background.receiveShadow = true;
background.castShadow = true;
background.position.set(0, 0, -1);
scene.add(background);

const amb = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(amb);

camera.position.z = 42;

const key = {};
window.addEventListener('keydown', (e) => {
    key[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    key[e.key] = false;
});

const socket = new WebSocket(`ws://${window.location.hostname}:5555`);
const tempIntraId = Math.random().toString(36).substring(2,7);
socket.onopen = function (e) {
    socket.send(JSON.stringify({
        type: "auth",
        token: tempIntraId, // "<access-token>",
        game: "phong"
    }));
}

socket.onmessage = async function (e) {
    const data = JSON.parse(e.data);
    if (data.type == "init") {
        for (const rawObject of data.objects) {
            let mesh = null;
            const position = rawObject.transform.position;
            const rotation = rawObject.transform.rotation;
            const scale = rawObject.transform.scale;
            const { id, tag, type } = rawObject;
            if (type == "circle") {
                const geometryCylinder = new THREE.SphereGeometry(scale.x * 0.5);
                const materialCylinder = new THREE.MeshPhongMaterial({ color: 0xff0000 });
                mesh = new THREE.Mesh(geometryCylinder, materialCylinder);
            }
            if (type == "rect") {
                const geometryCylinder = new THREE.BoxGeometry(scale.x, scale.y, 1);
                const materialCylinder = new THREE.MeshPhongMaterial({ color: 0xff0000 });
                mesh = new THREE.Mesh(geometryCylinder, materialCylinder);
            }
            mesh.position.set(position.x, position.y, position.z);
            const rad = Math.acos(rotation.x) * (rotation.y > 0 ? 1 : -1);
            mesh.setRotationFromAxisAngle(zaxis, rad + Math.PI * 0.5)
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);

            world.set(id, mesh);
            mesh.to = { position, rotation, scale };
            mesh.acc = { position:{x:0,y:0,z:0}};
            mesh.meta = { id, type, tag };
        }
        const light = new THREE.PointLight(0xffffff, 200);
        light.position.set(0, 0, 10);
        light.castShadow = true;
        light.shadow.normalBias = 0.2;
        const balls = Array.from(world.values()).filter(x => x.meta.tag == "ball");
        if (balls.length == 1) balls[0].add(light);
        else scene.add(light);
        for (const player of data.players) {
            if (player.intra_id != tempIntraId) continue
            const unit = world.get(player.unit_id);
            const rawUnit = data.objects.filter(x => x.id == unit.meta.id)[0]
            const rad = Math.acos(rawUnit.transform.rotation.x) * (rawUnit.transform.rotation.y > 0 ? 1 : -1);
            camera.position.x = unit.position.x;
            camera.position.y = unit.position.y;
            camera.setRotationFromAxisAngle(zaxis, rad - Math.PI * 0.5)
            camera.rotateX(Math.PI / 12)
        }
    }
    if (data.type == "update") {
        for (const i in data.changed) {
            const item = data.changed[i]
            const mesh = world.get(item.id);
            if (item.to != null) mesh.to = {...mesh.to, ...item.to}
            if (item.acc != null) mesh.acc = {...mesh.acc, ...item.acc}
        }
        if (data.debug.detected_wall_id != null) {
            const touchedWall = world.get(data.debug.detected_wall_id);
            touchedWall.material.color.b = 1
            touchedWall.material.color.g = 1
        }
    }
}

const DENSE = 0.35;
const clock = new THREE.Clock();
const action = { move: 0 }
const vadd = function(o, v, d) {
    o.x = o.x + (v.x * d);
    o.y = o.y + (v.y * d);
}
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    const d = clock.getDelta();
    for (const [, obj] of world) {
        if (obj.acc.position != null) vadd(obj.to.position, obj.acc.position, d)

        obj.position.x = obj.position.x * (1 - DENSE) + obj.to.position.x * DENSE;
        obj.position.y = obj.position.y * (1 - DENSE) + obj.to.position.y * DENSE;

        if (obj.material.color.b > 0) obj.material.color.b -= 1 / 60
        if (obj.material.color.g > 0) obj.material.color.g -= 1 / 60
    }

    const pos = key['ArrowLeft'] || key['a'] ? 1 : 0;
    const neg = key['ArrowRight'] || key['d'] ? -1 : 0;
    const move = pos + neg;

    if (action.move != move && socket.readyState == socket.OPEN) {
        // const ball = Object.values(world).filter(x => x.meta.tag == "ball")[0];
        action.move = move;
        socket.send(JSON.stringify({type: "move", data: action} ));
    }
}

animate();
