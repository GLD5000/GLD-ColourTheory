import { userObjectsAll } from "../view/userobjects.js";
import { userObjects } from "../view/userobjects.js";
import { colourObject } from "../utilities/colourobject.js";
import { paletteData } from "./palettedata.js";
import { throttleDebounce } from "../utilities/utilities.js";
import { variantMaker } from "./variantmaker.js";
import { gradientMaker } from "./gradientmaker.js";
import { clampRotate } from "../utilities/utilities.js";
//import { callLogger } from "../utilities/utilities.js";

const paletteState = {
  saveCounter: 0,
  _resetAllCustomStates() {
    userObjects.smallSwatchNamesArray.forEach((name) => {
      paletteData.setCustomColourState(name, "auto");
      userObjects.wrappers[name + "-wrapper"].dataset.content = name;
    });
  },
  setCustomStatesfromWrappers() {
    const returnObject = {};
    userObjects.smallSwatchNamesArray.forEach((name) => {
      returnObject[name] =
        userObjectsAll[name + "-wrapper"].dataset.content[0] === "c"
          ? "Custom"
          : "auto"; //check wrapper for the 'c' word
      paletteData.paletteState.smallSwatchCustomState = returnObject;
    });
  },
  setCustomStatesfromPaletteData() {
    userObjects.smallSwatchNamesArray.forEach((name) => {
      if (paletteData.getCustomColourState(name) === "custom") {
        const customColour = paletteData.getCustomColour(name);
        paletteData.addColour(customColour);
        userObjects.wrappers[name + "-wrapper"].dataset.content =
          customColour.customName;
      } // if colour is custom overwrite background colour with custom colour
      if (paletteUi.getTextMode() === "custom") {
        paletteUi._addCustomTextColour(paletteData.getTextHex());
        paletteUi.setTextMode("custom");
      }
      paletteUi._updateGradientNumberTones();
      paletteUi._updateGradientsAll();
      paletteUi._setClipboardTextAll();
    });
  },
  deepCopyPaletteState(sourceObject) {
    const primitiveAddressArray = [
      "primaryHex",
      "gradientMode",
      "prefixMode",
      "prefix",
      "textMode",
      "textColour",
      "colourspace",
    ];
    const deepCopy = {};
    primitiveAddressArray.forEach((name) => {
      deepCopy[name] = sourceObject[name];
    });
    const objectAddressArray = ["smallSwatchCustomState", "customColours"];
    objectAddressArray.forEach((name) => {
      deepCopy[name] = {};
      Object.keys(sourceObject[name]).forEach((key) => {
        deepCopy[name][key] = sourceObject[name][key];
      });
    });
    return deepCopy;
  },
  applyStatefromHistoryObject(newState) {
    const newColour = colourObject.fromHex({
      name: "primary",
      hex: newState.primaryHex,
    });
    paletteUi.addColour(newColour);
    paletteData.paletteState = newState;
    paletteState.setCustomStatesfromPaletteData();
  },
};
const colourScheme = {
  nameLookup: {
    Monochrome: ["monochromeA", "primary", "monochromeB"],
    Analogous: ["analogousA", "primary", "analogousB"],
    Complementary: ["primary", "tetradicA"],
    Split: ["splitA", "primary", "splitB"],
    Triadic: ["triadicA", "primary", "triadicB"],
    Tetradic: ["primary", "tetradicA", "tetradicB", "tetradicC"],
    Neutral: ["neutral"],
  },
  hideLookup: {
    Monochrome: ["monochromeA", "monochromeB"],
    Analogous: ["analogousA", "analogousB"],
    Complementary: ["tetradicA"],
    Split: ["splitA", "splitB"],
    Triadic: ["triadicA", "triadicB"],
    Tetradic: ["tetradicB", "tetradicC"],
    Neutral: ["neutral"],
  },
  hideSwatches(name) {
    if (
      name === "Complementary" &&
      !userObjectsAll["Tetradic"].classList.contains("dimmed")
    )
      return;
    if (
      name === "Tetradic" &&
      userObjectsAll["Complementary"].classList.contains("dimmed")
    )
      userObjects.swatches["tetradicA"].classList.add("hidden");
    colourScheme.hideLookup[name].forEach((x) => {
      userObjects.swatches[x].classList.add("hidden");
    });
  },
  showSwatches(name) {
    if (name === "Tetradic")
      userObjects.swatches["tetradicA"].classList.remove("hidden");
    colourScheme.hideLookup[name].forEach((x) => {
      userObjects.swatches[x].classList.remove("hidden");
    });
  },
  applyGradient(name) {
    let gradientString = "linear-gradient(to right, ";
    const hexArray = [];
    colourScheme.nameLookup[name].forEach((x, i, array) => {
      hexArray.push(
        `${paletteData.getColourObject(x).hex} ${i * (100 / array.length)}%, ${
          paletteData.getColourObject(x).hex
        } ${(1 + i) * (100 / array.length)}%`
      );
    });
    gradientString += hexArray.join(",");
    gradientString += ")";
    userObjectsAll[name].style.background = gradientString;
    userObjectsAll[name].style.color = paletteData.getMainTextColour().hex;
  },
  applyAllGradients() {
    Object.keys(colourScheme.nameLookup).forEach((key) => {
      colourScheme.applyGradient(key);
    });
  },
  dimSchemeButton(target) {
    let innerHtml = target.innerHTML;
    if (target.id === "Tetradic") {
      target.classList.add("dimmed");
      target.innerHTML = innerHtml.split(" ")[0] + " Off";
      colourScheme.hideSwatches(target.id);
      return;
    }
    target.classList.add("dimmed");
    target.innerHTML = innerHtml + " Off";
    colourScheme.hideSwatches(target.id);
  },
  unDimSchemeButton(target) {
    let innerHtml = target.innerHTML;
    if (target.id === "Split") {
      target.classList.remove("dimmed");
      innerHtml = innerHtml.split(" ");
      innerHtml.pop();
      target.innerHTML = innerHtml.join(" ");
      colourScheme.showSwatches(target.id);
      return;
    }
    if (target.id === "Tetradic") {
      target.classList.remove("dimmed");
      target.innerHTML = `${
        innerHtml.split(" ")[0]
      } ${paletteData.getTetradicMode()}`;
      colourScheme.showSwatches(target.id);
      return;
    }
    target.classList.remove("dimmed");
    target.innerHTML = innerHtml.split(" ")[0];
    colourScheme.showSwatches(target.id);
  },
  _onclickSchemeButtons(event) {
    const target = event.target;
    if (target.id === "Tetradic") {
      if (target.classList.contains("dimmed")) {
        paletteUi.setTetradicMode("Square");
        this.unDimSchemeButton(target);
      } else if (paletteData.getTetradicMode() === "Rectangular B") {
        paletteUi.setTetradicMode("Square");
        this.dimSchemeButton(target);
      } else {
        paletteUi.setTetradicMode();
        let innerHtml = target.innerHTML;
        target.innerHTML = `${
          innerHtml.split(" ")[0]
        } ${paletteData.getTetradicMode()}`;
      }
      return;
    }
    if (target.classList.contains("dimmed")) {
      this.unDimSchemeButton(target);
    } else {
      this.dimSchemeButton(target);
    }
  },
  onclickSelectAll() {
    const targets = Array.from(Object.values(userObjects.schemes));
    targets.forEach((target) => {
      if (target.classList.contains("dimmed")) this.unDimSchemeButton(target);
    });
  },
  onclickSelectNone() {
    const targets = Array.from(Object.values(userObjects.schemes));
    targets.forEach((target) => {
      if (!target.classList.contains("dimmed")) this.dimSchemeButton(target);
    });
  },
};
export const paletteUi = {
  // new custom colour functions
  hasCustomColour(colour) {
    return paletteData.getCustomColour(colour.name);
  },
  getCustomNameOrName(colour) {
    return paletteData.getCustomColour(colour.name).customName || colour.name;
  },
  //isCustomColour?
  //hasCustomColour?
  //addColourToCustomColours
  //addColourToBackgroundColours
  //addColourToGradientMaker
  //addColourArrayToGradientColours
  //UpdateLabels
  //UpdateClipboardContent

  // New Custom colour functions
  _getUiObject(id) {
    return userObjectsAll[id];
  },
  _addAllColoursToPalette(primaryColour) {
    const variantColoursArray =
      variantMaker.addAllColoursToPalette(primaryColour);
    variantColoursArray.forEach((x) => this.addColour(x));
  },
  _debounce() {
    this._addAllColoursToPaletteDb = throttleDebounce.debounce(
      (primaryColour) => paletteUi._addAllColoursToPalette(primaryColour),
      250
    );
  },
  _clipboardColourspaceLookup: {
    hex: "#ce9178",
    hsl: "#b5cea8",
    rgb: "#DCDCAA",
  },
  _randomiseHeaderBackground() {
    document.querySelector(".header").style.backgroundColor =
      colourObject.makeRandomHslStringSafer();
  },
  _randomiseColourSpace() {
    const colourspaceArray = ["rgb", "hsl", "hex"];
    const randomIndex = Math.floor(Math.random() * 3);
    this._setColourspace(colourspaceArray[randomIndex]);
  },
  _randomiseGradient() {
    paletteData.paletteState.gradientMode = 1 + Math.floor(Math.random() * 9);
    this._updateGradientNumberTones();
    this._updateGradientsAll();
    this._setClipboardTextAll();
  },
  _init() {
    this.customBackgroundCounter = this._updateClipboard = 0;
    this._debounce();
    this._randomiseDice();
    this._randomisePrimary();
    this._setOnChange();
    paletteState._resetAllCustomStates();
    this._randomiseColourSpace();
    this._randomiseGradient();
    paletteState.setCustomStatesfromWrappers();
    paletteState.deepCopyPaletteState(
      paletteData.paletteState,
      paletteData.savedState
    );
    console.log(userObjects);
    console.log(paletteData);
  },
  _splitName(name, separator = "-") {
    return name.split(separator)[0];
  },
  _resetSmallWrapperContent() {
    userObjects.smallSwatchNamesArray.forEach(
      (x) => (userObjects.wrappers[x + "-wrapper"].dataset.content = x)
    );
  },
  _getColourspace() {
    return (
      paletteData.getColourSpace().toLowerCase() ||
      userObjects.other["colourspace"].innerHTML.split(" ")[1].toLowerCase()
    );
  },
  _setColourspace(colourspace) {
    userObjects.other["colourspace"].innerHTML = `Mode: ${colourspace}`;
    paletteData.setColourSpace(colourspace);
    this._setSliderStyles(colourspace);
    this._setClipboardTextAll();
    this.getAllSwatchNames().forEach(
      (name) =>
        (userObjects.copyButtons[name + "-copybtn"].innerHTML =
          this.getColourObject(name)[colourspace])
    );
    this._addPrimaryColour(this.getColourObject("primary"));
  },

  _setSliderValues(valuesArray, colourspace) {
    const inputArray = colourObject._convertSliderInput(
      valuesArray,
      colourspace
    );
    userObjects.sliders.forEach((x, i) => (x.value = inputArray[i]));
  },
  _getSliderValues(colourspace) {
    return colourObject._convertSliderOutput(
      userObjects.sliders.map((x) => x.value),
      colourspace
    );
  },
  _updateGldLogoColour(hex) {
    userObjects.other.gldlogo.style.backgroundColor = hex;
  },
  _addPrimaryColour(primaryColour) {
    const colourspace = this._getColourspace();
    const { hue, sat, lum, red, green, blue, hex, tint, warmth, lightness } =
      primaryColour;
    const selectColourObject = {
      hex: [tint, warmth, lightness],
      hsl: [hue, sat, lum],
      rgb: [red, green, blue],
    };
    this._setSliderValues(selectColourObject[colourspace], colourspace);
    this._resetSmallWrapperContent();
    userObjects.pickers["primary-picker"].value = hex;
    this._updateGldLogoColour(hex);
    paletteData.setPrimaryHex(hex);
    userObjects.copyButtons["primary-copybtn"].innerHTML =
      primaryColour[colourspace];
    this.setBackgroundGradient(primaryColour);
    this.setTextMode("auto");
    paletteUi.setTextColour(primaryColour);
    paletteState._resetAllCustomStates();
    this._addAllColoursToPaletteDb(primaryColour);
    colourScheme.applyAllGradients();
    this._updateClipboard = 1;
    this._setClipboardTextAll();
  },
  addColour(newColour) {
    paletteData.addColour(newColour);
    if (newColour.name === "primary") {
      this._addPrimaryColour(newColour);
      return;
    }
    paletteUi.setTextColour(newColour);
    this.setBackgroundGradient(newColour);
    userObjects.pickers[newColour.name + "-picker"].value = newColour.hex;
    userObjects.copyButtons[newColour.name + "-copybtn"].innerHTML =
      newColour[this._getColourspace()];
    this._setClipboardTextAll();
  },
  setBackgroundGradient(colour) {
    const stops = paletteData.paletteState.gradientMode;
    const name = colour.name;
    const [string, gradientColours] = gradientMaker.updateGradient(
      colour,
      stops
    );
    gradientColours === null
      ? paletteData.clearGradientColours(name)
      : paletteData.addGradientColours(name, gradientColours);
    if (name === "primary") {
      userObjects.wrappers[name + "-wrapper"].style.background =
        paletteData.getPrimaryHex();
      userObjects.other.gradient.style.background = string;
      return;
    }
    userObjects.wrappers[name + "-wrapper"].style.background = string;
  },
  _getSliderColourObject() {
    const selectColourKeys = {
      hex: ["tint", "warmth", "lightness"],
      hsl: ["hue", "sat", "lum"],
      rgb: ["red", "green", "blue"],
    };
    const selectColourMethod = {
      hex: "fromTwl",
      hsl: "fromHsl",
      rgb: "fromSrgb",
    };

    const colourspace = this._getColourspace();
    const keysArray = selectColourKeys[colourspace];
    const sliderValuesArray = this._getSliderValues(colourspace);
    const returnObject = { name: "primary" };

    keysArray.forEach((x, i) => (returnObject[x] = sliderValuesArray[i]));
    return colourObject[selectColourMethod[colourspace]](returnObject);
  },
  _oninputSlider(x) {
    this.addColour(this._getSliderColourObject());
  },
  _incrementGradientNumberTones() {
    paletteData.paletteState.gradientMode =
      clampRotate.rotate(
        1 * paletteData.paletteState.gradientMode + 1,
        1,
        10
      ) || 1;
  },
  _updateGradientsAll() {
    paletteData.backgroundColours.forEach((colour) => {
      this.setBackgroundGradient(colour);
    });
  },
  _updateGradientNumberTones() {
    let numberTones = parseInt(paletteData.paletteState.gradientMode);
    if (numberTones === 1) numberTones = 0;
    userObjects.other["gradient"].innerHTML = "Tones: " + numberTones;
  },
  _onclickGradient() {
    this._incrementGradientNumberTones();
    this._updateGradientNumberTones();
    this._updateGradientsAll();
    this._setClipboardTextAll();
  },
  _randomiseDice() {
    userObjects.wrappers["dieA"].style.backgroundColor =
      colourObject.makeRandomHslString();
    userObjects.wrappers["dieB"].style.backgroundColor =
      colourObject.makeRandomHslString();
  },
  _randomisePrimary() {
    this.addColour(colourObject.makeRandomColour("primary"));
  },
  _onclickRandom() {
    this._randomisePrimary();
    this._randomiseDice();
  },
  _onclickLogo() {
    this._randomisePrimary();
    this._randomiseDice();
    this._randomiseColourSpace();
    this._randomiseGradient();
  },
  _onclickHeader(event) {
    if (
      event.target.classList.value === "navbar" ||
      event.target.classList.value === "logo-grid" ||
      event.target.classList.value === "logoproduct"
    ) {
      const newHue = 360 * (event.clientX / top.innerWidth).toFixed(2);
      const primary = paletteData.backgroundColours.get("primary");
      this.addColour(
        colourObject.fromHsl({
          name: primary.name,
          hue: newHue,
          sat: primary.sat,
          lum: primary.lum,
        })
      );
    }
  },
  _addCustomTextColour(hex) {
    this.setTextMode("custom");
    const name = "primary-text";
    const textColour = colourObject.fromHex({ name: name, hex: hex });
    this.getAllSwatchNames().forEach((key) => {
      const backgroundColour = paletteData.getColourObject(
        this._splitName(key)
      );
      const newTextColour = colourObject.makeTextColour(
        textColour,
        backgroundColour
      );
      if (newTextColour.name === "primary-text") {
        paletteData.setMainTextColour(newTextColour);
      }
      this._setWrapperTextColour(newTextColour);
      paletteData.addTextColour(newTextColour);
    });
    colourScheme.applyAllGradients();
  },
  isCustomColour(name) {
    if (name !== "primary" && this._getWrapperContent(name)[0] === "c")
      return paletteData.getCustomColourName(name);
    return null;
  },
  _addCustomColour(name, hex) {
    const customName =
      paletteData.getCustomColourName(name) ||
      `custom${++this.customBackgroundCounter}`;
    paletteData.addCustomColour(
      name,
      colourObject.fromHex({ name: name, customName: customName, hex: hex })
    );
    paletteData.setCustomColourState(name, "custom");
    userObjects.wrappers[name + "-wrapper"].dataset.content = customName;
    return colourObject.fromHex({
      name: name,
      customName: customName,
      hex: hex,
    });
  },
  _oninputPicker(x) {
    const name = this._splitName(x.target.id);
    const hex = x.target.value;
    if (name === "textcolour") {
      this._addCustomTextColour(hex);
      return;
    }
    let newColour;
    if (name !== "primary") {
      newColour = this._addCustomColour(name, hex);
    } else {
      const newPartial = { hex: hex };
      newPartial.name = name;
      newColour = colourObject.fromHex(newPartial);
    }
    this.addColour(newColour);
  },
  _onclickPickerSmall(e) {
    const name = this._splitName(e.target.id);

    const customColour = paletteData.getCustomColour(name);
    if (customColour == null) return;
    //this._addCustomColour(customColour.name, customColour.hex);
    this.addColour(customColour);
    const wrapper = userObjects.wrappers[customColour.name + "-wrapper"];
    wrapper.dataset.content = customColour.customName;
    this.setBackgroundGradient(customColour);
    paletteData.setCustomColourState(name, "custom");
    this._setClipboardTextAll();
  },
  _getClipboardTextSingle(name) {
    const colourspace = this._getColourspace();
    const prefix = paletteData.getPrefix();
    let customName = paletteData.getCustomColourName(name) || name;
    const textArray = [
      `${prefix}${customName}: ${
        paletteData.getColourObject(name)[colourspace]
      }`,
    ];
    const gradientColours = paletteData.getGradientColours(name);
    if (gradientColours != null) {
      gradientColours.forEach((x) => {
        customName = paletteData.getCustomColourName(x.name) || x.name;
        textArray.push(`${prefix}${customName}: ${x[colourspace]}`);
      });
    }
    return textArray.join("\n");
  },
  _getClipboardTextSingleAsArray(name) {
    const colourspace = this._getColourspace();
    const prefix = paletteData.getPrefix();
    let customName = paletteData.getCustomColourName(name) || name;
    const textArray = [
      [`${prefix}${customName}: `],
      [`${paletteData.getColourObject(name)[colourspace]}`],
      [
        `${prefix}${customName}: ${
          paletteData.getColourObject(name)[colourspace]
        }`,
      ],
    ];
    const gradientColours = paletteData.getGradientColours(name);
    if (gradientColours != null) {
      gradientColours.forEach((x) => {
        customName = paletteData.getCustomColourName(x.name) || x.name;

        textArray[0].push(`${prefix}${customName}: `);
        textArray[1].push(`${x[colourspace]}`);
        textArray[2].push(`${prefix}${customName}: ${x[colourspace]}`);
      });
    }

    return [textArray[0], textArray[1], textArray[2]];
  },
  _clipboard: userObjects.clipboard.clipboard,
  _clipboardSecondary: userObjects.clipboard["clipboard-secondary"],

  _setClipboardTextAll() {
    if (this._updateClipboard === 0) return;
    const swatchNames = this.getAllSwatchNames();
    const colourspace = this._getColourspace();
    const prefix = paletteData.getPrefix();
    const textArray = [[], [], []];
    swatchNames.forEach((x) => {
      const returnArray = this._getClipboardTextSingleAsArray(x);
      textArray[0].push(...returnArray[0]);
      textArray[1].push(...returnArray[1]);
      textArray[2].push(...returnArray[2]);
    });
    paletteData.setClipboard(textArray);

    this._clipboard.innerHTML = textArray[0].join("\n");

    this._clipboardSecondary.innerHTML = textArray[1].join("\n");
    this._clipboardSecondary.style.color =
      this._clipboardColourspaceLookup[this._getColourspace()];
  },
  _onclickCopyAll(target) {
    const copyAllCSS = userObjects.copyButtons.copyAllCSS;
    const clipboardFlexbox = userObjects.copyButtons["clipboard-flexbox"];
    target.id === "copyAllCSS"
      ? this._showCompletedMessage(copyAllCSS, "Copied All")
      : this._showCompletedMessage(clipboardFlexbox, "Copied All");
    const textArray = paletteData.getClipboard()[2];
    let text = textArray.join(";\n\r");
    navigator.clipboard.writeText(text);
    console.log(`Copied To Clipboard:\n${text}`);
  },
  _showCompletedMessage(target, message = "Copied") {
    const revertMessage = target.dataset.content;
    target.dataset.content = message + " ✔";
    setTimeout(() => {
      target.dataset.content = revertMessage;
    }, 1800);
  },
  _onclickEmail(target) {
    const textArray = paletteData.getClipboard()[2];
    let linebreak = `;%0D%0A`;
    let text = textArray.join(linebreak);
    const subjectMessage = `GLD Colourmatic 5000 colours for you`;
    const bodyMessage = `Thank you for using the GLD Colourmatic 5000!%0D%0A%0D%0AHere is your chosen palette:%0D%0A%0D%0A${text}`;
    window.open(
      `mailto:youremail@address?subject=${subjectMessage}&body=${bodyMessage}`
    );
  },
  _onclickCopyButtons(e) {
    const name = this._splitName(e.target.id);
    if (name === "copyAllCSS" || name === "clipboard") {
      this._onclickCopyAll(e.target);
      return;
    } else if (name === "email") {
      this._onclickEmail(e.target);
      return;
    }
    const message =
      paletteData.paletteState.gradientMode > 1 ? "Copied + Tones " : "Copied";
    this._showCompletedMessage(e.target, message);
    const text = this._getClipboardTextSingle(name);
    navigator.clipboard.writeText(text);
    //console.log(`Copied To Clipboard:\n${text}`);
  },
  sliderTimeout: "",
  _setSliderStyles(colourspace) {
    const sliderNameArrays = {
      hex: ["tint", "warmth", "lightness"],
      hsl: ["hue", "saturation", "luminance"],
      rgb: ["red", "green", "blue"],
    };
    /*         const sliderGradientArrays = {
            hex: [ 'background:linear-gradient(to right, #d00,#0d0)', 'background:linear-gradient(to left, #dd0,#00d)', 'background:linear-gradient(to left, #fff,#555)'],
            hsl: [ 'linear-gradient(to right, hsl(0,$sat,$lum), hsl(60,$sat,$lum), hsl(120,$sat,$lum), hsl(180,$sat,$lum), hsl(240,$sat,$lum), hsl(300,$sat,$lum), hsl(360,$sat,$lum))', 'linear-gradient(to right, hsl(0, 0%,$lum), hsl(60, 10%,$lum), hsl(120, 20%,$lum), hsl(180, 40%,$lum), hsl(240, 80%,$lum), hsl(300, 100%,$lum), hsl(360, 100%,$lum))', 'background:linear-gradient(to left, #fff,#555)'],
            rgb: [ 'background:linear-gradient(to left, #000,#d00)', 'background:linear-gradient(to left, #000,#0d0)', 'background:linear-gradient(to left, #000,#00d)'],
        }
 */
    const namesArray = sliderNameArrays[colourspace];
    clearTimeout(this.sliderTimeout);
    userObjects.sliders.forEach((x, i) => {
      x.name = namesArray[i];
      x.classList.add("fakesliderhover");
    });
    const removeNamesLoop = () => {
      userObjects.sliders.forEach((x) => {
        x.classList.remove("fakesliderhover");
      });
    };
    this.sliderTimeout = setTimeout(removeNamesLoop, 1800);
  },
  _onclickColourspace() {
    const colourspaceButton = userObjects.other.colourspace.innerHTML;
    const colourspace = this._getColourspace();
    const nextColourspaceSelector = { rgb: "hex", hex: "hsl", hsl: "rgb" };
    const newColourspace = nextColourspaceSelector[colourspace];
    this._setColourspace(newColourspace);
  },
  _onclickPrefix() {
    const prefix = paletteData.getPrefix();
    const prefixMode = paletteData.getPrefixMode();
    if (prefixMode === "SCSS") {
      paletteData.setPrefixMode("CSS");
      userObjects.other["prefix"].innerHTML = `Prefix: CSS`;
      paletteData.setPrefix("--");
      this._setClipboardTextAll();
      return;
    }
    paletteData.setPrefixMode("SCSS");
    userObjects.other["prefix"].innerHTML = `Prefix: SCSS`;
    paletteData.setPrefix("$");
    this._setClipboardTextAll();
  },
  _loadHistoryObject(event) {
    const hex = event.target.innerHTML.split(" ")[1];
    if (hex[0] !== "#") return;
    const newState = paletteState.deepCopyPaletteState(
      paletteData.savedPalettes[hex]
    );
    paletteState.applyStatefromHistoryObject(newState);
  },
  _SaveHistoryObject(event) {
    const hex = paletteData.getPrimaryHex();
    const copyPaletteState = paletteState.deepCopyPaletteState(
      paletteData.paletteState
    );
    if (paletteData.savedPalettes[hex] === undefined) {
      const element = document.createElement("button");
      element.innerHTML = `${++paletteState.saveCounter}) ${hex}`;
      element.style.backgroundColor = hex;
      element.classList.add("saved-palette");
      element.dataset.content = "Load Palette";
      element.style.color =
        paletteData.getMainTextColourHex() ||
        paletteData.getTextColour("primary-text").hex;
      userObjects.history["history-flexbox"].append(element);
      document.querySelector("#history-flexbox").scrollTop = "1000";
    }
    paletteData.savedPalettes[hex] = copyPaletteState;
    //paletteUi._showCompletedMessage(event.target, 'Saved Palette');
  },
  _clearHistory() {
    userObjects.history["history-flexbox"].innerHTML = "";
  },
  setTextPickerDisabled(boolean) {
    userObjects.pickers["textcolour-picker"].disabled = boolean;
  },
  _onclickTextMode() {
    if (paletteUi.getTextMode() === "auto") {
      paletteUi.setTextMode("custom");
      paletteUi.setTextPickerDisabled(false);
      if (paletteData.getMainTextColour() != null) {
        paletteUi._addCustomTextColour(paletteData.getMainTextColourHex());
      }
    } else {
      //text mode is custom
      paletteUi.setTextMode("auto");
      paletteUi.setTextPickerDisabled(true);
      const primaryColour = paletteData.getColourObject("primary");
      paletteUi.addColour(primaryColour);
    }
  },
  _setOnChange() {
    userObjects.other["colourspace"].onclick = () => this._onclickColourspace();
    userObjects.other["prefix"].onclick = () => this._onclickPrefix();
    userObjects.other["gradient"].onclick = () => this._onclickGradient();
    userObjects.other["dice-btn"].onclick = () => this._onclickRandom();
    userObjects.other["random-colour"].onclick = () => this._onclickRandom();
    userObjects.other["gldlogo"].onclick = () => this._onclickLogo();
    userObjects.other["header"].onclick = (e) => this._onclickHeader(e);
    Object.keys(userObjects.copyButtons).forEach(
      (x) =>
        (userObjects.copyButtons[x].onclick = (e) =>
          this._onclickCopyButtons(e))
    );
    Object.keys(userObjects.schemes).forEach(
      (x) =>
        (userObjects.schemes[x].onclick = (e) =>
          colourScheme._onclickSchemeButtons(e))
    );
    userObjects.other["select-all"].onclick = () =>
      colourScheme.onclickSelectAll();
    userObjects.other["select-none"].onclick = () =>
      colourScheme.onclickSelectNone();

    userObjects.sliders.forEach(
      (x) =>
        (x.oninput = throttleDebounce.throttle(
          (x) => this._oninputSlider(x),
          85
        ))
    );
    Object.keys(userObjects.pickers).forEach(
      (x) =>
        (userObjects.pickers[x].oninput = throttleDebounce.throttle(
          (x) => this._oninputPicker(...x),
          85
        ))
    );
    this.getSmallSwatchNames().forEach(
      (x) =>
        (userObjects.pickers[x + "-picker"].onclick = (e) =>
          this._onclickPickerSmall(e))
    );
    userObjects.other["textmode"].addEventListener(
      "click",
      this._onclickTextMode,
      true
    );
    //userObjects.pickers['textcolour-picker'].addEventListener('click', this._onclickPickerText, true)

    //userObjects.pickers['textcolour-picker'].onclick = (e) => this._onclickPickerText(e);
    this._getUiObject("hamburger-toggle").onclick = (x) => {
      this._getUiObject("navbar-list").classList.toggle("active");
    };
    document
      .querySelector("#history-flexbox")
      .addEventListener("click", this._loadHistoryObject, true);
    this._getUiObject("save-button").addEventListener(
      "click",
      this._clearHistory,
      {
        once: true,
      }
    );
    this._getUiObject("save-button").addEventListener(
      "click",
      this._SaveHistoryObject
    );
  },
  getStops() {
    return userObjects.other["gradient"].innerHTML.toLowerCase();
  },
  userObjects() {
    return userObjects;
  },
  getColourObject(name) {
    return paletteData.getColourObject(name);
  },
  getTextMode() {
    return paletteData.getTextMode();
  },
  setTextMode(mode) {
    paletteData.setTextMode(mode);
    userObjects.other["textmode"].dataset.label = `Text: ${mode}`;
  },
  getTextColour(backgroundColour) {
    return paletteData.getTextColour(backgroundColour);
  },
  _getWrapper(name) {
    return userObjects.wrappers[name + "-wrapper"];
  },
  _getWrapperContent(name) {
    if (name === "primary") return null;
    return userObjects.wrappers[name + "-wrapper"].dataset.content;
  },

  _setWrapperTextColour(textColour) {
    const name = this._splitName(textColour.name);
    const wrapper = this._getWrapper(name);
    wrapper.style.color = textColour.hex || "#000000";
    if (name === "primary") {
      wrapper.dataset.content = textColour.contrastString;
    }
    if (name !== "primary") wrapper.dataset.rating = textColour.rating;
  },
  setTextColour(backgroundColour) {
    const textMode = paletteUi.getTextMode();
    const oldTextColour =
      textMode === "custom" ? paletteUi.getTextColour(backgroundColour) : null;
    const newTextColour = colourObject.makeTextColour(
      oldTextColour,
      backgroundColour
    );
    if (newTextColour.name === "primary-text") {
      paletteData.setMainTextColour(newTextColour);
    }
    this._setWrapperTextColour(newTextColour);
    paletteData.addTextColour(newTextColour);
  },
  setTetradicMode(tetradicToSet = null) {
    tetradicToSet === null
      ? paletteData.incrementTetradicMode()
      : paletteData.setTetradicMode(tetradicToSet);
    const tetradicMode = paletteData.getTetradicMode();
    const primaryColour = paletteData.getPrimaryColour();
    const newTetradicColours = variantMaker.getUpdatedTetradicColours(
      tetradicMode,
      primaryColour
    );
    newTetradicColours.forEach((x) => {
      paletteUi.addColour(x);
    });
    colourScheme.applyGradient("Tetradic");
  },
  getSmallSwatchNames() {
    return userObjects.smallSwatchNamesArray;
  },
  getAllSwatchNames() {
    return ["primary", ...userObjects.smallSwatchNamesArray];
  },
};
