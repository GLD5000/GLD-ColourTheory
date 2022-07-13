import {Colour} from './modules/classes/colour.js';
import {ColourBackground} from './modules/classes/colourbackground.js';
import {ColourSimple} from './modules/classes/coloursimple.js';
import { ImmutableObject } from './modules/classes/immutableobject.js';
import { throttle } from './modules/classes/throttledebounce.js';
import {debounce} from './modules/classes/throttledebounce.js';
//const test = new ImmutableObject({hex:'#000',sat:100});
//console.log(test.hex);
//console.log(test);
let pureSum = (...args) => [...args].reduce((acc, current) => acc + current);

console.log(pureSum(1,2,3));

const loggerWrapper = (callbackFunction) => {
  let outerCounter = 0;
  return (...args) => {
    console.log(`Called ${callbackFunction.name} function ${++outerCounter} times.`);
    return (callbackFunction(...args));
  }
};

pureSum = loggerWrapper(pureSum);

const arr = Object.keys([...Array(10)]);

let count = 0;

arr.forEach(x => console.log(pureSum(3, parseInt(x) + 1)));

function hello(message){
  const dateMs = Date.now()/100000
  const seconds = ((dateMs - parseInt(dateMs)) *100).toFixed(2) ;
  console.log(`${message}   
  ${seconds} seconds`);
  return message;
}

const db = throttle((x) => hello(x));
  db('initial state');

for (let i = 0; i < 10; i++){
  db('intermediateeeee state');
};
  db('final state');




const test = new ImmutableObject({hex:'#000',sat:100});
console.log(test.hex);
console.log(test);
const maths = {
  '*': (a,b) =>  a * b,
  '+': (a,b) =>  a + b,
  '-': (a,b) =>  a - b,
  '/': (a,b) =>  a / b
}
console.log(maths['+'](2,4));



const colour_picker = document.getElementById('primaryColour-picker');
const colour_picker_wrapper = document.getElementById('primaryColour-wrapper');
const colour_picker_hex_label = document.getElementById('primaryColour-copybtn');
const pickers = document.querySelectorAll('input[type="color"]');
const buttons = document.querySelectorAll('button');

class CopyButton{
  constructor(name) {
    this._name = name;
    this._colourSpace = 'hex';
    this._styleSheetType = 'css';
    this._element = document.getElementById(name + '-copybtn');
    //add mode logic for SCSS/CSS Toggle
    this._prefixScss = `\$`;
    this._prefixCss = `--`;
    //get clipboard information from all colours/gradients
    this._text = 'test'
    this._element.onclick = () =>{this._onClick()};
  }
  _onClick(){
    navigator.clipboard.writeText(this._text);
    alert(`Copied To Clipboard:\n${this._text}`);

  };
  get text(){
    return this._text;
  }
  set text(x){
    this._text = x;
    this._element.innerHTML = x;
  }
}

class SmallSwatch{
  static instanceCounter = 0;
  constructor(name, property, propertyAdjustment) {
    this._name = name;
    this._property = property;
    this._propertyAdjustment = propertyAdjustment;
    this._picker = document.getElementById(name + '-picker');
    this._wrapper = document.getElementById(name + '-wrapper');
    this._copyButton = new CopyButton(name);
    this._colourBackground = new ColourBackground({name: name, hex: this._picker.value});
    this._colourBackground[property] += propertyAdjustment;
    this._colourBackgroundCustom = new Colour('custom',{hex: this._picker.value});
    this._colourText = new Colour(name + 'Text',{hex: '#000'});

    this._updateBackgroundColour(this._picker.value);
    this._setOnChange();
    this._wrapper.dataset.content = this._name;
    this._customised = 0;


  }
  _updateBackgroundColour(hex) {
    this._picker.value = hex;
    this._wrapper.style.backgroundColor = hex; 
    //contrast ratio
    this._copyButton.text = hex;
  }
  _updateTextColour(hex) {
    this._wrapper.style.color = hex; 
    //contrast ratio
  }
  _setOnChange() {
    this._picker.onclick = () =>{this._onClickPicker()};
    this._picker.oninput = () =>{this._onChangePicker()};
    this._copyButton.onclick = () =>{this._onChange()};
  }
  _onChange(e) {
    console.log(e);
  }
 _onClickPicker() {
  if(this._customised === 1) {
    this._wrapper.dataset.content = `${this._colourBackgroundCustom.name}`;
    this._picker.value = this._colourBackgroundCustom.hex;
    this._updateBackgroundColour(this._picker.value);
  }
  }

