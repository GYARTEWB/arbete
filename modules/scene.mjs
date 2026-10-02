import {Vector} from "./math.mjs";
export {Scene, Block, Surface, Camera};
class Surface {
    position; size; X; N; Y; texture;
    constructor(position=Vector.zero(3),size=new Vector(1,1),X=new Vector(1,0,0),Y=new Vector(0,0,1),N=new Vector(0,1,0),texture=(x=0,y=0,array4=[0,0,0,0])=>array4.fill(255)) {
        this.position = position;
        this.size = size;
        this.X = X;
        this.N = N;
        this.Y = Y;
        this.texture = texture;
    }
}
class Block {
    position; size; rotation; surfaces;
    constructor(position=Vector.zero(3),size=new Vector(2,4,1),rotation=Vector.zero(3)) {
        this.position = position;
        this.size = size;
        this.rotation = rotation;
        this.surfaces=[
            new Surface(), //0 0 1
            new Surface(), //0 0 -1
            new Surface(), //0 1 0
            new Surface(), //0 -1 0
            new Surface(), //1 0 0
            new Surface()  //-1 0 0
        ];
        this.update();
    }
    update() {

    }
    removeFrom(scene) { //ett block har såklart 6 ytor
        for(let i = 0; i < 6; scene.surfaces.delete(this.surfaces[i++]));
    }
}
class Scene {
    surfaces;
    add(item) {
        for(let i = 0; i < item.surfaces.length; this.surfaces.add(item.surfaces[i++]));
    }
    constructor(...items) {
        this.surfaces = new Set(items);
    }
}
class Camera {
    #calc3; #calc2; #middle; #hScalar; #wScalar; scene; position; rotation; screenDistance; X; N; Y;
    constructor(scene=new Scene(),screenDistance=1,position=Vector.zero(3),rotation=Vector.zero(2)) {
        this.#calc3 = Vector.zero(3);
        this.#calc2 = Vector.zero(2);
        this.#middle = Vector.zero(2);
        this.scene = scene;
        this.position = position;
        this.rotation = rotation;
        this.screenDistance = screenDistance;
        this.X = Vector.zero(2);
        this.N = Vector.zero(3);
        this.Y = Vector.zero(3);
        this.update();
    }
    update() {
        let cz = Math.cos(this.rotation.x), sz = Math.sin(this.rotation.x), cx = Math.cos(this.rotation.y), sx = Math.sin(this.rotation.y);
        this.X.assign(cz,-sz);
        this.N.assign(cx*sz,cx*cz,sx);
        this.Y.assign(sx*sz,sx*cz,-cx);
        this.rotation.x %= Math.PI*2;
        this.rotation.y %= Math.PI*2;
    }
    shoot(imageData=new ImageData(0,0)) {
        this.#middle.assign(imageData.width>>1,imageData.height>>1);
        this.#hScalar = imageData.height;
        this.#wScalar = imageData.width;
        let index = 0;
        let calc = this.screenDistance*this.#hScalar;
        let calcN = 0;
        this.scene.surfaces.forEach(element => {
            if((calcN=this.#calc3.assignVector(element.position).subtract(this.position).dot(this.N))>0) {
                this.#calc2.assign(this.X.dot(this.#calc3),this.Y.dot(this.#calc3)).scale(calc/calcN).add(this.#middle);
                if(this.#calc2.y>=0&&this.#calc2.y<this.#hScalar&&this.#calc2.x>=0&&this.#calc2.x<this.#wScalar) {
                    index = 4*((this.#calc2.y|0)*this.#wScalar+(this.#calc2.x|0));
                    imageData.data[index] = 255;
                    imageData.data[index+1] = 255;
                    imageData.data[index+2] = 255;
                    imageData.data[index+3] = 255;
                }
            }
        });
    }
}