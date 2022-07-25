const selectorsArray = [
    ['pickers','input[type="color"]'],
    ['sliders','input[type="range"]'],
    ['wrappers','wrapper'],
    ['buttons','button'],
    ['labels','label'],
];

function setAll(){
    const returnObject = {}
    selectorsArray.forEach( selector => {
        returnObject[selector[0]] = {};
        document.querySelectorAll(selector[1]).forEach( x =>
            returnObject[selector[0]][x.id] = document.getElementById(x.id));
        }        );
    returnObject.swatchNamesArray = [];
    Object.keys(returnObject.pickers).forEach(x => returnObject.swatchNamesArray.push(x.split('-')[0]));
    return returnObject;
};


export const paletteUi = setAll();