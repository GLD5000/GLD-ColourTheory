const color_picker = document.getElementById("mainColour-picker");
const color_picker_wrapper = document.getElementById("mainColour-wrapper");
const color_picker_hex_label = document.getElementById("mainColour-label");
const pickers = document.querySelectorAll('input[type="color"]');
const buttons = document.querySelectorAll('button');

function relativeLuminance(hex){
 /*
 For the sRGB colorspace, the relative luminance of a color is defined as L = 0.2126 * R + 0.7152 * G + 0.0722 * B where R, G and B are defined as:
 
  and RsRGB, GsRGB, and BsRGB are defined as:
  
  RsRGB = R8bit/255
  GsRGB = G8bit/255
  BsRGB = B8bit/255
  The "^" character is the exponentiation operator. (Formula taken from [[IEC-4WD]]).
  */
 const sRGBArr = hexToSRGBArr(hex);
//console.log(sRGBArr);
 const RsRGB = sRGBArr[0];
 const GsRGB = sRGBArr[1];
 const BsRGB = sRGBArr[2];
  
 const R = (RsRGB <= 0.04045)? RsRGB/12.92: Math.pow((RsRGB+0.055)/1.055, 2.4);
 const G = (GsRGB <= 0.04045)? GsRGB/12.92: Math.pow((GsRGB+0.055)/1.055, 2.4);
 const B = (BsRGB <= 0.04045)? BsRGB/12.92: Math.pow((BsRGB+0.055)/1.055, 2.4);
 //console.log([R,G,B]);
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
  const isHex = (document.getElementById("HSLToggle").innerHTML === 'Hex');

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
  //console.log(colour);
  //console.log(contrastRatio('#000',color_picker.value));
  //console.log(contrastRatio('#fff',color_picker.value));
  const whiteRatio = contrastRatio('#fff',colour);
  const blackRatio = contrastRatio('#000',colour);
  const textColour = (blackRatio > whiteRatio)? '#000': '#fff';
  const ratio = (blackRatio > whiteRatio)? blackRatio: whiteRatio;
  const rating = (ratio > 4.5)? (ratio > 7)? 'AAA+': 'AA+' : '';
  color_picker_wrapper.innerHTML =`Contrast Ratio ${ratio.toFixed(2)} ${rating}`;
  //console.log(textColour);
  return textColour;
  //document.querySelector('.swatch').style.color = textColour;
  //document.querySelector('.main-swatch').style.color = textColour;

}

function updateColour(){
  let mainColourLabel, analogousAColourLabel, analogousBColourLabel,triadicAColourLabel, triadicBColourLabel, tetradicAColourLabel, tetradicBColourLabel, tetradicCColourLabel, monochromeAColourLabel, monochromeBColourLabel, neutralColourLabel;
  const isHex = (document.getElementById("HSLToggle").innerHTML === 'Hex');
  const mainColour = color_picker.value;
  const textColour = setTextColour(mainColour);
  function getColour(name){
    if (name === 'mainColour') { return mainColour;
    } else if (name === 'analogousA') { return hueRotateHEX(mainColour,-30);
    } else if (name === 'analogousB') { return hueRotateHEX(mainColour,30);
    } else if (name === 'triadicA') { return hueRotateHEX(mainColour,-120);
    } else if (name === 'triadicB') { return hueRotateHEX(mainColour,120);
    } else if (name === 'tetradicA') { return hueRotateHEX(mainColour,90);
    } else if (name === 'tetradicB') { return hueRotateHEX(mainColour,180);
    } else if (name === 'tetradicC') { return hueRotateHEX(mainColour,270);
    } else if (name === 'monochromeA') { return lumAdjustHEX(mainColour,-10);
    } else if (name === 'monochromeB') { return lumAdjustHEX(mainColour,10);
    } else if (name === 'neutral') { return satAdjustHEX(mainColour,-200);}
  }
  pickers.forEach((x,i) =>{
    const name = pickers[i].id.split('-')[0];
    if (name === 'textColour') return;
    const wrapper = document.getElementById(name + '-wrapper');
    const label = document.getElementById(name + '-label');
    const colourName = name + 'Colour';
    const colour = getColour(name);//coloursArr[i];
    pickers[i].value = colour;
    wrapper.style.backgroundColor = colour;  
    //console.log(textColour);  
    wrapper.style.color = textColour;
    label.innerHTML = (isHex)?colour:hexToHSLString(colour);
  });
  fillClipboard();
}

function adjustHue(){
  const newHue = document.getElementById("hue-slider").value;
  color_picker.value = HSLToHex(...hueChangeHSL(...hexToHSL(color_picker.value), newHue));
 // console.log(newHue);
  updateColour();
}

function adjustLum(){
const newLum = document.getElementById("lum-slider").value;
color_picker.value = HSLToHex(...lumChangeHSL(...hexToHSL(color_picker.value), newLum));
  //console.log(newLum);
  updateColour();
}


function adjustSat(){
const newSat = document.getElementById("sat-slider").value;
color_picker.value = HSLToHex(...satChangeHSL(...hexToHSL(color_picker.value), newSat));
  //console.log(newSat);
  updateColour();
}

