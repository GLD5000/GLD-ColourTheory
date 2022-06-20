const color_picker = document.getElementById('mainColour-picker');
const color_picker_wrapper = document.getElementById('mainColour-wrapper');
const color_picker_hex_label = document.getElementById('mainColour-label');
const pickers = document.querySelectorAll('input[type="color"]');
const buttons = document.querySelectorAll('button');

class colour {
  constructor(hex,name){
    this.name = name;
    this.variableSCSS = `\$${this.name}`;
    this.variableCSS = `\--${this.name}`;
    this.hex = hex;
    [this.rsRGB, this.gsRGB, this.bsRGB] = this.hexToSRGBArr(this.hex);
    [this.hue, this.sat, this.lum] = this.hexToHSL(this.rsRGB, this.gsRGB, this.bsRGB);
    this.relativeLuminance = this.calculateRelativeLuminance(this.rsRGB, this.gsRGB, this.bsRGB);
    this.hslString = this.HSLToString(this.hue, this.sat, this.lum);
    this.hexTest = HSLToHex(this.hue, this.sat, this.lum);
  }

  HSLToString(hue,sat,lum){
    return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%)`;
  }
  
  hexToSRGBArr(hex) {
    let rsRGB = 0, gsRGB = 0, bsRGB = 0;
    // 3 digits
    if (hex.length == 4) {
      rsRGB  = ('0x' + hex[1] + hex[1])/255;
      gsRGB = ('0x' + hex[2] + hex[2])/255;
      bsRGB = ('0x' + hex[3] + hex[3])/255;
    // 6 digits
    } else if (hex.length == 7) {
      rsRGB = ('0x' + hex[1] + hex[2])/255;
      gsRGB = ('0x' + hex[3] + hex[4])/255;
      bsRGB = ('0x' + hex[5] + hex[6])/255;
    }
    return [rsRGB, gsRGB, bsRGB];
  }
  hexToHSL(rsRGB, gsRGB, bsRGB) {

    let cmin = Math.min(rsRGB, gsRGB, bsRGB),
        cmax = Math.max(rsRGB, gsRGB, bsRGB),
        delta = cmax - cmin,
        hue = 0,
        sat = 0,
        lum = 0;
  
    if (delta == 0)
      hue = 0;
    else if (cmax == rsRGB)
      hue = ((gsRGB - bsRGB) / delta) % 6;
    else if (cmax == gsRGB)
      hue = (bsRGB - rsRGB) / delta + 2;
    else
      hue = (rsRGB - gsRGB) / delta + 4;
  
    hue = (hue * 60).toFixed(2);//Math.round(hue * 60);
  
    if (hue < 0)
      hue += 360;
  
    lum = (cmax + cmin) / 2;
    sat = delta == 0 ? 0 : delta / (1 - Math.abs(2 * lum - 1));
    sat = +(sat * 100).toFixed(2);
    lum = +(lum * 100).toFixed(2);
  
    return [hue, sat, lum];
  }
  HSLToHex(hue, sat, lum) {
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
  
  hueRotateHSL(hue, sat, lum, rotation){
    let adjustment = Math.round(hue) + Math.round(rotation);
    //console.log(rotation);
    if (adjustment > 360) adjustment += -360;
    if (adjustment < 0) adjustment += 360;
    //if(rotation === 180)console.log([adjustment, sat, lum]);
    return [adjustment, sat, lum]; 
  }
  
  lumAdjustHSL(hue, sat, lum, adjustment){
    return [hue, sat, Math.max(0, Math.min(100, lum + adjustment))]; 
  }
  
  satAdjustHSL(hue, sat, lum, adjustment){
    return [hue, Math.max(0, Math.min(100, sat + adjustment)), lum]; 
  }
  
  hueChangeHSL(hue, sat, lum, newHue){
    return [newHue, sat, lum]; 
  }
  
  satChangeHSL(hue, sat, lum, newSat){
    return [hue, newSat, lum]; 
  }
  
  lumChangeHSL(hue, sat, lum, newLum){
    return [hue, sat, newLum]; 
  }
  
  lumChangeHEX(hex, newLum){
    return this.HSLToHex(...this.lumChangeHSL(...this.hexToHSL(hex), newLum));
  }
  
  hueRotateHEX(hex, rotation){
    return this.HSLToHex(...this.hueRotateHSL(...this.hexToHSL(hex), rotation));
  }
  
  lumAdjustHEX(hex, adjustment){
    return this.HSLToHex(...this.lumAdjustHSL(...this.hexToHSL(hex), adjustment));
  }
  
  satAdjustHEX(hex, adjustment){
    return this.HSLToHex(...this.satAdjustHSL(...this.hexToHSL(hex), adjustment));
  }
  
  

  calculateRelativeLuminance(rsRGB, gsRGB, bsRGB){
    const R = (rsRGB <= 0.04045)? rsRGB/12.92: Math.pow((rsRGB+0.055)/1.055, 2.4);
    const G = (gsRGB <= 0.04045)? gsRGB/12.92: Math.pow((gsRGB+0.055)/1.055, 2.4);
    const B = (bsRGB <= 0.04045)? bsRGB/12.92: Math.pow((bsRGB+0.055)/1.055, 2.4);

    return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
   }
   

}

const testColour = new colour('#22ff44','Testing');

console.log(testColour);

function relativeLuminance(hex){
 /*
 For the sRGB colorspace, the relative luminance of a color is defined as L = 0.2126 * R + 0.7152 * G + 0.0722 * B where R, G and B are defined as:
 
  and rsRGB, gsRGB, and bsRGB are defined as:
  
  rsRGB = R8bit/255
  gsRGB = G8bit/255
  bsRGB = B8bit/255
  The '^' character is the exponentiation operator. (Formula taken from [[IEC-4WD]]).
  */
 const sRGBArr = hexToSRGBArr(hex);
//console.log(sRGBArr);
 const rsRGB = sRGBArr[0];
 const gsRGB = sRGBArr[1];
 const bsRGB = sRGBArr[2];
  
 const R = (rsRGB <= 0.04045)? rsRGB/12.92: Math.pow((rsRGB+0.055)/1.055, 2.4);
 const G = (gsRGB <= 0.04045)? gsRGB/12.92: Math.pow((gsRGB+0.055)/1.055, 2.4);
 const B = (bsRGB <= 0.04045)? bsRGB/12.92: Math.pow((bsRGB+0.055)/1.055, 2.4);
 //console.log([R, G, B]);
 return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
}
//console.log(relativeLuminance('#ff0055'));
function contrastRatio(...args){
  /*A contrast ratio of 3:1 is the minimum level recommended by [[ISO-9241-3]] and [[ANSI-HFES-100-1988]] for standard text and vision. 
  Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;
  */
 const relativeLumArr = args.map(x => relativeLuminance(x)); 
 //console.log(...relativeLumArr);
  const L1 = Math.max(...relativeLumArr);
  const L2 = Math.min(...relativeLumArr);
  return (L1 + 0.05) / (L2 + 0.05);
}

function updateLabels(){
  const isHex = (document.getElementById('HSLToggle').innerHTML === 'Hex');

  if (isHex === true){
    buttons.forEach(x =>{
      const id = x.id;
      if (id !== 'copyAllCSS' && id !== 'SCSSToggle' && id !== 'HSLToggle' && id !== 'randomise' && id !== 'dice' && id !== 'mode'){//All Colour label buttons
        let name = id.split('-')[0];
        let picker = name + '-picker';
        x.innerHTML = document.getElementById(picker).value;
      }
    });
  } else {
    buttons.forEach(x =>{
      const id = x.id;
      if (id !== 'copyAllCSS' && id !== 'SCSSToggle' && id !== 'HSLToggle' && id !== 'randomise' && id !== 'dice' && id !== 'mode'){//All Colour label buttons
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
  color_picker_wrapper.dataset.content =`Contrast Ratio: ${ratio.toFixed(2)} ${rating}`;// this disables the main colour picker
  textPicker.value = textColour;
  document.getElementById('textColour-wrapper').dataset.content = 'Text: Auto';
  return textColour;
}

function customTextColour(){
  const textPicker = document.getElementById('textColour-picker');
  const textColour = textPicker.value;
  const mainColour = color_picker.value;
  const ratio = contrastRatio(textColour, mainColour);
  const rating = (ratio > 4.5)? (ratio > 7)? 'AAA+': 'AA+' : 'Low';
  color_picker_wrapper.dataset.content =`Contrast Ratio: ${ratio.toFixed(2)} ${rating}`;
  //color_picker_wrapper.style.color = textColour;
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
  } else if (modeValue === 'Mode: Triple'){
   //console.log(modeValue);

    return linearGradientThreeTone(hex);
  } else if (modeValue === 'Mode: Multi'){
    return linearGradientMultiTone(hex);
  }
}

function updateColour(){
  let mainColourLabel, analogousAColourLabel, analogousBColourLabel, triadicAColourLabel, triadicBColourLabel, tetradicAColourLabel, tetradicBColourLabel, tetradicCColourLabel, monochromeAColourLabel, monochromeBColourLabel, neutralColourLabel;
  const modeValue = document.getElementById('mode').innerHTML;    
  const isHex = (document.getElementById('HSLToggle').innerHTML === 'Hex');
  const mainColour = color_picker.value;
  const textColour = setTextColour(mainColour);
  function getColour(name){
    if (name === 'mainColour') { return mainColour;
    } else if (name === 'analogousA') { return hueRotateHEX(mainColour, -30);
    } else if (name === 'analogousB') { return hueRotateHEX(mainColour, 30);
    } else if (name === 'triadicA') { return hueRotateHEX(mainColour, -120);
    } else if (name === 'triadicB') { return hueRotateHEX(mainColour, 120);
    } else if (name === 'tetradicA') { return hueRotateHEX(mainColour, 90);
    } else if (name === 'tetradicB') { return hueRotateHEX(mainColour, 180);
    } else if (name === 'tetradicC') { return hueRotateHEX(mainColour, 270);
    } else if (name === 'monochromeA') { return lumAdjustHEX(mainColour, -10);
    } else if (name === 'monochromeB') { return lumAdjustHEX(mainColour, 10);
    } else if (name === 'neutral') { return satAdjustHEX(mainColour, -200);}
  }
  pickers.forEach((x, i) =>{
    const name = pickers[i].id.split('-')[0];
    if (name === 'textColour') return;
    const wrapper = document.getElementById(name + '-wrapper');
    const label = document.getElementById(name + '-label');
    const colourName = name + 'Colour';
    const colour = getColour(name);//coloursArr[i];
    pickers[i].value = colour;
    //console.log(swatchModeSelector(colour, modeValue));
    wrapper.style.background = swatchModeSelector(colour, modeValue);  
    //console.log(colour);  
    wrapper.style.color = textColour;
    label.innerHTML = (isHex)?colour:hexToHSLString(colour);
  });
  fillClipboard();
  //color_picker_wrapper.style.background = linearGradientMultiTone(mainColour);

}

function linearGradientThreeTone(hex){
  const variantA = lumAdjustHEX(hex, 13);
  const variantB = lumAdjustHEX(hex, -13);
  const gradient = `linear-gradient(to top, #000 1px, ${hex} 1px, ${hex}) 0% 0% / 100% 70% no-repeat, linear-gradient(to right, ${variantA} 50%, #000 50%, ${variantB} 50%) 0% 50% / 100% 30%`;
  /*
  `linear-gradient(to top, #000 1px, ${hex} 1px, ${hex}) 0% 0% / 100% 70% no-repeat, linear-gradient(to left, ${variantA} 50%, #000 50%, #000 calc(50% + 1px), ${variantB} calc(50% + 1px)) 0% 50% / 100% 30%`
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

function HSLlumGradient(hex, luminance, func, amount){
  let operation;
  if (func === '*') operation = (x, y) => x * y;
  else if (func === '/') operation = (x, y) => x / y;
  else if (func === '+') operation = (x, y) => x + y;
  else if (func === '-') operation = (x, y) => x - y;

  function innerFunction(){
    luminance = operation(luminance, amount);
    return lumChangeHEX(hex, luminance);
  }
  return innerFunction;
}

function HSLMultStrFixed(hex, multHue, multSat, multLum){
  //Returns HSL string from multiplication of HSL values
  //repeatable due to closure
  const HSL = hexToHSL(hex);
  let hue = HSL[0];
  let sat = HSL[1];
  let lum = HSL[2];
  function innerFunction(){
    hue = Math.min(Math.max(0, hue * multHue), 360).toFixed(0);
    sat = Math.min(Math.max(0, sat * multSat), 100).toFixed(1);
    lum = Math.min(Math.max(0, lum * multLum), 100).toFixed(1);
      return [hue, sat, lum];
  }
  return innerFunction;
}

function stringifyHSL(args){
 // const [hue, sat, lum] = [args[0], args[1], args[2]];
  const [hue, sat, lum] = [...args];
 return `hsl(${hue}, ${sat}%, ${lum}%)`;

}

function HSLMultStrVariable(hex){
  //Returns HSL string from multiplication of HSL values
  //repeatable due to closure
  const HSL = hexToHSL(hex);
  let hue = HSL[0];
  let sat = HSL[1];
  let lum = HSL[2];
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

//console.log(xAddTwo());
//console.log(xAddTwo());
//console.log(xAddTwo());

const counter = stableCounter(2, 5);
const counterB = variableCounter(3);
/*
console.log(counter());
console.log(counter());
console.log(counter());
console.log(counterB(2));
console.log(counterB(4));
*/
function hexToHue(){

  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = '0x' + H[1] + H[1];
    g = '0x' + H[2] + H[2];
    b = '0x' + H[3] + H[3];
  } else if (H.length == 7) {
    r = '0x' + H[1] + H[2];
    g = '0x' + H[3] + H[4];
    b = '0x' + H[5] + H[6];
  }
  // Then to HSL
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
  const variantDec = HSLMultStrFixed(lumChangeHEX(hex, luminance), 1, satMult, lumMult);
  const gradient = `linear-gradient(to top, #000 1px, ${hex} 1px, ${hex}) 0% 0% / 100% 70% no-repeat, 
  linear-gradient(to right,
     ${stringifyHSL(variantDec())} 10%, #000 10%, #000 10%,
     ${stringifyHSL(variantDec())} 10% 20%, #000 20%, #000 20%, 
     ${stringifyHSL(variantDec())} 20% 30%, #000 30%, #000 30%, 
     ${stringifyHSL(variantDec())} 30% 40%, #000 40%, #000 40%, 
     ${stringifyHSL(variantDec())} 40% 50%, #000 50%, #000 50%,
     ${stringifyHSL(variantDec())} 50% 60%, #000 60%, #000 60%, 
     ${stringifyHSL(variantDec())} 60% 70%, #000 70%, #000 70%, 
     ${stringifyHSL(variantDec())} 70% 80%, #000 80%, #000 80%, 
     ${stringifyHSL(variantDec())} 80% 90%, #000 90%, #000 90%, 
     ${stringifyHSL(variantDec())} 90%) 0% 50% / 100% 30%`;

  return gradient;
}



function adjustHue(){
  const newHue = document.getElementById('hue-slider').value;
  color_picker.value = HSLToHex(...hueChangeHSL(...hexToHSL(color_picker.value), newHue));
 ////console.log(newHue);
  updateColour();
}

function adjustLum(){
const newLum = document.getElementById('lum-slider').value;
color_picker.value = HSLToHex(...lumChangeHSL(...hexToHSL(color_picker.value), newLum));
  //console.log(newLum);
  updateColour();
}


function adjustSat(){
const newSat = document.getElementById('sat-slider').value;
color_picker.value = HSLToHex(...satChangeHSL(...hexToHSL(color_picker.value), newSat));
  //console.log(newSat);
  updateColour();
}


function fillClipboard(){
  const clipboard = document.getElementById('clipboard');
  const clipboardSecondary = document.getElementById('clipboard-secondary');
  const modeValue = document.getElementById('mode').innerHTML;    
  const isHex = (document.getElementById('HSLToggle').innerHTML === 'Hex');
  clipboardSecondary.style.color = isHex? '#ce9178': '#b5cea8';
  const isSCSS = (document.getElementById('SCSSToggle').innerHTML === 'SCSS');
  const clipboardArr = [[], [], []];
  [...pickers].forEach(x => {
    let prefix = isSCSS?`$`:`--`
    let name = x.id.split('-')[0];
    let label;
    const hex = x.value;

    if (name === 'textColour'){
      label = isHex? document.getElementById('textColour-picker').value: hexToHSLString(document.getElementById('textColour-picker').value);
    }else{
      label = document.getElementById(name + '-label').innerHTML;
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

    } else if (modeValue === 'Mode: Multi' && name !== 'textColour'){
     //console.log('hello');
      let luminance = 95;
      const lumAdjustment = 6;
      const hex = x.value;
      if (isHex === true){
        let val;
        const suffixArr = ['-50: ', '-100: ', '-200: ', '-300: ', '-400: ', '-500: ', '-600: ', '-700: ', '-800: ', '-900: '];
        const luminance = 95;
        const lumMult = 0.905; 
        const satMult = 1.05;
        const variantDec = HSLMultStrFixed(lumChangeHEX(hex, luminance), 1, satMult, lumMult);//not working
      
        suffixArr.forEach(x =>{
          val = HSLToHex(...variantDec());//not working
          clipboardArr[0].push(`${variable}${x}${val}`);
          clipboardArr[1].push(`${variable}${x}`);
          clipboardArr[2].push(`${val};`);
          //luminance -= lumAdjustment;
          });

      } else {
        let val;
        const suffixArr = ['-50: ', '-100: ', '-200: ', '-300: ', '-400: ', '-500: ', '-600: ', '-700: ', '-800: ', '-900: '];
        const luminance = 95;
        const lumMult = 0.905; 
        const satMult = 1.05;
        const variantDec = HSLMultStrFixed(lumChangeHEX(hex, luminance), 1, satMult, lumMult);
      
        suffixArr.forEach(x =>{
          val = stringifyHSL(variantDec());
       
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

function onChangepickers(){
  for (let i in pickers) {
    if (i > 0) { // skip the first one - MainColour
      pickers[i].onchange = () => {
        const isHex = (document.getElementById('HSLToggle').innerHTML === 'Hex');
        const name = pickers[i].id.split('-')[0];
        if (name === 'textColour') {
          fillClipboard();
          customTextColour();
        } else {
          const wrapper = name + '-wrapper';
          const label = name + '-label';
          const colour = pickers[i].value;
          //console.log(colour);
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
    //console.log(text);
}

function toggleHSL(e){
 if (e.innerHTML === 'Hex'){
  e.innerHTML = 'HSL';
  updateLabels();
 } else {
  e.innerHTML = 'Hex';
  updateLabels();
 }
}

function toggleSCSS(e){
  if (e.innerHTML === 'SCSS'){
   e.innerHTML = 'CSS';
  } else {
   e.innerHTML = 'SCSS';
  }
  fillClipboard();

 }
 

function onClickButtons(){
  buttons.forEach(x => {//Assign a function to each button onclick
    const id = x.id;
    if (id === 'copyAllCSS') x.onclick = () => copyAll();
    if (id === 'SCSSToggle') x.onclick = () => toggleSCSS(x);
    if (id === 'HSLToggle') x.onclick = () => toggleHSL(x);
    if (id === 'randomise') x.onclick = () => randomise();
    if (id === 'dice') x.onclick = () => randomise();
    if (id === 'mode') x.onclick = () => switchColourMode();
    if (id !== 'copyAllCSS' && id !== 'SCSSToggle' && id !== 'HSLToggle' && id !== 'randomise' && id !== 'dice' && id !== 'mode') x.onclick = () => copySingle(x);
  }); 
 
}

function randomColour(){
  let hue = parseInt(Math.random() * 360);
  let sat = 48 + parseInt(Math.random() * 40); // 78
  let lum = 53 + parseInt(Math.random() * 35); // 53
  return HSLToHex(hue, sat, lum);
}


function randomMainColour(){
  color_picker.value = randomColour();
}

function randomDiceColours(){
  document.getElementById('dieA').style.backgroundColor = randomColour();    
  document.getElementById('dieB').style.backgroundColor = randomColour();    

}

function onLoad(){
  onChangepickers();
  onClickButtons();
  randomMainColour();
  updateColour();
  randomDiceColours();


}
function randomise(){
  randomMainColour();
  updateColour();
  randomDiceColours();
}
function switchColourMode(){
  const modeSwitch = document.getElementById('mode');    
  const modeValue = modeSwitch.innerHTML; 
  if (modeValue === 'Mode: Single'){
    modeSwitch.innerHTML = 'Mode: Triple';
    updateColour();
  } else if (modeValue === 'Mode: Triple'){
    modeSwitch.innerHTML = 'Mode: Multi';
    updateColour();
  } else if (modeValue === 'Mode: Multi'){
    modeSwitch.innerHTML = 'Mode: Single';
    updateColour();
  }


  
  //alert('Swictchable modes coming soon');
}

function customColour(e){
  let name = e.id.split('-')[0];
  let wrapper = name + '-wrapper';
  let label = name + '-label';
  let colour = e.value;
  //e.value = colour;
 //console.log(this.value);    
 return document.getElementById(wrapper).style.backgroundColor = colour;    
  document.getElementById(label).innerHTML = colour;
 //console.log(colour);
 //console.log(document.getElementById(wrapper).style.backgroundColor);
}




color_picker.onchange = () => {
  updateColour();
}

function hexToSRGBArr(hex) {
  let rsRGB = 0, gsRGB = 0, bsRGB = 0;
  // 3 digits
  if (hex.length == 4) {
    rsRGB  = ('0x' + hex[1] + hex[1])/255;
    gsRGB = ('0x' + hex[2] + hex[2])/255;
    bsRGB = ('0x' + hex[3] + hex[3])/255;
  // 6 digits
  } else if (hex.length == 7) {
    rsRGB = ('0x' + hex[1] + hex[2])/255;
    gsRGB = ('0x' + hex[3] + hex[4])/255;
    bsRGB = ('0x' + hex[5] + hex[6])/255;
  }
  return [rsRGB, gsRGB, bsRGB];
}

function hexToHSLString(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = '0x' + H[1] + H[1];
    g = '0x' + H[2] + H[2];
    b = '0x' + H[3] + H[3];
  } else if (H.length == 7) {
    r = '0x' + H[1] + H[2];
    g = '0x' + H[3] + H[4];
    b = '0x' + H[5] + H[6];
  }
  // Then to HSL
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

function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = '0x' + H[1] + H[1];
    g = '0x' + H[2] + H[2];
    b = '0x' + H[3] + H[3];
  } else if (H.length == 7) {
    r = '0x' + H[1] + H[2];
    g = '0x' + H[3] + H[4];
    b = '0x' + H[5] + H[6];
  }
  // Then to HSL
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

function HSLToHex(...args) {
  let [h, s, l] = [...args];
  //console.log(s);
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0, 
      b = 0; 

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h <= 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
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
  //console.log(rotation);
  if (adjustment > 360) adjustment += -360;
  if (adjustment < 0) adjustment += 360;
  //if(rotation === 180)console.log([adjustment, sat, lum]);
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

function lumChangeHEX(hex, newLum){
  return HSLToHex(...lumChangeHSL(...hexToHSL(hex), newLum));
}


function hueRotateHEX(hex, rotation){
  return HSLToHex(...hueRotateHSL(...hexToHSL(hex), rotation));
}

function lumAdjustHEX(hex, adjustment){
  return HSLToHex(...lumAdjustHSL(...hexToHSL(hex), adjustment));
}

function satAdjustHEX(hex, adjustment){
  return HSLToHex(...satAdjustHSL(...hexToHSL(hex), adjustment));
}

