import {Vector} from "./math.mjs";
export {Dot, Line, Surface, Block, Scene, Camera};

class Dot {
    #O; #ON; #screenCoordinate; position; r;g;b;
    constructor(position=Vector.zero(3),r,g,b) {
        this.position = position;
        this.#O = Vector.zero(3);
        this.#screenCoordinate = Vector.zero(2);
        this.r = r;
        this.g = g;
        this.b = b;
    }
    draw(camera) {
        this.#ON = this.#O.assignVector(this.position).subtract(camera.position).dot(camera.N);
        if(this.#ON>0) {
            this.#screenCoordinate.assign(
                camera.X.dot(this.#O),
                camera.Y.dot(this.#O)
            ).scale(camera.screenCoordinateScalar/this.#ON).add(camera.middle);
            if(this.#screenCoordinate.x>=0&&this.#screenCoordinate.x<camera.wScalar && this.#screenCoordinate.y>=0&&this.#screenCoordinate.y<camera.hScalar) {
                let index = camera.wScalar*(this.#screenCoordinate.y|0)+(this.#screenCoordinate.x|0);
                let distance = this.#O.selfDot;
                if(distance<camera.depthBuffer.data[index]) {
                    camera.depthBuffer.data[index] = distance;
                    index *= 4;
                    camera.imageData[index] = this.r;
                    camera.imageData[index+1] = this.g;
                    camera.imageData[index+2] = this.b;
                    camera.imageData[index+3] = 255*(camera.light/Math.sqrt(distance));
                }
            }
        }
    }
}

function DDA(start,direction,steps,func=(walk)=>0) {
    let walk = start.calc;
    let step = direction.calc;
    let itterations = 0;
    if(Math.abs(direction.y)>Math.abs(direction.x)) {
        step.assign(direction.x/direction.y,1).scale(Math.sign(direction.y));
        itterations = steps.y;
    } else {
        step.assign(1,direction.y/direction.x).scale(Math.sign(direction.x));
        itterations = steps.x;
    }
    for(let i = 0; i < itterations; i++) {
        func(walk.calc.floor());
        walk.add(step);
    }
}

class Line {
    start; end;
    constructor(start=Vector.zero(3),end=new Vector(1,1,1)) {
        this.start = start;
        this.end = end;
    }
    draw(camera) {

    }
}

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
    draw(camera) {

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
    update(deltaTime) {

    }
    draw(camera) {
        for(let i = 0; i < this.surfaces.length; this.surfaces[i].draw(camera));
    }
}

class Scene {
    elements;
    update(deltaTime) {
        this.elements.forEach(element=>element.update&&element.update(deltaTime));
    }
    constructor() {
        this.elements = new Set();
    }
}

class depthBuffer {
    width;height;data;
    constructor(width,height) {
        this.width = width;
        this.height = height;
        this.data = new Array(width*height).fill(Infinity);
    }
    reset() {
        this.data.fill(Infinity);
    }
}

class Camera {
    imageData; depthBuffer; middle; hScalar; wScalar; scene; position; rotation; screenCoordinateScalar; screenDistance; X; N; Y; light;
    constructor(scene=new Scene(),screenDistance=1,light=100,position=Vector.zero(3),rotation=Vector.zero(2)) {
        this.middle = Vector.zero(2);
        this.scene = scene;
        this.position = position;
        this.rotation = rotation;
        this.screenDistance = screenDistance;
        this.X = Vector.zero(2);
        this.N = Vector.zero(3);
        this.Y = Vector.zero(3);
        this.light = light;
        this.depthBuffer = new depthBuffer(0,0);
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
        if(imageData.width!=this.depthBuffer.width||imageData.height!=this.depthBuffer.height)
            this.depthBuffer = new depthBuffer(imageData.width,imageData.height);
        this.middle.assign(imageData.width>>1,imageData.height>>1);
        this.hScalar = imageData.height;
        this.wScalar = imageData.width;
        this.screenCoordinateScalar = this.hScalar*this.screenDistance;
        this.imageData = imageData.data;
        this.scene.elements.forEach(element=>element.draw(this));
        this.depthBuffer.reset();
    }
}