  _onChangePicker() {
    if(this._customised === 0) {
      this._colourBackgroundCustom.name = 'custom ' + ++SmallSwatch.instanceCounter;
      this._customised = 1;
    }
    this._wrapper.dataset.content = `${this._colourBackgroundCustom.name}`;
    this._colourBackgroundCustom.hex = this._picker.value;
    this._updateBackgroundColour(this._picker.value);
  }
  changeSwatchColour(hex) {
    this._colourBackground.hex = hex;
    this._colourBackground[this._property] += this._propertyAdjustment;
    this._wrapper.dataset.content = this._name;
    this._updateBackgroundColour(this._colourBackground.hex);
  }
  changeSwatchTextColour(hex) {
    this._colourText.hex = hex;
    this._updateTextColour(hex);
  }

}
class SmallSwatchesGroup{
  constructor() {
    this._smallSwatchList ={
      analogousA:  ['hue',-30],
      analogousB:   ['hue', 30],
      triadicA:    ['hue', -120],
      triadicB:    ['hue', 120],
      tetradicA:   ['hue', 90],
      tetradicB:   ['hue', 180],
      tetradicC:   ['hue', 270],
      monochromeA:   ['lum', -10],
      monochromeB:   ['lum', 10],
      neutral:    ['sat', -200],
    }
    this._smallSwatches = Object.keys(this._smallSwatchList).map(x => new SmallSwatch(x, this._smallSwatchList[x][0], this._smallSwatchList[x][1]));
    
  }
  updateSwatches(hex) {
    this._smallSwatches.forEach(x =>{
      x.changeSwatchColour(hex)
      });

  }
  updateSwatchesText(hex) {
    this._smallSwatches.forEach(x =>{
      x.changeSwatchTextColour(hex)
      });

  }
} 
class ColoursSingleton{
  constructor(string) {
    if (ColoursSingleton.instance === undefined) {
      this.holla = string;
      this.hoeflla = 'Holla World';
      ColoursSingleton.instance = this;
    }
    return ColoursSingleton.instance;
  }
}
class PrimarySwatch{
  constructor(name) {
    // init
    this._getElements(name);
    this._smallSwatchesGroup = new SmallSwatchesGroup();

    this._setOnChange();
    this._colourBackground = new ColourBackground({stops: 10, name: name, hex: '#e68f75'});
    this._colourBackground.randomise();
    this._colourText = new ColourBackground({name: name + 'Text', hex: '#000'});
    this._updateBackgroundColour(this._colourBackground.hex);
    this._throttledUpdate = throttle(() => this._updateBackgroundColour(),65);
    this._randomDiceColours();
  }
  get hex() { 
    return this._colourBackground.hex;
  }
  _getElements(name) {
        //elements
        this._hueSlider = document.getElementById('hue-slider');
        this._satSlider = document.getElementById('sat-slider');
        this._lumSlider = document.getElementById('lum-slider');
        this._picker = document.getElementById(name + '-picker');
        this._copyButton = new CopyButton(name);
        this._textPicker = document.getElementById('textColour-picker');
        this._textWrapper = document.getElementById('textColour-wrapper');
        this._modeButton = document.getElementById(name + '-mode');
        this._randomButton = document.getElementById('randomise-btn');
        this._diceButton = document.getElementById('dice-btn');
        this._dieA = document.getElementById('dieA');
        this._dieB = document.getElementById('dieB');
        this._wrapper = document.getElementById(name + '-wrapper');
        //Random dice
        [this._textColour, this._contrastRatio] = [...this._autoTextColour(this._picker.value)];
  }
  _updateBackgroundColour(hex) {
    this._picker.value = this._colourBackground.hex;
    //console.log(this._colourBackground.backgroundString);
    this._wrapper.style.background = this._colourBackground.backgroundString;
    //console.log(this._wrapper);

    [this._colourText.hex, this._contrastRatio] = [...this._autoTextColour(this._colourBackground.red, this._colourBackground.green, this._colourBackground.blue)];
    // update contrast Ratio text
    this._wrapper.dataset.content = this._makeContrastRatioString(this._contrastRatio);
    // set text colour
    this._wrapper.style.color = this._colourText.hex; 
    // Update text picker button text
    this._textWrapper.dataset.content = 'Text: Auto';
    this._updateSliders();    
    this._smallSwatchesGroup.updateSwatches(this._colourBackground.hex);
    this._smallSwatchesGroup.updateSwatchesText(this._colourText.hex);
    this._copyButton.text = this._colourBackground.hex;

  }
  _updateSliders(){
    [this._hueSlider.value,this._satSlider.value,this._lumSlider.value] = [this._colourBackground.hue, this._colourBackground.sat, this._colourBackground.lum];
  }
  _setOnChange() {
    this._hueSlider.oninput = () =>{this._onChangeSliderHue()};
    this._satSlider.oninput = () =>{this._onChangeSliderSat()};
    this._lumSlider.oninput = () =>{this._onChangeSliderLum()};
    this._picker.oninput = () =>{this._onChangePicker()};
    this._textPicker.oninput = () =>{this._onChangeTextPicker()};
    this._modeButton.onchange = () =>{this._onChange()};
    this._randomButton.onclick = () => {this._randomise()};
    this._diceButton.onclick = () => {this._randomise()};
    
  }
  _onChange() {
    console.log('sddodslsldlsd');
  }
  _onChangeSliderHue() {
    this._colourBackground.hue = this._hueSlider.value;
    this._throttledUpdate();
  }
  _onChangeSliderSat() {
    this._colourBackground.sat = this._satSlider.value;
    this._throttledUpdate();
  }
  _onChangeSliderLum() {
    this._colourBackground.lum = this._lumSlider.value;
    this._throttledUpdate();
  }
  _onChangePicker() {
    this._colourBackground.hex = this._picker.value;

    this._throttledUpdate();
  }
  _onChangeTextPicker() {
    this._colourText.hex = this._textPicker.value;
    // update contrast ratio
    this._contrastRatio = this._calculateContrastRatio(this._colourText,this._colourBackground);
    // update contrast Ratio text
    this._wrapper.dataset.content = this._makeContrastRatioString(this._contrastRatio);
    // set text colour
    this._wrapper.style.color = hex; 
    // Update text picker button text
    this._textWrapper.dataset.content = 'Text: Custom'//Text: Auto;
    
  }
  _autoTextColour(red, green, blue) {
    let contrastBlack = this._calculateContrastRatio([0,0,0],[red, green, blue]);
    let contrastWhite = this._calculateContrastRatio([1,1,1],[red, green, blue]);
    let autoColour = (contrastBlack > contrastWhite)? '#000': '#fff';
    let autoContrast = Math.max(contrastBlack,contrastWhite);
    return [autoColour, autoContrast];
  }
  _calculateRelativeLuminance(RsRGB, GsRGB, BsRGB) {
    const R = (RsRGB <= 0.04045)? RsRGB/12.92: Math.pow((RsRGB+0.055)/1.055, 2.4);
    const G = (GsRGB <= 0.04045)? GsRGB/12.92: Math.pow((GsRGB+0.055)/1.055, 2.4);
    const B = (BsRGB <= 0.04045)? BsRGB/12.92: Math.pow((BsRGB+0.055)/1.055, 2.4);
    
    return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
  }
  _calculateContrastRatio(...args) {
    /*A contrast ratio of 3:1 is the minimum level recommended by [[ISO-9241-3]] and [[ANSI-HFES-100-1988]] for standard text and vision. 
    Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;
    */
    const relativeLumArr = args.map(x => this._calculateRelativeLuminance(...x)); 
    const L1 = Math.max(...relativeLumArr);
    const L2 = Math.min(...relativeLumArr);
    return (L1 + 0.05) / (L2 + 0.05);
  }
  _makeContrastRatioString(ratio) {
    const rating = (ratio > 4.5)? (ratio > 7)? 'AAA+': 'AA+' : 'Low';
    return `Contrast Ratio: ${ratio.toFixed(2)}${rating}`;
  }
  _makeRandomHsl() {
    const hue = parseInt(Math.random() * 360);
    const sat = 48 + parseInt(Math.random() * 40); // 48 - 87
    const lum = 53 + parseInt(Math.random() * 35); // 53 - 87
    return `hsl(${Math.round(hue)},${sat.toFixed(1)}%,${lum.toFixed(1)}%)`//this._convertHslToHex(hue, sat, lum);
  }
  _randomDiceColours() {
    this._dieA.style.backgroundColor = this._makeRandomHsl();    
    this._dieB.style.backgroundColor = this._makeRandomHsl();    
  }
  _randomise() {
    this._colourBackground.randomise();
    this._throttledUpdate();
    this._randomDiceColours();
  }
}
class Palette{
  constructor() {
    
    this._primaryColourSwatch = new PrimarySwatch('primaryColour');
  }
  
}