function fillClipboard(){
  const clipboard = document.getElementById("clipboard");
  const isHex = (document.getElementById("HSLToggle").innerHTML === 'Hex');
  clipboard.style.color = isHex? '#ce9178': '#b5cea8';
  const isSCSS = (document.getElementById("SCSSToggle").innerHTML === 'SCSS');
  const clipboardArr = [];
  const innerHtmlArr = [];
  const contentArr = [];
  [...pickers].forEach(x => {
    let prefix = isSCSS?`$`:`--`
    let name = x.id.split('-')[0];
    if (name === 'textColour') return;
    let label = document.getElementById(name + '-label').innerHTML;
    let variable = prefix + name + ': ';
    let length = [...variable].length;
    let spaces = ' '.repeat(16);
    clipboardArr.push(`${variable}${label};`);
    innerHtmlArr.push(`${spaces}${label};`);
    contentArr.push(`${variable}`);

  });
  // Set clipboard content
  const clipboardText = clipboardArr.join('\n');
  clipboard.dataset.clipboard = clipboardText;
  // Set innerHTML text
  const innerHtmlText = innerHtmlArr.join('\n');
  clipboard.innerHTML = innerHtmlText;
  // Set ::after content element text
  const contentText = contentArr.join('\n');
  clipboard.dataset.content = contentText;
  
}

function copyAll() {
  const clipboard = document.getElementById("clipboard");
  const text = clipboard.dataset.clipboard;
  navigator.clipboard.writeText(text);
  alert(`Copied To Clipboard:\n${text}`);
}

function onChangepickers(){
  for (let i in pickers) {
    if (i > 0) { // skip the first one - MainColour
      pickers[i].onchange = () => {
        const isHex = (document.getElementById("HSLToggle").innerHTML === 'Hex');
        const name = pickers[i].id.split('-')[0];
        const wrapper = name + '-wrapper';
        const label = name + '-label';
        const colour = pickers[i].value;
        document.getElementById(wrapper).style.backgroundColor = colour;    
        document.getElementById(label).innerHTML = (isHex)?colour:hexToHSLString(colour);
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
    if (id === 'mode') x.onclick = () => colourMode();
    if (id !== 'copyAllCSS' && id !== 'SCSSToggle' && id !== 'HSLToggle' && id !== 'randomise' && id !== 'dice' && id !== 'mode') x.onclick = () => copySingle(x);
  }); 
 
}

function randomColour(){
  let hue = parseInt(Math.random() * 360);
  let sat = 48 + parseInt(Math.random() * 40); // 78
  let lum = 53 + parseInt(Math.random() * 35); // 53
  return HSLToHex(hue,sat,lum);
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
function colourMode(){
  alert("Swictchable modes coming soon");
}

function customColour(e){
  let name = e.id.split('-')[0];
  let wrapper = name + '-wrapper';
  let label = name + '-label';
  let colour = e.value;
  //e.value = colour;
  console.log(this.value);    
 return document.getElementById(wrapper).style.backgroundColor = colour;    
  document.getElementById(label).innerHTML = colour;
  console.log(colour);
  console.log(document.getElementById(wrapper).style.backgroundColor);
}




color_picker.onchange = () => {
  updateColour();
}

function hexToSRGBArr(h) {
  let rsRGB = 0, gsRGB = 0, bsRGB = 0;
  // 3 digits
  if (h.length == 4) {
    rsRGB  = ("0x" + h[1] + h[1])/255;
    gsRGB = ("0x" + h[2] + h[2])/255;
    bsRGB = ("0x" + h[3] + h[3])/255;
  // 6 digits
  } else if (h.length == 7) {
    rsRGB = ("0x" + h[1] + h[2])/255;
    gsRGB = ("0x" + h[3] + h[4])/255;
    bsRGB = ("0x" + h[5] + h[6])/255;
  }
  return [rsRGB,gsRGB,bsRGB];
}

function hexToHSLString(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
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

  return "hsl(" + h + "," + s + "%," + l + "%)";
}

function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
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

  return [h,s,l];
}

function HSLToHex(h,s,l) {
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
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

function hueRotateHSL(hue,sat,lum, rotation){
  let adjustment = parseInt(hue) + parseInt(rotation);

  if (adjustment > 360) adjustment += -360;
  if (adjustment < 0) adjustment += 360;

  return [adjustment, sat, lum]; 
}

function lumAdjustHSL(hue,sat,lum, adjustment){
  return [hue,sat,Math.max(0,Math.min(100,lum + adjustment))]; 
}

function satAdjustHSL(hue,sat,lum, adjustment){
  return [hue,Math.max(0,Math.min(100,sat + adjustment)),lum]; 
}


function hueChangeHSL(hue,sat,lum, newHue){
  return [newHue, sat, lum]; 
}

function satChangeHSL(hue,sat,lum, newSat){
  return [hue, newSat, lum]; 
}

function lumChangeHSL(hue,sat,lum, newLum){
  return [hue, sat, newLum]; 
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