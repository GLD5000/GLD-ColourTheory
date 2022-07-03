import{ColourFunctions}from './modules/classes/colour.js';

const colour_picker = document.getElementById('primaryColour-picker');
const colour_picker_wrapper = document.getElementById('primaryColour-wrapper');
const colour_picker_hex_label = document.getElementById('primaryColour-copybtn');
const pickers = document.querySelectorAll('input[type="color"]');
const buttons = document.querySelectorAll('button');

class PickerWrapper{
  constructor(name, value){
    this._id = name + '-wrapper';
    this._element = document.getElementById(this._id);
    this._background = new PickerWrapperBackground(value,name)
    this._autoTextColour = new ColourAutoText([this._background.colour.srgb.red,this._background.colour.srgb.green,this._background.colour.srgb.blue]);

    this._element.style.background = value;// update to respond to types later
}
}

class SmallSwatch{
  static instanceCounter = 0;
  constructor(name, func, functionVariable){
    this._func = func;
    this._functionVariable = functionVariable;
    this._name = name;
    this._picker = document.getElementById(name + '-picker');
    this._wrapper = document.getElementById(name + '-wrapper');
    this._copyButton = document.getElementById(name + '-copybtn');
    this._updateBackgroundColour(this._picker.value);
    this._setOnChange();
    this._wrapper.dataset.content = this._name;
    this._customised = 0;


  }
  _updateBackgroundColour(hex){
    this._picker.value = hex;
    this._wrapper.style.backgroundColor = hex; 
    //contrast ratio
  }
  _updateTextColour(hex){
    this._wrapper.style.color = hex; 
    //contrast ratio
  }
  _setOnChange(){
    this._picker.onclick = () =>{this._onClickPicker()};
    this._picker.oninput = () =>{this._onChangePicker()};
    this._copyButton.onclick = () =>{this._onChange()};
  }
  _onChange(e){
    console.log(e);
  }
 _onClickPicker(){
  if(this._customised === 1) {
    this._wrapper.dataset.content = `${this._customName}`;
    this._picker.value = this._customBackgroundColour;
    this._updateBackgroundColour(this._picker.value);
  }
  }

  _onChangePicker(){
    if(this._customised === 0) {
      this._customName = 'custom ' + ++SmallSwatch.instanceCounter;
      this._customised = 1;
    }
    this._wrapper.dataset.content = `${this._customName}`;
    this._customBackgroundColour = this._picker.value;
    this._updateBackgroundColour(this._picker.value);
  }
  changeSwatchColour(hex){
    const modifiedHex = this._func(hex, this._functionVariable);
    this._wrapper.dataset.content = this._name;
    this._updateBackgroundColour(modifiedHex);
  }
  changeSwatchTextColour(hex){
    this._updateTextColour(hex);
  }

}
class SmallSwatchesGroup{
  constructor(){
    this._smallSwatchList ={
      analogousA:  [hueRotateHEX,-30],
      analogousB:   [hueRotateHEX, 30],
      triadicA:    [hueRotateHEX, -120],
      triadicB:    [hueRotateHEX, 120],
      tetradicA:   [hueRotateHEX, 90],
      tetradicB:   [hueRotateHEX, 180],
      tetradicC:   [hueRotateHEX, 270],
      monochromeA:   [lumAdjustHEX, -10],
      monochromeB:   [lumAdjustHEX, 10],
      neutral:    [satAdjustHEX, -200],
    }
    this._smallSwatches = Object.keys(this._smallSwatchList).map(x => new SmallSwatch(x, this._smallSwatchList[x][0], this._smallSwatchList[x][1]));
    
  }
  updateSwatches(hex){
    this._smallSwatches.forEach(x =>{
      x.changeSwatchColour(hex)
      });

  }
  updateSwatchesText(hex){
    this._smallSwatches.forEach(x =>{
      x.changeSwatchTextColour(hex)
      });

  }
} 


