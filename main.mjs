import {Vector} from "./modules/math.mjs";

const gameCanvas = document.getElementById("game");
const gameCTX = gameCanvas.getContext("2d");
gameCanvas.height = 50;
var propX = window.innerWidth / window.innerHeight;
gameCanvas.width = Math.round(gameCanvas.height * propX);
window.addEventListener("resize",(e) => {
    propX = window.innerWidth / window.innerHeight;
    gameCanvas.width = Math.round(gameCanvas.height * propX);
});

function test() {
    gameCTX.fillStyle = "white";
    gameCTX.fillRect(10,10,1,1);
    requestAnimationFrame(test);
}
requestAnimationFrame(test);