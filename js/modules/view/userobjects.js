export const userObjectsAll = {};

function setAll() {
  const selectorsArray = [
    ["customButtons", ".btn-picker"],
    ["swatches", ".swatch"],
    ["pickers", 'input[type="color"]'],
    ["sliders", 'input[type="range"]', "array"], //array
    ["slider-headers", ".slider-header", "array"], //array
    ["wrappers", "wrapper"],
    ["labels", "label"],
    //['buttons','button'],
    [
      "copyButtons",
      [".copy-single", "#clipboard-flexbox", "#email", "#copyAllCSS"],
    ],
    [
      "other",
      [
        "#textmode",
        "#prefix",
        "#gradient",
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
