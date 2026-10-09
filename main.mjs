import {Vector} from "./modules/math.mjs";
import {Star, Dot, Line, Surface, Block, Scene, Camera} from "./modules/scene.mjs";

const info = document.getElementById("info");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.height = 500;
var propX = window.innerWidth / window.innerHeight;
canvas.width = Math.round(canvas.height * propX);
let imageData = ctx.createImageData(canvas.width,canvas.height);
window.addEventListener("resize",(e) => {
    propX = window.innerWidth / window.innerHeight;
    canvas.width = Math.round(canvas.height * propX);
    imageData = ctx.createImageData(canvas.width,canvas.height);
});
let scene = new Scene();

let camera = new Camera(scene,1,1);

let time = performance.now();
let deltaTime = 0;
for(let i = 0; i < 3000; i++)
    scene.elements.add(new Star(Math.random()*Math.PI,Math.random()*Math.PI*2));
for(let i = 0; i < 10000; i++)
    scene.elements.add(new Dot(new Vector(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5),255,0,0));
let rotationSpeed = new Vector(0,0);
let speed = new Vector(0,0,0);

var keys = {};

addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

let sensitivity = 2;
let mSpeed = 1;
function checkKeys() {
    rotationSpeed.assign(0,0);
    speed.assign(0,0,0);
    if(keys.ArrowRight)
        rotationSpeed.X+=sensitivity;
    if(keys.ArrowLeft)
        rotationSpeed.X-=sensitivity;
    if(keys.ArrowUp)
        rotationSpeed.Y+=sensitivity;
    if(keys.ArrowDown)
        rotationSpeed.Y-=sensitivity;
    if(keys.w)
        speed.add(camera.N.calc.scale(mSpeed));
    if(keys.s)
        speed.subtract(camera.N.calc.scale(mSpeed));
    if(keys.d)
        speed.add(camera.X.calc.scale(mSpeed));
    if(keys.a)
        speed.subtract(camera.X.calc.scale(mSpeed));
    if(keys.e)
        speed.subtract(camera.Y.calc.scale(mSpeed));
    if(keys.c)
        speed.add(camera.Y.calc.scale(mSpeed));
}

function game() {
    checkKeys();
    imageData.data.fill(0);
    deltaTime = (-time+(time=performance.now()))*0.001;
    info.textContent = Math.round(1/deltaTime);
    camera.position.add(speed.calc.scale(deltaTime));
    camera.rotation.add(rotationSpeed.calc.scale(deltaTime));
    camera.update();
    camera.shoot(imageData);
    ctx.putImageData(imageData,0,0);
    requestAnimationFrame(game);
}
requestAnimationFrame(game);