export {Vector};
class Vector {
    static #namingConvention(index) {
        return String.fromCharCode(index<3?120+index:122-index);
    }
    static #assignZero = {};
    static #buildAssignZero(dimensions) {
        if(this.#assignZero[dimensions]) return this.#assignZero[dimensions];
        let str = "";
        for(let i = 0; i < dimensions; i++)
            str += "this."+this.#namingConvention(i)+"=0;";
        return this.#assignZero[dimensions] = new Function(str);
    }
    static #assign = {};
    static #buildAssign(dimensions) {
        if(this.#assign[dimensions]) return this.#assign[dimensions];
        let e = this.#namingConvention(0), str = "this."+e+"=v."+e+";";
        for(let i = 1; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"=v."+e+";";
        }
        return this.#assign[dimensions] = new Function("v",str);
    }
    static #dot = {};
    static #buildDot(dimensions) {
        if(this.#dot[dimensions]) return this.#dot[dimensions];
        let e = this.#namingConvention(0), str = "return this."+e+"*v."+e;
        for(let i = 1; i < dimensions && (str += "+"); i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"*v."+e;
        }
        return this.#dot[dimensions] = new Function("v",str+";");
    }
    static #add = {};
    static #buildAdd(dimensions) {
        if(this.#add[dimensions]) return this.#add[dimensions];
        let e = this.#namingConvention(0), str = "this."+e+"+=v."+e+";";
        for(let i = 1; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"+=v."+e+";";
        }
        return this.#add[dimensions] = new Function("v",str+";");
    }
    static #subtract = {};
    static #buildSubtract(dimensions) {
        if(this.#subtract[dimensions]) return this.#subtract[dimensions];
        let e = this.#namingConvention(0), str = "this."+e+"-=v."+e+";";
        for(let i = 1; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"-=v."+e+";";
        }
        return this.#add[dimensions] = new Function("v",str+";");
    }
    static #scale = {};
    static #buildScale(dimensions) {
        if(this.#scale[dimensions]) return this.#scale[dimensions];
        let e = this.#namingConvention(0), str = "this."+e+"*=s;";
        for(let i = 1; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"*=s;";
        }
        return this.#scale[dimensions] = new Function("s",str+";");
    }
    constructor(...elements) {
        for(let i = 0; i < elements.length; i++)
            this[Vector.#namingConvention(i)] = elements[i];
        this.assignZero = Vector.#buildAssignZero(elements.length);
        this.assign = Vector.#buildAssign(elements.length);
        this.dot = Vector.#buildDot(elements.length);
        this.add = Vector.#buildAdd(elements.length);
        this.subtract = Vector.#buildSubtract(elements.length);
        this.scale = Vector.#buildScale(elements.length);
    }
}