import {Vector} from "./modules/math.mjs";
import {Camera, Scene, Surface} from "./modules/scene.mjs";

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
for(let i = 0; i < 10000; i++)
    scene.surfaces.add(new Surface(new Vector(5000-Math.random()*10000,Math.random()*100000,5000-Math.random()*10000)));
let camera = new Camera(scene,1);

let time = performance.now();
let deltaTime = 0;

let rotationSpeed = new Vector(1,0);
let speed = new Vector(0,1000,0);
let calc2 = Vector.zero(2);
let calc3 = Vector.zero(3);

function game() {
    imageData.data.fill(0);
    deltaTime = (-time+(time=performance.now()))*0.001;
    info.textContent = Math.round(1/deltaTime);
    camera.rotation.add(calc2.assignVector(rotationSpeed).scale(deltaTime));
    camera.position.add(calc3.assignVector(speed).scale(deltaTime));
    camera.update();
    camera.shoot(imageData);
    ctx.putImageData(imageData,0,0);
    requestAnimationFrame(game);
}
requestAnimationFrame(game);