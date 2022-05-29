const color_picker = document.getElementById("mainColour-picker");
const color_picker_wrapper = document.getElementById("mainColour-wrapper");
const color_picker_hex_label = document.getElementById("mainColour-label");

color_picker.onchange = function() {
  let mainColour = color_picker.value;
  let complementaryColour = hueRotateHEX(mainColour,180);
  let analogousAColour = hueRotateHEX(mainColour,-30);
  let analogousBColour = hueRotateHEX(mainColour,30);
  let triadicAColour = hueRotateHEX(mainColour,-120);
  let triadicBColour = hueRotateHEX(mainColour,120);
  let tetradicAColour = hueRotateHEX(mainColour,90);
  let tetradicBColour = hueRotateHEX(mainColour,180);
  let tetradicCColour = hueRotateHEX(mainColour,270);
  let monoAColour = lumAdjustHEX(mainColour,-10);
  let monoBColour = lumAdjustHEX(mainColour,10);


	color_picker_wrapper.style.backgroundColor = mainColour;    
  color_picker_hex_label.innerHTML = mainColour;



  document.getElementById("complementary-wrapper").style.backgroundColor = complementaryColour;    
  document.getElementById("complementary-label").innerHTML = complementaryColour;
  document.getElementById("complementary-picker").value = complementaryColour;

  document.getElementById("analogousA-wrapper").style.backgroundColor = analogousAColour;    
  document.getElementById("analogousA-label").innerHTML = analogousAColour;
  document.getElementById("analogousA-picker").value = analogousAColour;

  document.getElementById("analogousB-wrapper").style.backgroundColor = analogousBColour;    
  document.getElementById("analogousB-label").innerHTML = analogousBColour;
  document.getElementById("analogousB-picker").value = analogousBColour;

  document.getElementById("triadicA-wrapper").style.backgroundColor = triadicAColour;    
  document.getElementById("triadicA-label").innerHTML = triadicAColour;
  document.getElementById("triadicA-picker").value = triadicAColour;

  document.getElementById("triadicB-wrapper").style.backgroundColor = triadicBColour;    
  document.getElementById("triadicB-label").innerHTML = triadicBColour;
  document.getElementById("triadicB-picker").value = triadicBColour;

  document.getElementById("tetradicA-wrapper").style.backgroundColor = tetradicAColour;    
  document.getElementById("tetradicA-label").innerHTML = tetradicAColour;
  document.getElementById("tetradicA-picker").value = tetradicAColour;

  document.getElementById("tetradicB-wrapper").style.backgroundColor = tetradicBColour;    
  document.getElementById("tetradicB-label").innerHTML = tetradicBColour;
  document.getElementById("tetradicB-picker").value = tetradicBColour;

  document.getElementById("tetradicC-wrapper").style.backgroundColor = tetradicCColour;    
  document.getElementById("tetradicC-label").innerHTML = tetradicCColour;
  document.getElementById("tetradicC-picker").value = tetradicCColour;

  document.getElementById("monoA-wrapper").style.backgroundColor = monoAColour;    
  document.getElementById("monoA-label").innerHTML = monoAColour;
  document.getElementById("monoA-picker").value = monoAColour;

  document.getElementById("monoB-wrapper").style.backgroundColor = monoBColour;    
  document.getElementById("monoB-label").innerHTML = monoBColour;
  document.getElementById("monoB-picker").value = monoBColour;


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

  if (rotation < 0) rotation += 360;

  return (hue + rotation > 360)? [hue - 360 + rotation, sat, lum]: [hue + rotation, sat, lum]; 

}

function lumAdjustHSL(hue,sat,lum, adjustment){

  
  return (lum + adjustment > 100)? [hue,sat,lum + adjustment - 100]: [hue,sat,lum + adjustment]; 

}

function hueRotateHEX(hex, rotation){

  return HSLToHex(...hueRotateHSL(...hexToHSL(hex), rotation));

}

function lumAdjustHEX(hex, adjustment){

  return HSLToHex(...lumAdjustHSL(...hexToHSL(hex), adjustment));

}



window.onclick = e => { // if clicked item is a button, copy the inner text
  if (e.target.tagName === 'BUTTON'){
    let text = e.target.innerHTML;
    navigator.clipboard.writeText(text);
  }
}