class primarySwatch{
  constructor(name){
    // init
    this._smallSwatchesGroup = new SmallSwatchesGroup();
    this._getElements(name);

    this._setOnChange();
    this._updateBackgroundColour(this._picker.value);
    this._hex = this._picker.value;
  }
  get hex(){
    return this._hex;
  }
  _getElements(name){
        //elements
        this._hueSlider = document.getElementById('hue-slider');
        this._satSlider = document.getElementById('sat-slider');
        this._lumSlider = document.getElementById('lum-slider');
        this._picker = document.getElementById(name + '-picker');
        this._wrapper = document.getElementById(name + '-wrapper');
        this._copyButton = document.getElementById(name + '-copybtn');
        this._textPicker = document.getElementById('textColour-picker');
        this._textWrapper = document.getElementById('textColour-wrapper');
        this._modeButton = document.getElementById(name + '-mode');
        this._backgroundColour = this._picker.value;
        //Random dice
        this._randomButton = document.getElementById('randomise-btn');
        this._diceButton = document.getElementById('dice-btn');
        this._dieA = document.getElementById('dieA');
        this._dieB = document.getElementById('dieB');
        //properties
        [this._textColour, this._contrastRatio] = [...this._autoTextColour(this._backgroundColour)];
    
  }
  _updateBackgroundColour(hex){
    this._picker.value = hex;
    this._wrapper.style.backgroundColor = hex; 
    [this._textColour, this._contrastRatio] = [...this._autoTextColour(hex)];
    // update contrast Ratio text
    this._wrapper.dataset.content = this._makeContrastRatioString(this._contrastRatio);
    // set text colour
    this._wrapper.style.color = this._textColour; 
    // Update text picker button text
    this._textWrapper.dataset.content = 'Text: Auto';
    [this._hueSlider.value,this._satSlider.value,this._lumSlider.value] = this._convertHexToHsl(hex);
    this._smallSwatchesGroup.updateSwatches(hex);
    this._smallSwatchesGroup.updateSwatchesText(this._textColour);

  }
  _setOnChange(){
    this._hueSlider.oninput = () =>{this._onChangeSlider()};
    this._satSlider.oninput = () =>{this._onChangeSlider()};
    this._lumSlider.oninput = () =>{this._onChangeSlider()};
    this._picker.oninput = () =>{this._onChangePicker()};
    this._copyButton.onclick = () =>{this._onChange()};
    this._textPicker.oninput = () =>{this._onChangeTextPicker()};
    this._modeButton.onchange = () =>{this._onChange()};
    this._randomButton.onclick = () => {this._randomise()};
    this._diceButton.onclick = () => {this._randomise()};
    
  }
  _onChange(e){
    console.log(e);
  }
  _onChangeSlider(){
    const hex = this._convertHslToHex(this._hueSlider.value,this._satSlider.value,this._lumSlider.value);
    this._updateBackgroundColour(hex);
  }
  _onChangePicker(){
    this._updateBackgroundColour(this._picker.value);
  }
  _onChangeTextPicker(){
    const hex = this._textPicker.value;
    // update text colour
    this._textColour = hex;
    // update contrast ratio
    this._contrastRatio = this._calculateContrastRatio(this._convertHexToSrgb(this._textColour),this._convertHexToSrgb(this._backgroundColour));
    // update contrast Ratio text
    this._wrapper.dataset.content = this._makeContrastRatioString(this._contrastRatio);
    // set text colour
    this._wrapper.style.color = hex; 
    // Update text picker button text
    this._textWrapper.dataset.content = 'Text: Custom'//Text: Auto;
    
  }
  _autoTextColour(hex){
    let srgbArr = this._convertHexToSrgb(hex);
    let contrastBlack = this._calculateContrastRatio([0,0,0],srgbArr);
    let contrastWhite = this._calculateContrastRatio([1,1,1],srgbArr);
    let autoColour = (contrastBlack > contrastWhite)? '#000': '#fff';
    let autoContrast = Math.max(contrastBlack,contrastWhite);
    return [autoColour, autoContrast];
  }
  _convertHexToSrgb(hex) {
    let RsRGB = 0, GsRGB = 0, BsRGB = 0;
    // 3 digits
    if (hex.length == 4) {
      RsRGB  = ('0x' + hex[1] + hex[1])/255;
      GsRGB = ('0x' + hex[2] + hex[2])/255;
      BsRGB = ('0x' + hex[3] + hex[3])/255;
      // 6 digits
    } else if (hex.length == 7) {
      RsRGB = ('0x' + hex[1] + hex[2])/255;
      GsRGB = ('0x' + hex[3] + hex[4])/255;
      BsRGB = ('0x' + hex[5] + hex[6])/255;
    }
    return [RsRGB, GsRGB, BsRGB];
  }
  _convertSrgbToHsl(RsRGB, GsRGB, BsRGB) {
    
    let cmin = Math.min(RsRGB, GsRGB, BsRGB),
    cmax = Math.max(RsRGB, GsRGB, BsRGB),
    delta = cmax - cmin,
    hue = 0,
    sat = 0,
    lum = 0;
    
    if (delta == 0)
    hue = 0;
    else if (cmax == RsRGB)
    hue = ((GsRGB - BsRGB) / delta) % 6;
    else if (cmax == GsRGB)
    hue = (BsRGB - RsRGB) / delta + 2;
    else
    hue = (RsRGB - GsRGB) / delta + 4;
    
    hue = (hue * 60);//Math.round(hue * 60);
    
    if (hue < 0)
    hue += 360;
    
    lum = (cmax + cmin) / 2;
    sat = delta == 0 ? 0 : delta / (1 - Math.abs(2 * lum - 1));
    sat = +(sat * 100);
    lum = +(lum * 100);
    return [hue, sat, lum];
  }
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
  }

  _convertHexToHsl(hex){
    return this._convertSrgbToHsl(this._convertHexToSrgb(hex));
  }
  _calculateRelativeLuminance(RsRGB, GsRGB, BsRGB){
    const R = (RsRGB <= 0.04045)? RsRGB/12.92: Math.pow((RsRGB+0.055)/1.055, 2.4);
    const G = (GsRGB <= 0.04045)? GsRGB/12.92: Math.pow((GsRGB+0.055)/1.055, 2.4);
    const B = (BsRGB <= 0.04045)? BsRGB/12.92: Math.pow((BsRGB+0.055)/1.055, 2.4);
    
    return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
  }
  _calculateContrastRatio(...args){
    /*A contrast ratio of 3:1 is the minimum level recommended by [[ISO-9241-3]] and [[ANSI-HFES-100-1988]] for standard text and vision. 
    Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;
    */
    const relativeLumArr = args.map(x => this._calculateRelativeLuminance(...x)); 
    const L1 = Math.max(...relativeLumArr);
    const L2 = Math.min(...relativeLumArr);
    return (L1 + 0.05) / (L2 + 0.05);
  }
  _makeContrastRatioString(ratio){
    const rating = (ratio > 4.5)? (ratio > 7)? 'AAA+': 'AA+' : 'Low';
    return `Contrast Ratio: ${ratio.toFixed(2)}${rating}`;
  }
  /**
   * interact with other modules
   * 
   * 
   * 
   */
  _makeRandomColour(){
    const hue = parseInt(Math.random() * 360);
    const sat = 48 + parseInt(Math.random() * 40); // 48 - 87
    const lum = 53 + parseInt(Math.random() * 35); // 53 - 87
    return this._convertHslToHex(hue, sat, lum);
  }
  _randomDiceColours(){
    this._dieA.style.backgroundColor = this._makeRandomColour();    
    this._dieB.style.backgroundColor = this._makeRandomColour();    
  }
  _randomise(){
    this._updateBackgroundColour(this._makeRandomColour());
    this._randomDiceColours();
  }
  
}

