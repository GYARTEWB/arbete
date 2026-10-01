export {Vector};
class Vector {
    static #namingConvention(index) {
        return String.fromCharCode(index<3?120+index:122-index);
    }
    static #assignVector = {};
    static #buildAssignVector(dimensions) {
        if(this.#assignVector[dimensions]) return this.#assignVector[dimensions];
        let e = this.#namingConvention(0), str = "this."+e+"=v."+e+";";
        for(let i = 1; i < dimensions; i++) {
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
        for(let i = 1; i < dimensions && (str += "+"); i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"*v."+e;
        }
        return this.#dot[dimensions] = new Function("v",str+";");
    }
    static #magnitude = {};
    static #buildMagnitude(dimensions) {
        if(this.#magnitude[dimensions]) return this.#magnitude[dimensions];
        let e = this.#namingConvention(0), str = "return (this."+e+"*this."+e;
        for(let i = 1; i < dimensions && (str += "+"); i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"*this."+e;
        }
        return this.#magnitude[dimensions] = new Function(str+")**0.5;");
    }
    static #add = {};
    static #buildAdd(dimensions) {
        if(this.#add[dimensions]) return this.#add[dimensions];
        let e = this.#namingConvention(0), str = "this."+e+"+=v."+e+";";
        for(let i = 1; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"+=v."+e+";";
        }
        return this.#add[dimensions] = new Function("v",str+"return this;");
    }
    static #subtract = {};
    static #buildSubtract(dimensions) {
        if(this.#subtract[dimensions]) return this.#subtract[dimensions];
        let e = this.#namingConvention(0), str = "this."+e+"-=v."+e+";";
        for(let i = 1; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"-=v."+e+";";
        }
        return this.#subtract[dimensions] = new Function("v",str+"return this;");
    }
    static #scale = {};
    static #buildScale(dimensions) {
        if(this.#scale[dimensions]) return this.#scale[dimensions];
        let e = this.#namingConvention(0), str = "this."+e+"*=s;";
        for(let i = 1; i < dimensions; i++) {
            e = this.#namingConvention(i);
            str += "this."+e+"*=s;";
        }
        return this.#scale[dimensions] = new Function("s",str+"return this;");
    }
    static zero(dimensions) {
        return new Vector(...Array(dimensions));
    }
    constructor(...elements) {
        for(let i = 0; i < elements.length; i++)
            this[Vector.#namingConvention(i)] = elements[i]??0;
        this.assignVector = Vector.#buildAssignVector(elements.length);
        this.assign = Vector.#buildAssign(elements.length);
        this.dot = Vector.#buildDot(elements.length);
        this.magnitude = Vector.#buildMagnitude(elements.length);
        this.add = Vector.#buildAdd(elements.length);
        this.subtract = Vector.#buildSubtract(elements.length);
        this.scale = Vector.#buildScale(elements.length);
    }
}