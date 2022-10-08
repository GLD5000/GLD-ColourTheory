export const userObjectsAll = {};
function createSwatchElement(name){
  const element = document.createElement("section");
  element.classList.add("swatch");
  element.classList.add(name);
  element.id = name;
  element.innerHTML =         
  `<div id="${name}-wrapper" class="picker-wrapper ${name}-wrapper" name="${name}">
  
    <input type="color" id="${name}-picker" class="picker ${name}-picker"></input>
    <div class="close-wrapper">
    <button id="${name}-close" class="close-btn" aria-label="Close Swatch">
    <svg id="close-svg"  alt="Close" height='100%' width='100%'>
    <rect class="background" x="0%" y="0%" width="100%" height="100%" rx="4%" style='stroke-width:0%; stroke-linecap:round; fill:white;'/>
    <line x1='10%' y1='10%' x2='90%' y2='90%' style='stroke:rgb(0,0,0);stroke-width:10%;stroke-linecap:round' />
    <line x1='10%' y1='90%' x2='90%' y2='10%' style='stroke:rgb(0,0,0);stroke-width:10%;stroke-linecap:round' />
    </svg>
    </button>
    </div>
    
    
    <section class="name-label-container">
    <button id="${name}-name" class="${name}-name swatch-name btn-picker label">${name}</button>
    </section>
    
    <button id="${name}-info" class="swatch-info label">Information</button>
    
    <button class="icon-copybtn" id="${name}-copybtn">
    <div class="${name}-svg-wrapper svg-wrapper svg-wrapper-sml"  id="${name}-copybtn-svg-wrapper">
    <svg class="copy-svg svg-icon svg icon-copybtn-svg" alt="Copy Colours" height='100%' width='100%'>
    <use href="#copy-svg"/>
    </svg>
    </div>
    <h2 class="icon-copybtn-text" id="${name}-copybtn-text">Copy</h2>
    </button>
    
    <button class="btn-gradient" id="${name}-gradient"></button>
  </div>
  `
  document.getElementById("swatch-palette").append(element);
  
  };
function createSwatchElementsSmall(){
  const namesArray = [
    "analogousA", 
    "analogousB", 
    "monochromeA",
    "monochromeB",
    "triadicA",
    "triadicB",
    "tetradicA",
    "tetradicB",
    "tetradicC",
    "splitA",
    "splitB",
    "neutral",
  ];
  namesArray.forEach(name => {
    createSwatchElement(name)});
};
createSwatchElementsSmall();

function setAll() {
  const selectorsArray = [
    ["closeButtons", ".close-btn"],
    ["swatches", ".swatch"],
    ["pickers", 'input[type="color"]'],
    ["sliders", 'input[type="range"]', "array"], //array
    ["slider-headers", ".slider-header", "array"], //array
    ["wrappers", ".picker-wrapper"],
    ["labels", ".label"],
    ["gradientButtons", ".btn-gradient"],
    //['buttons','button'],
    [
      "copyButtons",
      [
        ".copy-single",
        "#clipboard-flexbox",
        "#email",
        "#copyAllCSS",
        ".icon-copybtn",
      ],
    ],
    [
      "other",
      [
        "#textmode",
        "#prefix",
        "#primary-gradient",
        "#colourspace",
        "#dice-btn",
        "#random-colour",
        "#random-scheme",
        "#random-all",
        "#gldlogo",
        "#header",
        "#select-all",
        "#select-none",
        "#current-colours",
      ],
    ],
    ["clipboard", ["#clipboard", "#clipboard-secondary"]],
    ["history", ["#history-flexbox", "#save-button"]],
    ["navbar", ["#hamburger-toggle", "#navbar-list"]],
    ["schemes", ".scheme-button"],
    // ['labels','label'],
  ];
  const returnObject = {}; // {all: {}};
  selectorsArray.forEach((selector) => {
    if (selector[2] === "array") {
      returnObject[selector[0]] = [];
      [selector[1]].forEach((x) => {
        document.querySelectorAll(x).forEach((x) => {
          returnObject[selector[0]].push(document.getElementById(x.id));
          userObjectsAll[x.id] = document.getElementById(x.id);
        });
      });
    } else {
      returnObject[selector[0]] = {};
      [selector[1]].forEach((x) => {
        document.querySelectorAll(selector[1]).forEach((x) => {
          returnObject[selector[0]][x.id] = document.getElementById(x.id);
          userObjectsAll[x.id] = returnObject[selector[0]][x.id];
        });
      });
    }
  });
  returnObject.smallSwatchNamesArray = [];
  Object.keys(returnObject.pickers).forEach((x) => {
    const name = x.split("-")[0];
    if (name !== "primary" && name !== "textcolour") {
      returnObject.smallSwatchNamesArray.push(name);
    }
  });
  // this._wrapper.dataset.content = this._name;

  return returnObject;
}
export const userObjects = setAll();