class MultiplierStops{  
  constructor(stops,multiplier) {
    const halfStops = 0.5 * stops;
    this._even = (stops % 2 === 0)? 1: 0;
    this._powerArr = [...Array(stops)].map((x,i,arr) => arr[i] = multiplier ** (((i + 1 > halfStops)? this._even: 0) + i - Math.floor(halfStops)));
  }
}


class SuffixStops{
  constructor(stops) {
    this._stops = Math.min(Math.max(2, stops),10);
    this._names = {
      2: ['light','dark'],
      3: ['light','normal','dark'],
      4: ['lighter','light','dark','darker'],
      5: ['lighter','light','normal','dark','darker'],
      6: ['lightest','lighter','light','dark','darker','darkest'],
      7: ['lightest','lighter','light','normal','dark','darker','darkest'],
      8: ['100','200','300','400','500','600','700','800'],
      9: ['100','200','300','400','500','600','700','800','900'],
      10: ['50','100','200','300','400','500','600','700','800','900'],
      
    }
    this._suffixesArr = this._suffixise(this._names[stops]);

  }
  _suffixise(arr) {
    return arr.map(x => `-${x}`);
  }
}
class ColourMultiGradient{
  constructor(hex,name,stops) {
    this._name = name;
    //[this._hue,this._sat,this._lum] = [colourSpaces.hsl.hue,colourSpaces.hsl.sat,colourSpaces.hsl.lum];
    this._suffixes = this._getStops(stops);
    //for stops loop
  }
  _getStops(stops, lumMultiplier, satMultiplier) {
    const lumMultiplierReverse = 1 / lumMultiplier;
    const satMultiplierReverse = 1 / satMultiplier;
    const stopsLimited = Math.min(Math.max(2, stops), 10);
    const stopInformation = {
      2: {suffixes: ['light','dark'],
          lumMultipliers: [lumMultiplierReverse,lumMultiplier],
          satMultipliers: [satMultiplierReverse,satMultiplier],
      },
      3: {suffixes: ['light','main','dark'],
      lumMultipliers: [lumMultiplierReverse,lumMultiplier],
      satMultipliers: [satMultiplierReverse,satMultiplier],
  },

    }
    const suffixArr = ['-50: ', '-100: ', '-200: ', '-300: ', '-400: ', '-500: ', '-600: ', '-700: ', '-800: ', '-900: '];
    const suffixArrShort = ['-50: ', '-100: ', '-200: ', '-300: ', '-400: ', '-500: ', '-600: ', '-700: ', '-800: ', '-900: '];
    return suffixArr.splice(5 - Math.floor(stopsLimited * 0.5), stopsLimited);
  }
}
class ColourAutoText extends Colour{
  constructor(srgbArr) {
    super();
    this.contrastBlack = this._calculateContrastRatio([0,0,0],srgbArr);
    this.contrastWhite = this._calculateContrastRatio([1,1,1],srgbArr);
    this.autoColour = (this.contrastBlack > this.contrastWhite)? '#000': '#fff';
    this.autoContrast = Math.max(this.contrastBlack,this.contrastWhite);
  }
}
function updateLabels() {
  const isHex = (document.getElementById('HSLToggle').innerHTML === 'Hex');

  if (isHex === true) {
    buttons.forEach(x =>{
      const id = x.id;
      if (id !== 'copyAllCSS' && id !== 'SCSSToggle' && id !== 'HSLToggle' && id !== 'randomise-btn' && id !== 'dice-btn' && id !== 'mode') {//All Colour label buttons
        let name = id.split('-')[0];
        let picker = name + '-picker';
        x.innerHTML = document.getElementById(picker).value;
      }
    });
  }else{
    buttons.forEach(x =>{
      const id = x.id;
      if (id !== 'copyAllCSS' && id !== 'SCSSToggle' && id !== 'HSLToggle' && id !== 'randomise-btn' && id !== 'dice-btn' && id !== 'mode') {//All Colour label buttons
        let name = id.split('-')[0];
        let picker = name + '-picker';
        x.innerHTML = hexToHSLString(document.getElementById(picker).value);
      }
    });
  }
  fillClipboard();
}
function setTextColour(colour) {
  const textPicker = document.getElementById('textColour-picker');
  const whiteRatio = contrastRatio('#fff', colour);
  const blackRatio = contrastRatio('#000', colour);
  const textColour = (blackRatio > whiteRatio)? '#000000': '#ffffff';
  const ratio = (blackRatio > whiteRatio)? blackRatio: whiteRatio;
  const rating = (ratio > 4.5)? (ratio > 7)? 'AAA+': 'AA+' : 'Low';
  colour_picker_wrapper.dataset.content =`Contrast Ratio: ${ratio.toFixed(2)}${rating}`;
  textPicker.value = textColour;
  document.getElementById('textColour-wrapper').dataset.content = 'Text: Auto';
  return textColour;
}
function customTextColour() {
  const textPicker = document.getElementById('textColour-picker');
  const textColour = textPicker.value;
  const primaryColour = colour_picker.value;
  const ratio = contrastRatio(textColour, primaryColour);
  const rating = (ratio > 4.5)? (ratio > 7)? 'AAA+': 'AA+' : 'Low';
  colour_picker_wrapper.dataset.content =`Contrast Ratio: ${ratio.toFixed(2)}${rating}`;
  //colour_picker_wrapper.style.color = textColour;
  document.getElementById('textColour-wrapper').dataset.content = 'Text: Custom' ;

  pickers.forEach((x, i) =>{
    const name = pickers[i].id.split('-')[0];
    if (name === 'textColour') return;
    const wrapper = document.getElementById(name + '-wrapper');
    wrapper.style.color = textColour;
  });


}
function swatchModeSelector(hex, modeValue) {
  if (modeValue === 'Mode: Single') {

    return hex;
  }else if (modeValue === 'Mode: Triple') {

    return linearGradientThreeTone(hex);
  }else if (modeValue === 'Mode: Multi') {
    return linearGradientMultiTone(hex);
  }
}
function updateColour() {
  let primaryColourLabel, analogousAColourLabel, analogousBColourLabel, triadicAColourLabel, triadicBColourLabel, tetradicAColourLabel, tetradicBColourLabel, tetradicCColourLabel, monochromeAColourLabel, monochromeBColourLabel, neutralColourLabel;
  const modeValue = document.getElementById('primaryColour-mode').innerHTML;    
  const isHex = (document.getElementById('HSLToggle').innerHTML === 'Hex');
  const primaryColour = colour_picker.value;
  const textColour = setTextColour(primaryColour);
  function getColour(name) {
    if (name === 'primaryColour') { return primaryColour;
    }else if (name === 'analogousA') { return hueRotateHEX(primaryColour, -30);
    }else if (name === 'analogousB') { return hueRotateHEX(primaryColour, 30);
    }else if (name === 'triadicA') { return hueRotateHEX(primaryColour, -120);
    }else if (name === 'triadicB') { return hueRotateHEX(primaryColour, 120);
    }else if (name === 'tetradicA') { return hueRotateHEX(primaryColour, 90);
    }else if (name === 'tetradicB') { return hueRotateHEX(primaryColour, 180);
    }else if (name === 'tetradicC') { return hueRotateHEX(primaryColour, 270);
    }else if (name === 'monochromeA') { return lumAdjustHEX(primaryColour, -10);
    }else if (name === 'monochromeB') { return lumAdjustHEX(primaryColour, 10);
    }else if (name === 'neutral') { return satAdjustHEX(primaryColour, -200);}
  }
  pickers.forEach((x, i) =>{
    const name = pickers[i].id.split('-')[0];
    if (name === 'textColour') return;
    const wrapper = document.getElementById(name + '-wrapper');
    const label = document.getElementById(name + '-copybtn');
    const colourName = name + 'Colour';
    const colour = getColour(name);//coloursArr[i];
    pickers[i].value = colour;
    wrapper.style.background = swatchModeSelector(colour, modeValue);  
    wrapper.style.color = textColour;
    label.innerHTML = (isHex)?colour:hexToHSLString(colour);
  });
  fillClipboard();
}
function linearGradientThreeTone(hex) {
  const variantA = lumAdjustHEX(hex, 13);
  const variantB = lumAdjustHEX(hex, -13);
  const gradient = `linear-gradient(to top, #000 1px, ${hex}1px, ${hex}) 0% 0% / 100% 70% no-repeat, linear-gradient(to right, ${variantA}50%, #000 50%, ${variantB}50%) 0% 50% / 100% 30%`;
  /*
  `linear-gradient(to top, #000 1px, ${hex}1px, ${hex}) 0% 0% / 100% 70% no-repeat, linear-gradient(to left, ${variantA}50%, #000 50%, #000 calc(50% + 1px), ${variantB}calc(50% + 1px)) 0% 50% / 100% 30%`
  */
  return gradient;
}
function stableCounter(counter, inc) {//pass through outer variable to inner

  function innerIncrement() {
    counter += inc;
    return counter;
  }

  return innerIncrement;
}
function variableCounter(counter) {//pass through outer variable to inner

  function innerIncrement(inc) {
    counter += inc;
    return counter;
  }

  return innerIncrement;
}
function functionBox(init, func, amount) {
  let operation;
  let counter = init;
  if (func === '*') operation = (x, y) => x * y;
  else if (func === '/') operation = (x, y) => x / y;
  else if (func === '+') operation = (x, y) => x + y;
  else if (func === '-') operation = (x, y) => x - y;

  function innerFunction() {
    counter = operation(counter, amount);
    return counter;
  }
  return innerFunction;
}
function hslLumGradient(hex, luminance, func, amount) {
  let operation;
  if (func === '*') operation = (x, y) => x * y;
  else if (func === '/') operation = (x, y) => x / y;
  else if (func === '+') operation = (x, y) => x + y;
  else if (func === '-') operation = (x, y) => x - y;

  function innerFunction() {
    luminance = operation(luminance, amount);
    return lumChangeHex(hex, luminance);
  }
  return innerFunction;
}
function hslMultStrFixed(hex, multHue, multSat, multLum) {
  //Returns hsl string from multiplication of hsl values
  //repeatable due to closure
  const hsl = hexToHSL(hex);
  let hue = hsl[0];
  let sat = hsl[1];
  let lum = hsl[2];
  function innerFunction() {
    hue = Math.min(Math.max(0, hue * multHue), 360).toFixed(0);
    sat = Math.min(Math.max(0, sat * multSat), 100).toFixed(1);
    lum = Math.min(Math.max(0, lum * multLum), 100).toFixed(1);
      return [hue, sat, lum];
  }
  return innerFunction;
}
function stringifyHsl(args) {
 // const [hue, sat, lum] = [args[0], args[1], args[2]];
  const [hue, sat, lum] = [...args];
 return `hsl(${hue}, ${sat}%, ${lum}%)`;

}
function hslMultStrVariable(hex) {
  //Returns hsl string from multiplication of hsl values
  //repeatable due to closure
  const hsl = hexToHSL(hex);
  let hue = hsl[0];
  let sat = hsl[1];
  let lum = hsl[2];
  function innerFunction(multHue, multSat, multLum) {
    hue = Math.min(Math.max(0, hue * multHue), 360);
    sat = Math.min(Math.max(0, sat * multSat), 100);
    lum = Math.min(Math.max(0, lum * multLum), 100);
      return `hsl(${hue}, ${sat}%, ${lum}%)`;
  }
  return innerFunction;
}
function functionBoxB(func, amount) {
  let operation;
  if (func === '*') operation = (x, y) => x * y;
  else if (func === '/') operation = (x, y) => x / y;
  else if (func === '+') operation = (x, y) => x + y;
  else if (func === '-') operation = (x, y) => x - y;

  function innerFunction(x) {
    return operation(x, amount);
  }
  return innerFunction;
}
const xAddTwo = functionBox(100, '*', .9);
const counter = stableCounter(2, 5);
const counterB = variableCounter(3);
function hexToHue(H) {
  // Convert hex to rgb first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = '0x' + H[1] + H[1];
    g = '0x' + H[2] + H[2];
    b = '0x' + H[3] + H[3];
  }else if (H.length == 7) {
    r = '0x' + H[1] + H[2];
    g = '0x' + H[3] + H[4];
    b = '0x' + H[5] + H[6];
  }
  // Then to hsl
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

    return h;
}
function linearGradientMultiTone(hex) {
  const luminance = 95;
  const lumMult = 0.905; 
  const satMult = 1.05;
  const variantDec = hslMultStrFixed(lumChangeHex(hex, luminance), 1, satMult, lumMult);
  const gradient = `linear-gradient(to top, #000 1px, ${hex}1px, ${hex}) 0% 0% / 100% 70% no-repeat, 
  linear-gradient(to right,
     ${stringifyHsl(variantDec())}10%, #000 10%, #000 10%,
     ${stringifyHsl(variantDec())}10% 20%, #000 20%, #000 20%, 
     ${stringifyHsl(variantDec())}20% 30%, #000 30%, #000 30%, 
     ${stringifyHsl(variantDec())}30% 40%, #000 40%, #000 40%, 
     ${stringifyHsl(variantDec())}40% 50%, #000 50%, #000 50%,
     ${stringifyHsl(variantDec())}50% 60%, #000 60%, #000 60%, 
     ${stringifyHsl(variantDec())}60% 70%, #000 70%, #000 70%, 
     ${stringifyHsl(variantDec())}70% 80%, #000 80%, #000 80%, 
     ${stringifyHsl(variantDec())}80% 90%, #000 90%, #000 90%, 
     ${stringifyHsl(variantDec())}90%) 0% 50% / 100% 30%`;

  return gradient;
}
function fillClipboard() {
  const clipboard = document.getElementById('clipboard');
  const clipboardSecondary = document.getElementById('clipboard-secondary');
  const modeValue = document.getElementById('primaryColour-mode').innerHTML;    
  const isHex = (document.getElementById('HSLToggle').innerHTML === 'Hex');
  clipboardSecondary.style.color = isHex? '#ce9178': '#b5cea8';
  const isSCSS = (document.getElementById('SCSSToggle').innerHTML === 'SCSS');
  const clipboardArr = [[], [], []];
  [...pickers].forEach(x =>{
    let prefix = isSCSS?`$`:`--`
    let name = x.id.split('-')[0];
    let label;
    const hex = x.value;

    if (name === 'textColour') {
      label = isHex? document.getElementById('textColour-picker').value: hexToHSLString(document.getElementById('textColour-picker').value);
    }else{
      label = document.getElementById(name + '-copybtn').innerHTML;
    }
    let variable = prefix + name;
    clipboardArr[0].push(`${variable}: ${label};`);
    clipboardArr[1].push(`${variable}:`);
    clipboardArr[2].push(`${label};`);
    if (modeValue === 'Mode: Triple' && name !== 'textColour') {
      const variantA = isHex? lumAdjustHEX(hex, 13): hexToHSLString(lumAdjustHEX(hex, 13));
      const variantB = isHex? lumAdjustHEX(hex, -13): hexToHSLString(lumAdjustHEX(hex, -13));
      clipboardArr[0].push(`${variable}-light: ${variantA};`);
      clipboardArr[1].push(`${variable}-light:`);
      clipboardArr[2].push(`${variantA};`);
  
      clipboardArr[0].push(`${variable}-dark: ${variantB};`);
      clipboardArr[1].push(`${variable}-dark:`);
      clipboardArr[2].push(`${variantB};`);

    }else if (modeValue === 'Mode: Multi' && name !== 'textColour') {
      let luminance = 95;
      const lumAdjustment = 6;
      const hex = x.value;
      if (isHex === true) {
        let val;
        const suffixArr = ['-50: ', '-100: ', '-200: ', '-300: ', '-400: ', '-500: ', '-600: ', '-700: ', '-800: ', '-900: '];
        const luminance = 95;
        const lumMult = 0.905; 
        const satMult = 1.05;
        const variantDec = hslMultStrFixed(lumChangeHex(hex, luminance), 1, satMult, lumMult);//not working
      
        suffixArr.forEach(x =>{
          val = hslToHex(...variantDec());//not working
          clipboardArr[0].push(`${variable}${x}${val}`);
          clipboardArr[1].push(`${variable}${x}`);
          clipboardArr[2].push(`${val};`);
          //luminance -= lumAdjustment;
          });

      }else{
        let val;
        const suffixArr = ['-50: ', '-100: ', '-200: ', '-300: ', '-400: ', '-500: ', '-600: ', '-700: ', '-800: ', '-900: '];
        const luminance = 95;
        const lumMult = 0.905; 
        const satMult = 1.05;
        const variantDec = hslMultStrFixed(lumChangeHex(hex, luminance), 1, satMult, lumMult);
      
        suffixArr.forEach(x =>{
          val = stringifyHsl(variantDec());
       
          clipboardArr[0].push(`${variable}${x}${val}`);
          clipboardArr[1].push(`${variable}${x}`);
          clipboardArr[2].push(`${val};`);
          });
      }
    
  
    
    }

  });
  // Set clipboard content
  clipboard.dataset.clipboard = clipboardArr[0].join('\n');
  // Set innerHTML text
  clipboard.innerHTML = clipboardArr[1].join('\n');;
  // Set ::after content element text
  clipboardSecondary.innerHTML = clipboardArr[2].join('\n');;
  
}
function copyAll() {
  const clipboard = document.getElementById('clipboard');
  const text = clipboard.dataset.clipboard;
  navigator.clipboard.writeText(text);
  alert(`Copied To Clipboard:\n${text}`);
}
function onChangepickers() {
  for (let i in pickers) {
    if (i > 0) { // skip the first one - primaryColour
      pickers[i].onchange = () =>{
        const isHex = (document.getElementById('HSLToggle').innerHTML === 'Hex');
        const name = pickers[i].id.split('-')[0];
        if (name === 'textColour') {
          fillClipboard();
          customTextColour();
        }else{
          const wrapper = name + '-wrapper';
          const label = name + '-copybtn';
          const colour = pickers[i].value;
          document.getElementById(wrapper).style.backgroundColor = colour;    
          document.getElementById(label).innerHTML = (isHex)?colour:hexToHSLString(colour);
          fillClipboard();
        }
      }
    }
  }
}
function copySingle(e) {
  let text = e.innerHTML;
    navigator.clipboard.writeText(text);
    alert('Copied: ' + text);
}
function toggleHsl(e) {
 if (e.innerHTML === 'Hex') {
  e.innerHTML = 'HSL';
  updateLabels();
 }else{
  e.innerHTML = 'Hex';
  updateLabels();
 }
}
function toggleScss(e) {
  if (e.innerHTML === 'SCSS') {
   e.innerHTML = 'CSS';
  }else{
   e.innerHTML = 'SCSS';
  }
  fillClipboard();

 }
