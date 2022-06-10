const color_picker = document.getElementById("mainColour-picker");
const color_picker_wrapper = document.getElementById("mainColour-wrapper");
const color_picker_hex_label = document.getElementById("mainColour-label");
const pickers = document.querySelectorAll('input[type="color"]');
const buttons = document.querySelectorAll('button');

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

function updateColour(){
  let mainColourLabel, analogousAColourLabel, analogousBColourLabel,triadicAColourLabel, triadicBColourLabel, tetradicAColourLabel, tetradicBColourLabel, tetradicCColourLabel, monoAColourLabel, monoBColourLabel, neutralColourLabel;
  const isHex = (document.getElementById("HSLToggle").innerHTML === 'Hex');
  const mainColour = color_picker.value;
  function getColour(name){
    if (name === 'mainColour') { return mainColour;
    } else if (name === 'analogousA') { return hueRotateHEX(mainColour,-30);
    } else if (name === 'analogousB') { return hueRotateHEX(mainColour,30);
    } else if (name === 'triadicA') { return hueRotateHEX(mainColour,-120);
    } else if (name === 'triadicB') { return hueRotateHEX(mainColour,120);
    } else if (name === 'tetradicA') { return hueRotateHEX(mainColour,90);
    } else if (name === 'tetradicB') { return hueRotateHEX(mainColour,180);
    } else if (name === 'tetradicC') { return hueRotateHEX(mainColour,270);
    } else if (name === 'monoA') { return lumAdjustHEX(mainColour,-10);
    } else if (name === 'monoB') { return lumAdjustHEX(mainColour,10);
    } else if (name === 'neutral') { return satAdjustHEX(mainColour,-200);}
  }
  pickers.forEach((x,i) =>{
    const name = pickers[i].id.split('-')[0];
    const wrapper = name + '-wrapper';
    const label = name + '-label';
    const colourName = name + 'Colour';
    const colour = getColour(name);//coloursArr[i];
    pickers[i].value = colour;
    document.getElementById(wrapper).style.backgroundColor = colour;    
    document.getElementById(label).innerHTML = (isHex)?colour:hexToHSLString(colour);
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



/*
window.onclick = e => { // if clicked item is a button, copy the inner text
  if (e.target.tagName === 'BUTTON' && e.target.id !== 'copyAllCSS'){

    let text = e.target.innerHTML;
    navigator.clipboard.writeText(text);
    alert('Copied: ' + text);
  } else if (e.target.id === 'copyAllCSS'){
    copyAll();
  }
}
*/