export {Vector};
class Vector {
    static #namingConvention(index) {
        return String.fromCharCode(index<3?120+index:122-index);
    }
    static #assignVector = {};
    static #buildAssignVector(dimensions) {
        if(this.#assignVector[dimensions]) return this.#assignVector[dimensions];
        let e = "", str = "";
        for(let i = 0; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"=v."+e+";";
        }
        return this.#assignVector[dimensions] = new Function("v",str+"return this;");
    }
    static #assign = {};
    static #buildAssign(dimensions) {
        if(this.#assign[dimensions]) return this.#assign[dimensions];
        let e = "",  str = "", input = [];
        for(let i = 0; i < dimensions; i++) {
            e = this.#namingConvention(i);
            input.push(e);
            str += "this."+e+"="+e+";";
        }
        return this.#assign[dimensions] = new Function(...input,str+"return this");
    }
    static #dot = {};
    static #buildDot(dimensions) {
        if(this.#dot[dimensions]) return this.#dot[dimensions];
        let e = this.#namingConvention(0), str = "return this."+e+"*v."+e;
        for(let i = 1; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "+this."+e+"*v."+e;
        }
        return this.#dot[dimensions] = new Function("v",str+";");
    }
    static #magnitude = {};
    static #buildMagnitude(dimensions) {
        if(this.#magnitude[dimensions]) return this.#magnitude[dimensions];
        let e = this.#namingConvention(0), str = "return Math.sqrt(this."+e+"*this."+e;
        for(let i = 1; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "+this."+e+"*this."+e;
        }
        return this.#magnitude[dimensions] = new Function(str+");");
    }
    static #add = {};
    static #buildAdd(dimensions) {
        if(this.#add[dimensions]) return this.#add[dimensions];
        let e = "", str = "";
        for(let i = 0; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"+=v."+e+";";
        }
        return this.#add[dimensions] = new Function("v",str+"return this;");
    }
    static #subtract = {};
    static #buildSubtract(dimensions) {
        if(this.#subtract[dimensions]) return this.#subtract[dimensions];
        let e = "", str = "";
        for(let i = 0; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"-=v."+e+";";
        }
        return this.#subtract[dimensions] = new Function("v",str+"return this;");
    }
    static #scale = {};
    static #buildScale(dimensions) {
        if(this.#scale[dimensions]) return this.#scale[dimensions];
        let e = "", str = "";
        for(let i = 0; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"*=s;";
        }
        return this.#scale[dimensions] = new Function("s",str+"return this;");
    }
    static zero(dimensions) {
        return new Vector(...Array(dimensions));
    }
    #calcVector;
    get calc() {
        this.#calcVector = Vector.zero(this.#dimensions);
        Object.defineProperty(this,"calc",{get:this.#calcVector.assignVector.bind(this.#calcVector,this)});
        return this.calc;
    }
    #dimensions;
    get dimensions() {
        return this.#dimensions;
    }
    assignVector(vector) {
        this.assignVector = Vector.#buildAssignVector(this.#dimensions)
        return this.assignVector(vector);
    }
    assign(...elements) {
        this.assign = Vector.#buildAssign(this.#dimensions)
        return this.assign(...elements);
    }
    dot(vector) {
        this.dot = Vector.#buildDot(this.#dimensions)
        return this.dot(vector);
    }
    get selfDot() {
        Object.defineProperty(this,"selfDot",{get:Vector.#buildDot(this.#dimensions).bind(this,this)});
        return this.selfDot;
    }
    get magnitude() {
        Object.defineProperty(this,"magnitude",{get:Vector.#buildMagnitude(this.#dimensions)});
        return this.magnitude;
    }
    add(vector) {
        this.add = Vector.#buildAdd(this.#dimensions)
        return this.add(vector);
    }
    subtract(vector) {
        this.subtract = Vector.#buildSubtract(this.#dimensions)
        return this.subtract(vector);
    }
    scale(scalar) {
        this.scale = Vector.#buildScale(this.#dimensions)
        return this.scale(scalar);
    }
    constructor(...elements) {
        for(let i = 0; i < elements.length; this[Vector.#namingConvention(i)] = elements[i++]??0);
        this.#dimensions = elements.length;
    }
}