function onClickButtons() {
  buttons.forEach(x =>{//Assign a function to each button onclick
    const id = x.id;
    if (id === 'copyAllCSS') x.onclick = () => copyAll();
    if (id === 'SCSSToggle') x.onclick = () => toggleScss(x);
    if (id === 'HSLToggle') x.onclick = () => toggleHsl(x);
  //  if (id === 'randomise-btn') x.onclick = () => randomise();
    //if (id === 'dice-btn') x.onclick = () => randomise();
    if (id === 'mode') x.onclick = () => switchColourMode();
    if (id !== 'copyAllCSS' && id !== 'SCSSToggle' && id !== 'HSLToggle' && id !== 'randomise-btn' && id !== 'dice-btn' && id !== 'mode') x.onclick = () => copySingle(x);
  }); 
 
}
function onLoad() {
  
  onClickButtons();
  const palette = new Palette;
  console.log(palette);
  
/*
const randomButton = {
  _randomDiceColours() {
    this._dieA = document.getElementById('dieA').style.backgroundColor = this._makeRandomColour();    
    this._dieB = document.getElementById('dieB').style.backgroundColor = this._makeRandomColour();    
  },
  _makeRandomColour() {
    const hue = parseInt(Math.random() * 360);
    const sat = 48 + parseInt(Math.random() * 40); // 48 - 87
    const lum = 53 + parseInt(Math.random() * 35); // 53 - 87
    return this._convertHslToHex(hue, sat, lum);
  },
  _convertHslToHex(hue, sat, lum) {
    sat /= 100;
    lum /= 100;
  
    let chroma = (1 - Math.abs(2 * lum - 1)) * sat,
        x = chroma * (1 - Math.abs((hue / 60) % 2 - 1)),
        lightness = lum - chroma/2,
        red = 0,
        green = 0, 
        blue = 0; 
  
    if (0 <= hue && hue < 60) {
      red = chroma; green = x; blue = 0;
    } else if (60 <= hue && hue < 120) {
      red = x; green = chroma; blue = 0;
    } else if (120 <= hue && hue < 180) {
      red = 0; green = chroma; blue = x;
    } else if (180 <= hue && hue < 240) {
      red = 0; green = x; blue = chroma;
    } else if (240 <= hue && hue < 300) {
      red = x; green = 0; blue = chroma;
    } else if (300 <= hue && hue <= 360) {
      red = chroma; green = 0; blue = x;
    }
    // Having obtained RGB, convert channels to hex
    red = Math.round((red + lightness) * 255).toString(16);
    green = Math.round((green + lightness) * 255).toString(16);
    blue = Math.round((blue + lightness) * 255).toString(16);
  
    // Prepend 0s, if necessary
    if (red.length == 1)
      red = '0' + red;
    if (green.length == 1)
      green = '0' + green;
    if (blue.length == 1)
      blue = '0' + blue;
  
    return '#' + red + green + blue;
  },
  _randomise() {
    this._randomDiceColours();
    primaryColourSwatch._updateBackgroundColour(this._makeRandomColour());
  },
  init() {
    this._button = document.getElementById('randomise-btn');
        this._button.onclick = () => {this._randomise()};
    this._diceButton = document.getElementById('dice-btn');
    this._diceButton.onclick = () => {this._randomise()};
    this._dieA = document.getElementById('dieA');
    this._dieB = document.getElementById('dieB');    
  }
}

randomButton.init();
*/


}
function randomise() {
  randomprimaryColour();
  updateColour();
  randomDiceColours();
}
function switchColourMode() {
  const modeSwitch = document.getElementById('primaryColour-mode');    
  const modeValue = modeSwitch.innerHTML; 
  if (modeValue === 'Mode: Single') {
    modeSwitch.innerHTML = 'Mode: Triple';
    updateColour();
  }else if (modeValue === 'Mode: Triple') {
    modeSwitch.innerHTML = 'Mode: Multi';
    updateColour();
  }else if (modeValue === 'Mode: Multi') {
    modeSwitch.innerHTML = 'Mode: Single';
    updateColour();
  }
  
  
  
  //alert('Swictchable modes coming soon');
}
function customColour(e) {
  let name = e.id.split('-')[0];
  let wrapper = name + '-wrapper';
  let colour = e.value;
  return document.getElementById(wrapper).style.backgroundColor = colour;    
}


window.onLoad = onLoad();

/*
//const testNewColour = new Colour('name',{hex: '#33dd66'});
//const testNewColour = new Colour('name',{red: 1, blue: 0.5, green: 0.2});
const testNewColour = new Colour('name',{hue: 0, sat: 50, lum: 50});
console.log(testNewColour.red);
testNewColour.hue += 100; 
console.log(testNewColour.red)

const testGradient = new ColourMultiGradient('#ddaa66','friendylyl',1);
console.log(testGradient);


const suffStops =new SuffixStops(5);
console.log(suffStops);

const multStops =new MultiplierStops(5,0.9);
console.log(multStops);


const testSingleton = new ColoursSingleton('yoyoy');
console.log(testSingleton);
const testSingletonb = new ColoursSingleton('wawawa');
console.log(testSingletonb);
*/