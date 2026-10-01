import {Vector} from "./math.mjs";
export {Scene, Camera};
class Scene {
    constructor() {
        
    }
}
class Camera {
    #calc3;
    #calc2;
    constructor(scene,position,rotation,screenDistance) {
        this.#calc3 = Vector.zero(3);
        this.#calc2 = Vector.zero(2);
        this.scene = scene;
        this.position = position;
        this.rotation = rotation;
        this.screenDistance = screenDistance;
        this.X = new Vector(1,0);
        this.N = new Vector(0,1,0);
        this.Y = new Vector(0,0,-1);
    }
    update() {
        let cz = Math.cos(this.rotation.x), sz = Math.sin(this.rotation.x), cx = Math.cos(this.rotation.y), sx = Math.sin(this.rotation.y);
        this.X.assign(cz,-sz).scale(this.screenDistance);
        this.N.assign(cx*sz,cx*cz,sx).scale(this.screenDistance);
        this.Y.assign(sx*sz,sx*cz,-cx).scale(this.screenDistance);
    }
    shoot(imageData) {
        console.log(imageData.width,imageData.height);
    }
}