class Palette{
  constructor(){
    
    this._primaryColourSwatch = new primarySwatch('primaryColour');
  }
  
}

const test = new Palette;
console.log(test);


class Picker {
  constructor(name){
    this._name = name;
    this._id = name + '-picker';
    this._element = document.getElementById(this._id);
    this._element.onchange = () =>{ this.update()};
    this._value = this._element.value; 
    this._wrapper = new PickerWrapper(this._name, this._value);
  }
  update(){
    this._value = this._element.value; 
    this._wrapper = new PickerWrapper(this._name, this._value);
  }
  
  get value(){
    return this._value;
  }
  get name(){
    return this._name;
  }
  set value(newValue){
    this._element.value = newValue;
    this._wrapper.style.backgroundColor = newValue;
  }
  
}
class CopyButton{
  constructor(name){
    this._name = name;
    this._element = document.getElementById(name + '-copybtn');
    //add mode logic for SCSS/CSS Toggle
    this._prefixScss = `\$`;
    this._prefixCss = `--`;

    //get clipboard information from all colours/gradients

  }
}

class Swatch{
  constructor(id){
    this._picker = new Picker(id);


  }
  //setWrapperColour(colour){
    
    //}
  }



class ColourSpaces {
  constructor(hex){
    this.hex = hex;
    this.srgb = new ColourSrgb(this._convertHexToSrgb(hex));
    this.hsl = new ColourHsl(this._convertSrgbToHsl(this.srgb.red,this.srgb.green,this.srgb.blue));
  }
  _convertHexToSrgb(hex) {
    let RsRGB = 0, GsRGB = 0, BsRGB = 0;
    // 3 digits
    if (hex.length == 4) {
      RsRGB  = ('0x' + hex[1] + hex[1])/255;
      GsRGB = ('0x' + hex[2] + hex[2])/255;
      BsRGB = ('0x' + hex[3] + hex[3])/255;
    // 6 digits
    } else if (hex.length == 7) {
      RsRGB = ('0x' + hex[1] + hex[2])/255;
      GsRGB = ('0x' + hex[3] + hex[4])/255;
      BsRGB = ('0x' + hex[5] + hex[6])/255;
    }
    return [RsRGB, GsRGB, BsRGB];
  }
  _convertSrgbToHsl(RsRGB, GsRGB, BsRGB) {

    let cmin = Math.min(RsRGB, GsRGB, BsRGB),
        cmax = Math.max(RsRGB, GsRGB, BsRGB),
        delta = cmax - cmin,
        hue = 0,
        sat = 0,
        lum = 0;
  
    if (delta == 0)
      hue = 0;
    else if (cmax == RsRGB)
      hue = ((GsRGB - BsRGB) / delta) % 6;
    else if (cmax == GsRGB)
      hue = (BsRGB - RsRGB) / delta + 2;
    else
      hue = (RsRGB - GsRGB) / delta + 4;
  
    hue = (hue * 60);//Math.round(hue * 60);
  
    if (hue < 0)
      hue += 360;
  
    lum = (cmax + cmin) / 2;
    sat = delta == 0 ? 0 : delta / (1 - Math.abs(2 * lum - 1));
    sat = +(sat * 100);
    lum = +(lum * 100);
    return [hue, sat, lum];
  }
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
  }
  _adjustHslColourHue(hue, sat, lum, rotation){
    let adjustment = Math.round(hue) + Math.round(rotation);
    if (adjustment > 360) adjustment += -360;
    if (adjustment < 0) adjustment += 360;
    return [adjustment, sat, lum]; 
  }
  _adjustHslColourLuminance(hue, sat, lum, adjustment){
    return [hue, sat, Math.max(0, Math.min(100, lum + adjustment))]; 
  }
  _adjustHslColourSaturation(hue, sat, lum, adjustment){
    return [hue, Math.max(0, Math.min(100, sat + adjustment)), lum]; 
  }
  _setHslColourHue(newHue, sat, lum){
    return [newHue, sat, lum]; 
  }
  _setHslColourSaturation(hue, newSat, lum){
    return [hue, newSat, lum]; 
  }
  _setHslColourLuminance(hue, sat, newLum){
    return [hue, sat, newLum]; 
  }

}

