export const colourMaker= () => {
    const swatches = {
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
      } ;
      const operations = {
        'multiply': (oldVal, newVal) =>  oldVal * newVal,
        'add': (oldVal, newVal) =>  oldVal + newVal,
        'subtract': (oldVal, newVal) =>  oldVal - newVal,
        'divide': (oldVal, newVal) =>  oldVal / newVal,
        'replace': (oldVal, newVal) =>  newVal,
        'keep': (oldVal, newVal) =>  oldVal
      } ;
      const combineHSL = ({hue,sat,lum},{newHue = undefined, newSat = undefined, newLum = undefined, operation = 'add'}) => {
        return {
          hue: (!newHue)? hue: operations[operation](hue,newHue),
          sat: (!newSat)? sat: operations[operation](sat,newlum),
          lum: (!newLum)? lum: operations[operation](lum,newlum),
        };
      };
      const testOldHsl = {hue: 1, sat: 2, lum: 3};
      const testNewHsl = {newHue: 4, operation: 'divide'};
      console.log(combineHSL(testOldHsl, testNewHsl));

}

