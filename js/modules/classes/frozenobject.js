export class FrozenObject {
    constructor(obj){
        //const keys = Object.keys(args);
        //keys.forEach(x => {this[x] = args[x];});
        //Object.freeze(this); 
        return Object.freeze(obj); 
    }
  }
  