class ColourHsl{
  constructor(hslArr){
    this._type = 'hsl';
    [this._hue, this._sat, this._lum] = hslArr;
    this._string = `hsl(${Math.round(this._hue)}, ${Math.round(this._sat)}%, ${Math.round(this._lum)}%)`;
  }
  get type(){
    return this._type;
  }
  get string(){
    return this._string;
  }
  get hue(){
    return this._hue;
  }
  get sat(){
    return this._sat;
  }
  get lum(){
    return this._lum;
  }
  set hue(x){
    this._array[0] = this._hue = x;
    this.updateString();
  }
  set sat(x){
    this._array[1] = this._sat = x;
    this.updateString();
  }
  set lum(x){
    this._array[2] = this._lum = x;
    this.updateString();
  }
  changeHue(x){
    this._array[0] = this._hue = Math.min(Math.max(0, x), 100);
    this.updateString();
  }
  changeSat(x){
    this._array[1] = this._sat = Math.min(Math.max(0, x), 100);
    this.updateString();
  }
  changeSum(x){
    this._array[2] = this._lum = Math.min(Math.max(0, x), 100);
    this.updateString();
  }


  updateString(){
    this._string = `hsl(${Math.round(this._hue)}, ${Math.round(this._sat)}%, ${Math.round(this._lum)}%)`;
  }
}
class ColourSrgb{
  constructor(srgbArr){
    this._type = 'srgb';
    [this._rSrgb, this._gSrgb, this._bSrgb] = srgbArr;
    this._string = `rgb(${255 * this._rSrgb}, ${255 * this._gSrgb}, ${255 * this._bSrgb})`
  }
  get type(){
    return this._type;
  }
  get red(){
    return this._rSrgb;
  }
  get green(){
    return this._gSrgb;
  }
  get blue(){
    return this._bSrgb;
  }
  get string(){
    return this._string;
  }
}
class ColourTripleGradient{
  constructor(colourSpaces,name){
    this.name = name;
    [this._hue,this._sat,this._lum] = [colourSpaces.hsl.hue,colourSpaces.hsl.sat,colourSpaces.hsl.lum];

  }
}

class GradientStop{
  constructor(name,suffix,{colour = undefined, satMult = 1, lumMult =1}){
    this._name = name + suffix;
    this._colour = new Colour(colour.hue, colour.sat * satMult, colour.lum * lumMult);
  }
}

class MultiplierStops{
  constructor(stops,multiplier){
    const halfStops = 0.5 * stops;
    this._even = (stops % 2 === 0)? 1: 0;
    this._powerArr = [...Array(stops)].map((x,i,arr) => arr[i] = multiplier ** (((i + 1 > halfStops)? this._even: 0) + i - Math.floor(halfStops)));
  }
}

class SuffixStops{
  constructor(stops){
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
    this._suffixes = this._suffixise(this._names[stops]);

  }
  _suffixise(arr){
    return arr.map(x => `-${x}: `);
  }
}
const suffStops =new SuffixStops(5);
console.log(suffStops);

