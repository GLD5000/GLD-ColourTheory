export const colourMaker= () => {
    console.log(`colour world is this`);
    const swatches = {
        analogousA: {hue:{operation: 'add', value:-30},sat:{operation: 'keep', value: null}, lum:{operation: 'keep', value: null}},// use defaults or pipe || to avoid repetition
        analogousB: ['hue', 30],
        triadicA: ['hue', -120],
        triadicB: ['hue', 120],
        tetradicA: ['hue', 90],
        tetradicB: ['hue', 180],
        tetradicC: ['hue', 270],
        monochromeA: ['lum', -10],
        monochromeB: ['lum', 10],
        neutral: ['sat', -200],
      } ;
      const operations = {
        'multiply': (oldVal, newVal) =>  oldVal * newVal,
        'add': (oldVal, newVal) =>  oldVal + newVal,
        'subtract': (oldVal, newVal) =>  oldVal - newVal,
        'divide': (oldVal, newVal) =>  oldVal / newVal,
        'replace': (oldVal, newVal) =>  newVal,
        'keep': (oldVal, newVal) =>  oldVal
      }
      
}