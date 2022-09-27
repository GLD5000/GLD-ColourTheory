import { userObjectsAll } from "../view/userobjects.js";
import { userObjects } from "../view/userobjects.js";
import { colourObject } from "../utilities/colourobject.js";
import { paletteData } from "./palettedata.js";
import { throttleDebounce } from "../utilities/utilities.js";
import { variantMaker } from "./variantmaker.js";
import { gradientMaker } from "./gradientmaker.js";
import { clampRotate } from "../utilities/utilities.js";
import { randomItemFromArray } from "../utilities/utilities.js";
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
        userObjectsAll[name + "-wrapper"].dataset.content[0].toLowerCase() ===
        "c"
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
    const primitiveAddressArray = [];
    const objectAddressArray = [];
    Object.keys(sourceObject).forEach((key) => {
      if (typeof sourceObject[key] !== "object") {
        primitiveAddressArray.push(key);
        return;
      }
      objectAddressArray.push(key);
    });
    //console.log(objectAddressArray);
    /* const primitiveAddressArray = [
      "primaryHex",
      "gradientMode",
      "prefixMode",
      "prefix",
      "textMode",
      "textColour",
      "colourspace",
      "tetradicMode",
    ]; */
    const deepCopy = {};
    primitiveAddressArray.forEach((name) => {
      deepCopy[name] = sourceObject[name];
    });
    /*     const objectAddressArray = [
      "smallSwatchCustomState",
      "customColours",
      "schemes",
      "swatchVisibility",
    ];
 */ objectAddressArray.forEach((name) => {
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
    colourScheme.restoreAll();
  },
};
const colourScheme = {
  _randomiseTetradicMode() {
    const tetradicModeArray = ["Square", "Rectangular A", "Rectangular B"];
    paletteUi.setTetradicMode(randomItemFromArray(tetradicModeArray));
  },
  _randomiseScheme() {
    const schemeArray = [
      ["Monochrome", "Neutral"],
      ["Analogous", "Neutral"],
      ["Complementary", "Neutral"],
      ["Split", "Neutral"],
      ["Triadic", "Neutral"],
      ["Tetradic", "Neutral"],
      ["Monochrome", "Analogous", "Neutral"],
      ["Split", "Analogous", "Neutral"],
      ["Monochrome", "Split", "Neutral"],
      ["Triadic", "Monochrome", "Neutral"],
      ["Tetradic", "Monochrome", "Neutral"],
      ["Monochrome", "Complementary", "Neutral"],
    ];
    colourScheme.onclickSelectNone();
    const randomScheme = randomItemFromArray(schemeArray);
    if (randomScheme.includes("Tetradic"))
      colourScheme._randomiseTetradicMode(); // if scheme contains tetradic, randomise tetradic mode
    randomScheme.forEach((name) => {
      colourScheme.unDimSchemeButton(userObjects.schemes[name]);
    });
    colourScheme.buildOverallGradient();
  },

  storeSchemeStatus(scheme) {
    const id = scheme.id;
    const classToApply = id === "Neutral" ? "dimmed-neutral" : "dimmed";
    paletteData.paletteState.schemes[id] = scheme.classList.contains(
      classToApply
    )
      ? "dimmed"
      : null; // dimmed / null
  },
  storeSwatchVisibility(swatch) {
    const id = swatch.id;
    const classToApply = "hidden";

    paletteData.paletteState.swatchVisibility[id] = swatch.classList.contains(
      classToApply
    )
      ? "hidden"
      : null; // hidden / null
  },

  storeStatusAllSchemes() {
    Object.keys(userObjects.schemes).forEach((key) => {
      const scheme = userObjects.schemes[key];
      colourScheme.storeSchemeStatus(scheme);
    });
    Object.keys(userObjects.swatches).forEach((key) => {
      const swatch = userObjects.swatches[key];
      colourScheme.storeSwatchVisibility(swatch);
    });
  },
  overallGradientString: "",
  buildOverallGradient() {
    const namesArray = ["primary"];
    const hexArray = [];
    userObjects.smallSwatchNamesArray.forEach((name) => {
      if (paletteData.paletteState.swatchVisibility[name] === null)
        namesArray.push(name);
    });
    const stopWidth = 50 / (namesArray.length - 1);
    const stopOffset = 50 - stopWidth;
    namesArray.forEach((name, index) => {
      const stopBegin = index * stopWidth + stopOffset + "%";
      const stopEnd = (index + 1) * stopWidth + stopOffset + "%";
      hexArray.push(
        `${paletteData.getColourObject(name).hex} ${stopBegin}, 
        ${paletteData.getColourObject(name).hex} ${stopEnd}`
      );
      paletteUi._setClipboardTextAll();
    });
    colourScheme.overallGradientString = "linear-gradient(to right, ";
    colourScheme.overallGradientString += hexArray.join(",");
    colourScheme.overallGradientString += ")";
    userObjects.other["current-colours"].style.background =
      colourScheme.overallGradientString;
  },
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
    if (name === "Neutral") {
      userObjects.swatches["neutral"].classList.add("hidden");
      paletteData.paletteState.swatchVisibility["neutral"] = "hidden";
      paletteData.paletteState.schemes["Neutral"] = "dimmed-neutral";
      return;
    }
    paletteData.paletteState.schemes[name] = "dimmed";

    if (
      name === "Complementary" &&
      !userObjects.schemes["Tetradic"].classList.contains("dimmed")
    )
      return;
    if (
      name === "Tetradic" &&
      userObjects.schemes["Complementary"].classList.contains("dimmed")
    )
      userObjects.swatches["tetradicA"].classList.add("hidden");
    paletteData.paletteState.swatchVisibility["tetradicA"] = "hidden";
    colourScheme.hideLookup[name].forEach((x) => {
      userObjects.swatches[x].classList.add("hidden");
      paletteData.paletteState.swatchVisibility[x] = "hidden";
    });
  },
  showSwatches(name) {
    if (name === "Neutral") {
      userObjects.swatches["neutral"].classList.remove("hidden");
      paletteData.paletteState.swatchVisibility["neutral"] = null;
      paletteData.paletteState.schemes[name] = null;
      return;
    }
    paletteData.paletteState.schemes[name] = null;

    if (name === "Tetradic") {
      userObjects.swatches["tetradicA"].classList.remove("hidden");
      paletteData.paletteState.swatchVisibility["tetradicA"] = null;
    }
    colourScheme.hideLookup[name].forEach((x) => {
      userObjects.swatches[x].classList.remove("hidden");
      paletteData.paletteState.swatchVisibility[x] = null;
    });
  },
  convertSwatchNamesToGradientString(swatchNamesArray) {
    const hexArray = [];
    swatchNamesArray.forEach((name, i) => {
      hexArray.push(
        `${paletteData.getColourObject(name).hex} ${
          i * (100 / swatchNamesArray.length)
        }%, 
        ${paletteData.getColourObject(name).hex} ${
          (1 + i) * (100 / swatchNamesArray.length)
        }%`
      );
    });
    let gradientString = "linear-gradient(to right, ";
    gradientString += hexArray.join(",");
    gradientString += ")";
    return gradientString;
  },
  applyGradient(name) {
    userObjects.schemes[name].style.color = paletteData.getMainTextColourHex();
    if (name === "Neutral") {
      return;
    }
    const gradientString = colourScheme.convertSwatchNamesToGradientString(
      colourScheme.nameLookup[name]
    );

    userObjects.schemes[name].style.background = gradientString;
  },
  applyAllGradients() {
    Object.keys(colourScheme.nameLookup).forEach((key) => {
      colourScheme.applyGradient(key);
    });
    colourScheme.buildOverallGradient();
  },
  restoreStatusAllSchemes() {
    Object.entries(userObjects.schemes).forEach((pair) => {
      const name = pair[0];
      const element = pair[1];
      const schemeState = paletteData.paletteState.schemes[name];
      const schemeStateIsDimmed =
        schemeState === "dimmed" || schemeState === "dimmed-neutral";
      const elementContainsDimmed =
        element.classList.contains("dimmed") ||
        element.classList.contains("dimmed-neutral");

      if (schemeStateIsDimmed && !elementContainsDimmed) {
        colourScheme.dimSchemeButton(element);
      }
      if (!schemeStateIsDimmed && elementContainsDimmed) {
        colourScheme.unDimSchemeButton(element);
      }
    });
    Object.keys(userObjects.swatches).forEach((key) => {
      const swatch = userObjects.swatches[key];
      colourScheme.storeSwatchVisibility(swatch);
    });
  },

  restoreAll() {
    colourScheme.restoreStatusAllSchemes();
    colourScheme.applyAllGradients();
  },
  dimSchemeButton(target) {
    if (target.id === "Tetradic") {
      let innerHtml = target.innerHTML;
      target.classList.add("dimmed");
      target.innerHTML = innerHtml.split(" ")[0];
      colourScheme.hideSwatches(target.id);
      return;
    }
    target.id === "Neutral"
      ? target.classList.add("dimmed-neutral")
      : target.classList.add("dimmed");
    colourScheme.hideSwatches(target.id);
  },
  unDimSchemeButton(target) {
    if (target.id === "Split") {
      target.classList.remove("dimmed");
      colourScheme.showSwatches(target.id);
      return;
    }
    if (target.id === "Tetradic") {
      let innerHtml = target.innerHTML;
      target.classList.remove("dimmed");
      target.innerHTML = `${
        innerHtml.split(" ")[0]
      } ${paletteData.getTetradicMode()}`;
      colourScheme.showSwatches(target.id);
      return;
    }
    target.id === "Neutral"
      ? target.classList.remove("dimmed-neutral")
      : target.classList.remove("dimmed");
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
      colourScheme.buildOverallGradient();
      return;
    }
    if (
      target.classList.contains("dimmed") ||
      target.classList.contains("dimmed-neutral")
    ) {
      this.unDimSchemeButton(target);
    } else {
      this.dimSchemeButton(target);
    }
    colourScheme.buildOverallGradient();
  },
  onclickSelectAll() {
    const targets = Array.from(Object.values(userObjects.schemes));
    targets.forEach((target) => {
      if (
        target.classList.contains("dimmed") ||
        target.classList.contains("dimmed-neutral")
      )
        this.unDimSchemeButton(target);
    });
    colourScheme.buildOverallGradient();
  },
  onclickSelectNone() {
    const targets = Array.from(Object.values(userObjects.schemes));
    targets.forEach((target) => {
      if (
        !target.classList.contains("dimmed") ||
        !target.classList.contains("dimmed-neutral")
      )
        this.dimSchemeButton(target);
    });
    colourScheme.buildOverallGradient();
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
  _randomiseAll() {
    this._randomisePrimary();
    this._randomiseColourSpace();
    this._randomiseGradient();
    colourScheme._randomiseScheme();
  },
  _init() {
    this.customBackgroundCounter = this._updateClipboard = 0;
    this._debounce();
    colourScheme.storeStatusAllSchemes();
    this._randomiseAll();
    this._setOnChange();
    paletteState._resetAllCustomStates();
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
    /*     this.getAllSwatchNames().forEach(
      (name) =>
        (userObjects.copyButtons[name + "-copybtn"].innerHTML =
          this.getColourObject(name)[colourspace])
    );
 */ this._addPrimaryColour(this.getColourObject("primary"));
  },

  _setSliderValues(valuesArray, colourspace) {
    const inputArray = colourObject.convertSliderInput(
      valuesArray,
      colourspace
    );
    userObjects.sliders.forEach((x, i) => (x.value = inputArray[i]));
  },
  _getSliderValues(colourspace) {
    return colourObject.convertSliderOutput(
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
    /*     userObjects.copyButtons["primary-copybtn"].innerHTML =
      primaryColour[colourspace];
 */
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
    /*     userObjects.copyButtons[newColour.name + "-copybtn"].innerHTML =
      newColour[this._getColourspace()];
 */ this._setClipboardTextAll();
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
  _randomisePrimary() {
    this.addColour(colourObject.makeRandomColour("primary"));
  },
  _onclickRandom() {
    this._randomisePrimary();
  },
  _onclickLogo() {
    this._randomisePrimary();
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
  _onclickPickerMain(e) {
    userObjects.pickers["primary-picker"].click();
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
    let lookupName =
      userObjects.wrappers[name + "-wrapper"].dataset.content[0] === "c"
        ? paletteData.getCustomColourName(name) || name
        : name;
    const textArray = [
      [`${prefix}${lookupName}: `],
      [`${paletteData.getColourObject(name)[colourspace]}`],
      [
        `${prefix}${lookupName}: ${
          paletteData.getColourObject(name)[colourspace]
        }`,
      ],
    ];
    const gradientColours = paletteData.getGradientColours(name);
    if (gradientColours != null) {
      gradientColours.forEach((x) => {
        lookupName = paletteData.getCustomColourName(x.name) || x.name;

        textArray[0].push(`${prefix}${lookupName}: `);
        textArray[1].push(`${x[colourspace]}`);
        textArray[2].push(`${prefix}${lookupName}: ${x[colourspace]}`);
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
      if (paletteData.paletteState.swatchVisibility[x] !== "hidden") {
        const returnArray = this._getClipboardTextSingleAsArray(x);
        textArray[0].push(...returnArray[0]);
        textArray[1].push(...returnArray[1]);
        textArray[2].push(...returnArray[2]);
      }
    });
    paletteData.setClipboard(textArray);

    this._clipboard.innerHTML = textArray[0].join("\n");
    //document.getElementById("clipboard-h3").innerHTML = `Copy ${textArray[0].length} CSS Variables`;
    userObjects.copyButtons.email.innerHTML = `Email (${textArray[0].length})`;
    userObjects.copyButtons.copyAllCSS.innerHTML = `Copy (${textArray[0].length})`;
    userObjects.copyButtons[
      "clipboard-flexbox"
    ].dataset.content = `Copy (${textArray[0].length})`;
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
    //console.log(`Copied To Clipboard:\n${text}`);
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
    const bodyMessage = `Thank you for using the GLD Colourmatic 5000!%0D%0A%0D%0AHere is your chosen colour palette:%0D%0A%0D%0A${text}`;
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
  _setSliderStyles(colourspace) {
    const sliderNameArrays = {
      hex: ["tint", "warmth", "lightness"],
      hsl: ["hue", "saturation", "luminance"],
      rgb: ["red", "green", "blue"],
    };
    const namesArray = sliderNameArrays[colourspace];
    userObjects.sliders.forEach((x, i) => {
      x.name = namesArray[i];
      userObjects["slider-headers"][i].innerHTML = `Adjust ${namesArray[i]}`;
    });
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
      document.getElementById("clipboard-h3").innerHTML = `Copy CSS Variables`;
      paletteData.setPrefix("--");
      this._setClipboardTextAll();
      return;
    }
    paletteData.setPrefixMode("SCSS");
    userObjects.other["prefix"].innerHTML = `Prefix: SCSS`;
    document.getElementById("clipboard-h3").innerHTML = `Copy SCSS Variables`;
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
      element.style.background = colourScheme.overallGradientString;
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
  _onclickTextMode(e) {
    //if (e.target.id !== "textmode") return;
    //console.log(e.target.id);
    if (paletteUi.getTextMode() === "auto") {
      //paletteUi.setTextMode("custom");
      paletteUi.setTextPickerDisabled(false);
      //userObjects.pickers["textcolour-picker"].click();
      if (
        paletteData.getMainTextColour().hex != "#000000" &&
        paletteData.getMainTextColour().hex != "#FFFFFF"
      ) {
        paletteUi._addCustomTextColour(paletteData.getMainTextColourHex());
      }
    } else {
      //paletteUi.setTextMode("auto");
      paletteUi.setTextPickerDisabled(true);
      const primaryColour = paletteData.getColourObject("primary");
      paletteUi.addColour(primaryColour);
    }
    colourScheme.applyAllGradients();
  },
  _onclickCustomPicker(e) {
    const pickerName =
      e.target.id?.split("-")[0] || e.target.parentElement.id.split("-")[0];
    userObjects.pickers[pickerName + "-picker"].click();
  },
  _setOnChange() {
    userObjects.other["colourspace"].onclick = () => this._onclickColourspace();
    userObjects.other["prefix"].onclick = () => this._onclickPrefix();
    userObjects.other["gradient"].onclick = () => this._onclickGradient();
    userObjects.other["random-colour"].onclick = () => this._onclickRandom();
    userObjects.other["random-scheme"].onclick = () =>
      colourScheme._randomiseScheme();
    userObjects.other["random-all"].onclick = () => this._randomiseAll();
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
    userObjects.smallSwatchNamesArray.forEach(
      (x) =>
        (userObjects.pickers[x + "-picker"].onclick = (e) =>
          this._onclickPickerSmall(e))
    );
    userObjects.wrappers["primary-wrapper"].onclick = (e) =>
      this._onclickPickerMain(e);
    userObjects.other["textmode"].addEventListener(
      "click",
      this._onclickTextMode,
      { useCapture: true }
    );
    userObjects.customButtons["monochromeA-custom"].addEventListener(
      "click",
      this._onclickCustomPicker,
      { useCapture: true }
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
    //document.onclick = (e) => {console.log(e.target);};
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
    userObjects.other["textmode"].children[0].innerHTML = `Text: ${mode}`;
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
      userObjects.labels["primary-info"].innerHTML = textColour.contrastString;
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
  getAllSwatchNames() {
    return ["primary", ...userObjects.smallSwatchNamesArray];
  },
};
