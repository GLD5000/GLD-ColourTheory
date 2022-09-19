const colourObject = require("../modules/utilities/colourobject.js");

const testColour = {name:'test colour', tint: Math.random().toFixed(2), warmth: Math.random().toFixed(2), lightness: Math.random().toFixed(2)};
const colourArray = [];//[`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`];
//colourArray.push('_convertTwltoSrgb');
colourObject._convertTwltoSrgb(testColour);
colourArray.push(`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
//colourArray.push('_convertSrgbtoTwl');
colourObject._convertSrgbtoTwl(testColour);
colourArray.push(`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
//colourArray.push('_convertTwltoSrgb');
colourObject._convertTwltoSrgb(testColour);
colourArray.push(`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
//colourArray.push('_convertSrgbtoTwl');
colourObject._convertSrgbtoTwl(testColour);
colourArray.push(`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
console.log(colourArray.join('\n'));