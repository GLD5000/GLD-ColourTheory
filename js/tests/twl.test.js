import { colourspace } from "../modules/utilities/colourmodules/colourspace.js";
function sum(...args) {
  console.log(args);
  return args[0] + args[1];
}
function newTest(fn, object, option, result) {
  test(`${fn.name}(${object.name}).${option} = ${result}`, () => {
    expect(fn(object)[option]).toBe(result);
  });
}
function testloop(object, array, fn) {
  array.forEach((entry) => {
    newTest(fn, object, entry[0], entry[1]);
  });
}
const whiteObject = { name: "white", tint: 0.5, warmth: 0.5, lightness: 1 };
const whiteResults = [
  ["red", 1],
  ["blue", 1],
  ["green", 1],
];
testloop(whiteObject, whiteResults, colourspace._convertTwlToSrgb);

const blackObject = { name: "black", tint: 0, warmth: 0, lightness: 0 };
const blackResults = [
  ["red", 0],
  ["blue", 0],
  ["green", 0],
];
testloop(blackObject, blackResults, colourspace._convertTwlToSrgb);

const redObject = { name: "red", tint: 0, warmth: 1, lightness: 1 };
const redResults = [
  ["red", 1],
  ["blue", 0],
  ["green", 0],
];
testloop(redObject, redResults, colourspace._convertTwlToSrgb);

const blueObject = { name: "blue", tint: 0, warmth: 0, lightness: 1 };
const blueResults = [
  ["red", 0],
  ["blue", 1],
  ["green", 0],
];
testloop(blueObject, blueResults, colourspace._convertTwlToSrgb);

const greenObject = { name: "green", tint: 1, warmth: 1, lightness: 1 };
const greenResults = [
  ["red", 0],
  ["blue", 0],
  ["green", 1],
];
testloop(greenObject, greenResults, colourspace._convertTwlToSrgb);

const yellowObject = { name: "yellow", tint: 0.5, warmth: 1, lightness: 1 };
const yellowResults = [
  ["red", 1],
  ["blue", 0],
  ["green", 1],
];
testloop(yellowObject, yellowResults, colourspace._convertTwlToSrgb);

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
];
testloop(turquoiseObject, turquoiseResults, colourspace._convertTwlToSrgb);

const turquoiseObjectB = { name: "turquoise", red: 0, blue: 1, green: 1 };
const turquoiseResultsB = [
  ["tint", 1],
  ["warmth", 0.5],
  ["lightness", 1],
];
testloop(turquoiseObjectB, turquoiseResultsB, colourspace._convertSrgbToTwl);
