import {Vector} from "math.mjs";
export {Scene, Camera};
class Scene {
    constructor() {
        
    }
}
class Camera {
    constructor(x,y,z) {
        this.position = new Vector(x,y,z);
    }
}