import {Vector} from "./modules/math.mjs";
import {Dot, Line, Surface, Block, Scene, Camera} from "./modules/scene.mjs";

const info = document.getElementById("info");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.height = 250;
var propX = window.innerWidth / window.innerHeight;
canvas.width = Math.round(canvas.height * propX);
let imageData = ctx.createImageData(canvas.width,canvas.height);
window.addEventListener("resize",(e) => {
    propX = window.innerWidth / window.innerHeight;
    canvas.width = Math.round(canvas.height * propX);
    imageData = ctx.createImageData(canvas.width,canvas.height);
});
let scene = new Scene();

let camera = new Camera(scene,1,100000);

let time = performance.now();
let deltaTime = 0;
for(let i = 0; i < 100000; i++)
    scene.elements.add(new Dot(new Vector(500000-Math.random()*1000000,Math.random()*10000000,500000-Math.random()*1000000),255,255,255));
let rotationSpeed = new Vector(0,0);
let speed = new Vector(0,10000,0);

function game() {
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