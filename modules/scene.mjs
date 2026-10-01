import {Vector} from "math.mjs";
export {Scene, Camera};
class Scene {
    constructor() {
        
    }
}
class Camera {
    #offsetCalc;
    constructor(scene,x,y,z,thetaZ,thetaX) {
        this.#offsetCalc = new Vector(0,0,0);
        this.scene = scene;
        this.position = new Vector(x,y,z);
        this.thetaZ = thetaZ;
        this.thetaX = thetaX;
        this.X = new Vector(0,0,0);
        this.N = new Vector(0,0,0);
        this.Y = new Vector(0,0,0);
    }
    update(position,thetaZ,thetaX) {
        let cz = Math.cos(thetaZ), sz = Math.sin(thetaZ), cx = Math.cos(thetaX), sx = Math.sin(thetaX);
        this.X.assign(
            cz,
            -sz,
            0
        )
        this.N.assign(
            cx*sz,
            cx*cz,
            sx
        )
        this.Y.assign(
            sx*sz,
            sx*cz,
            -cx
        )
        this.position.assignVector(position);
        this.thetaZ = thetaZ;
        this.thetaX = thetaX;
    }
    shoot(imageData) {

    }
}