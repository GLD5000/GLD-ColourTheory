import { colourspace } from "../modules/utilities/colourmodules/colourspace.js";
import { colourObject } from "../modules/utilities/colourobject.js";
function sum(...args) {
  console.log(args);
  return args[0] + args[1];
}
function newTest(testFunction, object, resultKey, resultValue) {
  test(`${testFunction.name}(${object.name}).${resultKey} = ${resultValue}`, () => {
    expect(testFunction(object)[resultKey]).toBe(resultValue);
  });
}
function equalityTest(
  a,
  b,
  name = "Unnamed",
  objectName = "Unknown Colour",
  functionName = "Equality test"
) {
  function testHandler(a, b) {
    return a === b;
  }
  test(`${functionName} ${objectName} ${name} ${a} = ${b}`, () => {
    expect(testHandler(a, b)).toBe(true);
  });
}

function testLoop(object, array, fn) {
  array.forEach((entry) => {
    const newObject = { ...object };
    newTest(fn, newObject, entry[0], entry[1]);
  });
}
function testLoopB(object, array, fn) {
  const testObject = fn(object);

  array.forEach((entry) => {
    equalityTest(
      testObject[entry[0]],
      entry[1],
      entry[0],
      object.name,
      fn.name
    );
  });
}
function testLoopReverse({
  name = "Anon",
  inputs = [],
  outputs = [],
  functionA,
  functionB,
}) {
  testLoop(arrayA, arrayB, fn);
  testLoop(arrayB, arrayA, fnB);
}
const whiteObject = { name: "white", tint: 0.5, warmth: 0.5, lightness: 1 };
const whiteResults = [
  ["red", 1],
  ["blue", 1],
  ["green", 1],
  ["hue", 0],
  ["sat", 0],
  ["lum", 100],
];
testLoopB(whiteObject, whiteResults, colourObject.fromTwl);

const blackObject = { name: "black", tint: 0, warmth: 0, lightness: 0 };
const blackResults = [
  ["red", 0],
  ["blue", 0],
  ["green", 0],
  ["hue", 0],
  ["sat", 0],
  ["lum", 0.001],
];
testLoopB(blackObject, blackResults, colourObject.fromTwl);

const redObject = { name: "red", tint: 0, warmth: 1, lightness: 1 };
const redResults = [
  ["red", 1],
  ["blue", 0],
  ["green", 0],
  ["hue", 0],
  ["sat", 100],
  ["lum", 50],
];
testLoopB(redObject, redResults, colourObject.fromTwl);

const blueObject = { name: "blue", tint: 0, warmth: 0, lightness: 1 };
const blueResults = [
  ["red", 0],
  ["blue", 1],
  ["green", 0],
  ["hue", 240],
  ["sat", 100],
  ["lum", 50],
];
testLoopB(blueObject, blueResults, colourObject.fromTwl);

const greenObject = { name: "green", tint: 1, warmth: 1, lightness: 1 };
const greenResults = [
  ["red", 0],
  ["blue", 0],
  ["green", 1],
  ["hue", 120],
  ["sat", 100],
  ["lum", 50],
];
testLoopB(greenObject, greenResults, colourObject.fromTwl);

const yellowObject = { name: "yellow", tint: 0.5, warmth: 1, lightness: 1 };
const yellowResults = [
  ["red", 1],
  ["blue", 0],
  ["green", 1],
  ["hue", 60],
  ["sat", 100],
  ["lum", 50],
];
testLoopB(yellowObject, yellowResults, colourObject.fromTwl);

const turquoiseObject = {
  name: "turquoise",
  tint: 1,
  warmth: 0.5,
  lightness: 1,
};
const turquoiseResults = [
  ["red", 0],
  ["blue", 1],
  ["green", 1],
  ["hue", 180],
  ["sat", 100],
  ["lum", 50],
];
testLoopB(turquoiseObject, turquoiseResults, colourObject.fromTwl);

const turquoiseObjectB = { name: "turquoise", red: 0, blue: 1, green: 1 };
const turquoiseResultsB = [
  ["tint", 1],
  ["warmth", 0.5],
  ["lightness", 1],
  ["hue", 180],
  ["sat", 100],
  ["lum", 50],
];
testLoopB(turquoiseObjectB, turquoiseResultsB, colourObject.fromSrgb);

const newColour = colourObject.fromHex({ name: "turquoise", hex: "#4CD6C6" });
newTest(
  colourObject.makeTextColour,
  { backgroundColour: newColour },
  "contrastString",
  "Contrast Ratio: 11.74 AAA+"
);
