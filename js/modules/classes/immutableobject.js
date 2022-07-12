export class ImmutableObject {
    constructor(args){
        const privatePrefix = '#';// can be hashtag or underscore
        const keys = Object.keys(args);
        keys.forEach(x => {this[privatePrefix + x] = args[x];
        Object.defineProperty(this,x,{get: () => this[privatePrefix + x]}); //Define Getter
    });
    }
  }
  