const multStops =new MultiplierStops(5,0.9);
console.log(multStops);
class ColourMultiGradient{
  constructor(hex,name,stops){
    this._name = name;
    //[this._hue,this._sat,this._lum] = [colourSpaces.hsl.hue,colourSpaces.hsl.sat,colourSpaces.hsl.lum];
    this._suffixes = this._getStops(stops);
    //for stops loop
  }
  _getStops(stops, lumMultiplier, satMultiplier){
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


const testGradient = new ColourMultiGradient('#ddaa66','friendylyl',1);
console.log(testGradient);


class ColourAutoText extends ColourFunctions{
  constructor(srgbArr){
    super();
    this.contrastBlack = this._calculateContrastRatio([0,0,0],srgbArr);
    this.contrastWhite = this._calculateContrastRatio([1,1,1],srgbArr);
    this.autoColour = (this.contrastBlack > this.contrastWhite)? '#000': '#fff';
    this.autoContrast = Math.max(this.contrastBlack,this.contrastWhite);
  }
}
class PickerWrapperBackground {
  constructor(hex,name){
    this.name = name;
    this.colour = new ColourSpaces(hex);
    this.tripleGradient = new ColourTripleGradient(this.colour,this.name);
    this.multiGradient = new ColourMultiGradient(this.colour,this.name);
  }
  updateHue(){
    //update hue in hsl
    //update srgb
    //update hex
    //update gradients
  }
}
function relativeLuminance(hex){
 /*
 For the srgb colorspace, the relative luminance of a color is defined as L = 0.2126 * R + 0.7152 * G + 0.0722 * B where R, G and B are defined as:
 
  and rSrgb, gSrgb, and bSrgb are defined as:
  
  rSrgb = R8bit/255
  gSrgb = G8bit/255
  bSrgb = B8bit/255
  The '^' character is the exponentiation operator. (Formula taken from [[IEC-4WD]]).
  */
 const srgbArr = hexToSrgbArr(hex);
 const rSrgb = srgbArr[0];
 const gSrgb = srgbArr[1];
 const bSrgb = srgbArr[2];
  
 const R = (rSrgb <= 0.04045)? rSrgb/12.92: Math.pow((rSrgb+0.055)/1.055, 2.4);
 const G = (gSrgb <= 0.04045)? gSrgb/12.92: Math.pow((gSrgb+0.055)/1.055, 2.4);
 const B = (bSrgb <= 0.04045)? bSrgb/12.92: Math.pow((bSrgb+0.055)/1.055, 2.4);
 return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
}
function contrastRatio(...args){
  /*A contrast ratio of 3:1 is the minimum level recommended by [[ISO-9241-3]] and [[ANSI-HFES-100-1988]] for standard text and vision. 
  Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;
  */
  const relativeLumArr = args.map(x => relativeLuminance(x)); 
  const L1 = Math.max(...relativeLumArr);
  const L2 = Math.min(...relativeLumArr);
  return (L1 + 0.05) / (L2 + 0.05);
}

function updateLabels(){
  const isHex = (document.getElementById('HSLToggle').innerHTML === 'Hex');

  if (isHex === true){
    buttons.forEach(x =>{
      const id = x.id;
      if (id !== 'copyAllCSS' && id !== 'SCSSToggle' && id !== 'HSLToggle' && id !== 'randomise-btn' && id !== 'dice-btn' && id !== 'mode'){//All Colour label buttons
        let name = id.split('-')[0];
        let picker = name + '-picker';
        x.innerHTML = document.getElementById(picker).value;
      }
    });
  }else{
    buttons.forEach(x =>{
      const id = x.id;
      if (id !== 'copyAllCSS' && id !== 'SCSSToggle' && id !== 'HSLToggle' && id !== 'randomise-btn' && id !== 'dice-btn' && id !== 'mode'){//All Colour label buttons
        let name = id.split('-')[0];
        let picker = name + '-picker';
        x.innerHTML = hexToHSLString(document.getElementById(picker).value);
      }
    });
  }
  fillClipboard();
}
function setTextColour(colour){
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

function customTextColour(){
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
function swatchModeSelector(hex, modeValue){
  if (modeValue === 'Mode: Single'){

    return hex;
  }else if (modeValue === 'Mode: Triple'){

    return linearGradientThreeTone(hex);
  }else if (modeValue === 'Mode: Multi'){
    return linearGradientMultiTone(hex);
  }
}

function updateColour(){
  let primaryColourLabel, analogousAColourLabel, analogousBColourLabel, triadicAColourLabel, triadicBColourLabel, tetradicAColourLabel, tetradicBColourLabel, tetradicCColourLabel, monochromeAColourLabel, monochromeBColourLabel, neutralColourLabel;
  const modeValue = document.getElementById('primaryColour-mode').innerHTML;    
  const isHex = (document.getElementById('HSLToggle').innerHTML === 'Hex');
  const primaryColour = colour_picker.value;
  const textColour = setTextColour(primaryColour);
  function getColour(name){
    if (name === 'primaryColour'){ return primaryColour;
    }else if (name === 'analogousA'){ return hueRotateHEX(primaryColour, -30);
    }else if (name === 'analogousB'){ return hueRotateHEX(primaryColour, 30);
    }else if (name === 'triadicA'){ return hueRotateHEX(primaryColour, -120);
    }else if (name === 'triadicB'){ return hueRotateHEX(primaryColour, 120);
    }else if (name === 'tetradicA'){ return hueRotateHEX(primaryColour, 90);
    }else if (name === 'tetradicB'){ return hueRotateHEX(primaryColour, 180);
    }else if (name === 'tetradicC'){ return hueRotateHEX(primaryColour, 270);
    }else if (name === 'monochromeA'){ return lumAdjustHEX(primaryColour, -10);
    }else if (name === 'monochromeB'){ return lumAdjustHEX(primaryColour, 10);
    }else if (name === 'neutral'){ return satAdjustHEX(primaryColour, -200);}
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
  /*
  const testColour = new PickerWrapperBackground(colour_picker.value,'Testing');
  */
}

function linearGradientThreeTone(hex){
  const variantA = lumAdjustHEX(hex, 13);
  const variantB = lumAdjustHEX(hex, -13);
  const gradient = `linear-gradient(to top, #000 1px, ${hex}1px, ${hex}) 0% 0% / 100% 70% no-repeat, linear-gradient(to right, ${variantA}50%, #000 50%, ${variantB}50%) 0% 50% / 100% 30%`;
  /*
  `linear-gradient(to top, #000 1px, ${hex}1px, ${hex}) 0% 0% / 100% 70% no-repeat, linear-gradient(to left, ${variantA}50%, #000 50%, #000 calc(50% + 1px), ${variantB}calc(50% + 1px)) 0% 50% / 100% 30%`
  */
  return gradient;
}

function stableCounter(counter, inc){//pass through outer variable to inner

  function innerIncrement(){
    counter += inc;
    return counter;
  }

  return innerIncrement;
}

function variableCounter(counter){//pass through outer variable to inner

  function innerIncrement(inc){
    counter += inc;
    return counter;
  }

  return innerIncrement;
}

function functionBox(init, func, amount){
  let operation;
  let counter = init;
  if (func === '*') operation = (x, y) => x * y;
  else if (func === '/') operation = (x, y) => x / y;
  else if (func === '+') operation = (x, y) => x + y;
  else if (func === '-') operation = (x, y) => x - y;

  function innerFunction(){
    counter = operation(counter, amount);
    return counter;
  }
  return innerFunction;
}

function hslLumGradient(hex, luminance, func, amount){
  let operation;
  if (func === '*') operation = (x, y) => x * y;
  else if (func === '/') operation = (x, y) => x / y;
  else if (func === '+') operation = (x, y) => x + y;
  else if (func === '-') operation = (x, y) => x - y;

  function innerFunction(){
    luminance = operation(luminance, amount);
    return lumChangeHex(hex, luminance);
  }
  return innerFunction;
}

function hslMultStrFixed(hex, multHue, multSat, multLum){
  //Returns hsl string from multiplication of hsl values
  //repeatable due to closure
  const hsl = hexToHSL(hex);
  let hue = hsl[0];
  let sat = hsl[1];
  let lum = hsl[2];
  function innerFunction(){
    hue = Math.min(Math.max(0, hue * multHue), 360).toFixed(0);
    sat = Math.min(Math.max(0, sat * multSat), 100).toFixed(1);
    lum = Math.min(Math.max(0, lum * multLum), 100).toFixed(1);
      return [hue, sat, lum];
  }
  return innerFunction;
}

function stringifyHsl(args){
 // const [hue, sat, lum] = [args[0], args[1], args[2]];
  const [hue, sat, lum] = [...args];
 return `hsl(${hue}, ${sat}%, ${lum}%)`;

}

function hslMultStrVariable(hex){
  //Returns hsl string from multiplication of hsl values
  //repeatable due to closure
  const hsl = hexToHSL(hex);
  let hue = hsl[0];
  let sat = hsl[1];
  let lum = hsl[2];
  function innerFunction(multHue, multSat, multLum){
    hue = Math.min(Math.max(0, hue * multHue), 360);
    sat = Math.min(Math.max(0, sat * multSat), 100);
    lum = Math.min(Math.max(0, lum * multLum), 100);
      return `hsl(${hue}, ${sat}%, ${lum}%)`;
  }
  return innerFunction;
}



function functionBoxB(func, amount){
  let operation;
  if (func === '*') operation = (x, y) => x * y;
  else if (func === '/') operation = (x, y) => x / y;
  else if (func === '+') operation = (x, y) => x + y;
  else if (func === '-') operation = (x, y) => x - y;

  function innerFunction(x){
    return operation(x, amount);
  }
  return innerFunction;
}

const xAddTwo = functionBox(100, '*', .9);

const counter = stableCounter(2, 5);
const counterB = variableCounter(3);
function hexToHue(H){
  // Convert hex to rgb first
  let r = 0, g = 0, b = 0;
  if (H.length == 4){
    r = '0x' + H[1] + H[1];
    g = '0x' + H[2] + H[2];
    b = '0x' + H[3] + H[3];
  }else if (H.length == 7){
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

function linearGradientMultiTone(hex){
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



function adjustHue(){
  const newHue = document.getElementById('hue-slider').value;
  colour_picker.value = hslToHex(...hueChangeHSL(...hexToHSL(colour_picker.value), newHue));
  updateColour();
}

function adjustLum(){
  const newLum = document.getElementById('lum-slider').value;
  colour_picker.value = hslToHex(...lumChangeHSL(...hexToHSL(colour_picker.value), newLum));
  updateColour();
}


function adjustSat(){
  const newSat = document.getElementById('sat-slider').value;
  colour_picker.value = hslToHex(...satChangeHSL(...hexToHSL(colour_picker.value), newSat));
  updateColour();
}


function fillClipboard(){
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

    if (name === 'textColour'){
      label = isHex? document.getElementById('textColour-picker').value: hexToHSLString(document.getElementById('textColour-picker').value);
    }else{
      label = document.getElementById(name + '-copybtn').innerHTML;
    }
    let variable = prefix + name;
    clipboardArr[0].push(`${variable}: ${label};`);
    clipboardArr[1].push(`${variable}:`);
    clipboardArr[2].push(`${label};`);
    if (modeValue === 'Mode: Triple' && name !== 'textColour'){
      const variantA = isHex? lumAdjustHEX(hex, 13): hexToHSLString(lumAdjustHEX(hex, 13));
      const variantB = isHex? lumAdjustHEX(hex, -13): hexToHSLString(lumAdjustHEX(hex, -13));
      clipboardArr[0].push(`${variable}-light: ${variantA};`);
      clipboardArr[1].push(`${variable}-light:`);
      clipboardArr[2].push(`${variantA};`);
  
      clipboardArr[0].push(`${variable}-dark: ${variantB};`);
      clipboardArr[1].push(`${variable}-dark:`);
      clipboardArr[2].push(`${variantB};`);

    }else if (modeValue === 'Mode: Multi' && name !== 'textColour'){
      let luminance = 95;
      const lumAdjustment = 6;
      const hex = x.value;
      if (isHex === true){
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
function copyAll(){
  const clipboard = document.getElementById('clipboard');
  const text = clipboard.dataset.clipboard;
  navigator.clipboard.writeText(text);
  alert(`Copied To Clipboard:\n${text}`);
}

function onChangepickers(){
  for (let i in pickers){
    if (i > 0){ // skip the first one - primaryColour
      pickers[i].onchange = () =>{
        const isHex = (document.getElementById('HSLToggle').innerHTML === 'Hex');
        const name = pickers[i].id.split('-')[0];
        if (name === 'textColour'){
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

function copySingle(e){
  let text = e.innerHTML;
    navigator.clipboard.writeText(text);
    alert('Copied: ' + text);
}

function toggleHsl(e){
 if (e.innerHTML === 'Hex'){
  e.innerHTML = 'HSL';
  updateLabels();
 }else{
  e.innerHTML = 'Hex';
  updateLabels();
 }
}

function toggleScss(e){
  if (e.innerHTML === 'SCSS'){
   e.innerHTML = 'CSS';
  }else{
   e.innerHTML = 'SCSS';
  }
  fillClipboard();

 }
 

function onClickButtons(){
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

function makeRandomColour(){
  let hue = parseInt(Math.random() * 360);
  let sat = 48 + parseInt(Math.random() * 40); // 78
  let lum = 53 + parseInt(Math.random() * 35); // 53
  return hslToHex(hue, sat, lum);
}


function randomprimaryColour(){
  colour_picker.value = makeRandomColour();
}

function randomDiceColours(){
  document.getElementById('dieA').style.backgroundColor = makeRandomColour();    
  document.getElementById('dieB').style.backgroundColor = makeRandomColour();    

}

function onLoad(){
  onChangepickers();
  onClickButtons();
  randomprimaryColour();
  updateColour();
  randomDiceColours();

/*
const randomButton = {
  _randomDiceColours(){
    this._dieA = document.getElementById('dieA').style.backgroundColor = this._makeRandomColour();    
    this._dieB = document.getElementById('dieB').style.backgroundColor = this._makeRandomColour();    
  },
  _makeRandomColour(){
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
  _randomise(){
    this._randomDiceColours();
    primaryColourSwatch._updateBackgroundColour(this._makeRandomColour());
  },
  init(){
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
window.onLoad = onLoad();
function randomise(){
  randomprimaryColour();
  updateColour();
  randomDiceColours();
}
function switchColourMode(){
  const modeSwitch = document.getElementById('primaryColour-mode');    
  const modeValue = modeSwitch.innerHTML; 
  if (modeValue === 'Mode: Single'){
    modeSwitch.innerHTML = 'Mode: Triple';
    updateColour();
  }else if (modeValue === 'Mode: Triple'){
    modeSwitch.innerHTML = 'Mode: Multi';
    updateColour();
  }else if (modeValue === 'Mode: Multi'){
    modeSwitch.innerHTML = 'Mode: Single';
    updateColour();
  }


  
  //alert('Swictchable modes coming soon');
}

function customColour(e){
  let name = e.id.split('-')[0];
  let wrapper = name + '-wrapper';
  let colour = e.value;
 return document.getElementById(wrapper).style.backgroundColor = colour;    
}



/*
colour_picker.onchange = () =>{
  updateColour();
}

*/

function hexToSrgbArr(hex){
  let rSrgb = 0, gSrgb = 0, bSrgb = 0;
  // 3 digits
  if (hex.length == 4){
    rSrgb  = ('0x' + hex[1] + hex[1])/255;
    gSrgb = ('0x' + hex[2] + hex[2])/255;
    bSrgb = ('0x' + hex[3] + hex[3])/255;
  // 6 digits
  }else if (hex.length == 7){
    rSrgb = ('0x' + hex[1] + hex[2])/255;
    gSrgb = ('0x' + hex[3] + hex[4])/255;
    bSrgb = ('0x' + hex[5] + hex[6])/255;
  }
  return [rSrgb, gSrgb, bSrgb];
}

function hexToHSLString(H){
  // Convert hex to rgb first
  let r = 0, g = 0, b = 0;
  if (H.length == 4){
    r = '0x' + H[1] + H[1];
    g = '0x' + H[2] + H[2];
    b = '0x' + H[3] + H[3];
  }else if (H.length == 7){
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

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}

function hexToHSL(H){
  // Convert hex to rgb first
  let r = 0, g = 0, b = 0;
  if (H.length == 4){
    r = '0x' + H[1] + H[1];
    g = '0x' + H[2] + H[2];
    b = '0x' + H[3] + H[3];
  }else if (H.length == 7){
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

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}

function hslToHex(...args){
  let [h, s, l] = [...args];
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0, 
      b = 0; 

  if (0 <= h && h < 60){
    r = c; g = x; b = 0;
  }else if (60 <= h && h < 120){
    r = x; g = c; b = 0;
  }else if (120 <= h && h < 180){
    r = 0; g = c; b = x;
  }else if (180 <= h && h < 240){
    r = 0; g = x; b = c;
  }else if (240 <= h && h < 300){
    r = x; g = 0; b = c;
  }else if (300 <= h && h <= 360){
    r = c; g = 0; b = x;
  }
  // Having obtained rgb, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = '0' + r;
  if (g.length == 1)
    g = '0' + g;
  if (b.length == 1)
    b = '0' + b;

  return '#' + r + g + b;
}

function hueRotateHSL(hue, sat, lum, rotation){
  let adjustment = Math.round(hue) + Math.round(rotation);
  if (adjustment > 360) adjustment += -360;
  if (adjustment < 0) adjustment += 360;
  return [adjustment, sat, lum]; 
}

function lumAdjustHSL(hue, sat, lum, adjustment){
  return [hue, sat, Math.max(0, Math.min(100, lum + adjustment))]; 
}

function satAdjustHSL(hue, sat, lum, adjustment){
  return [hue, Math.max(0, Math.min(100, sat + adjustment)), lum]; 
}


function hueChangeHSL(hue, sat, lum, newHue){
  return [newHue, sat, lum]; 
}

function satChangeHSL(hue, sat, lum, newSat){
  return [hue, newSat, lum]; 
}

function lumChangeHSL(hue, sat, lum, newLum){
  return [hue, sat, newLum]; 
}

function lumChangeHex(hex, newLum){
  return hslToHex(...lumChangeHSL(...hexToHSL(hex), newLum));
}
function hueRotateHEX(hex, rotation){
  return hslToHex(...hueRotateHSL(...hexToHSL(hex), rotation));
}
function lumAdjustHEX(hex, adjustment){
  return hslToHex(...lumAdjustHSL(...hexToHSL(hex), adjustment));
}
function satAdjustHEX(hex, adjustment){
  return hslToHex(...satAdjustHSL(...hexToHSL(hex), adjustment));
}

