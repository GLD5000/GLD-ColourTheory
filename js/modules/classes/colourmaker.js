export const colourMaker= {
    swatches: {
        analogousA: {hue: -30, operation: 'add'},
        analogousB: {hue: 30, operation: 'add'},
        triadicA: {hue: -120, operation: 'add'},
        triadicB: {hue: 120, operation: 'add'},
        tetradicA: {hue: 90, operation: 'add'},
        tetradicB: {hue: 180, operation: 'add'},
        tetradicC: {hue: 270, operation: 'add'},
        monochromeA: {lum: -10, operation: 'add'},
        monochromeB: {lum: 10, operation: 'add'},
        neutral: {sat: 0, operation: 'replace'}
      },
      operations: {
        'multiply': (oldVal, newVal) =>  oldVal * newVal,
        'add': (oldVal, newVal) =>  oldVal + newVal,
        'subtract': (oldVal, newVal) =>  oldVal - newVal,
        'divide': (oldVal, newVal) =>  oldVal / newVal,
        'replace': (oldVal, newVal) =>  newVal,
        'keep': (oldVal, newVal) =>  oldVal
      },
      testOldHsl: {hue: 2, sat: 2, lum: 3},
      testNewHsl: {hue: 500, sat: 500, operation: 'multiply'},
      _clamp(value, min = 0, max = 100) {
        return Math.min(Math.max(min, value),max);
      },
      _rotate(x, min = 0, max = 360) {
        if (x > max) x -= parseInt(x/max)*max;
        if (x < min) x -= parseInt(x/max)*max -max;
        return x;
      },
    

      _combineHSL ({oldColour, newColour}) {
        return {
          hue: (!newColour.hue)? oldColour.hue: this._rotate(this.operations[newColour.operation || 'add'](oldColour.hue,newColour.hue)),
          sat: (!newColour.sat)? oldColour.sat: this._clamp(this.operations[newColour.operation || 'add'](oldColour.sat,newColour.sat)),
          lum: (!newColour.lum)? oldColour.lum: this._clamp(this.operations[newColour.operation || 'add'](oldColour.lum,newColour.lum)),
        };
      },
      //log () {console.log(this._rotate(380))}
      log () {console.log(this._combineHSL({oldColour: this.testOldHsl, newColour: this.testNewHsl}))}

/*       combineHSL ({hue,sat,lum},{newHue = undefined, newSat = undefined, newLum = undefined, operation = 'add'}) {
        return {
          hue: (!newHue)? hue: this.operations[operation](hue,newHue),
          sat: (!newSat)? sat: this.operations[operation](sat,newLum),
          lum: (!newLum)? lum: this.operations[operation](lum,newLum),
        };
      },
      log () {console.log(this.combineHSL(this.testOldHsl, this.testNewHsl))}
 */


}

