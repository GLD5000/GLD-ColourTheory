function setAll(){
    const selectorsArray = [
        ['pickers','input[type="color"]'],
        ['sliders','input[type="range"]','array'],//array
        ['wrappers','wrapper'],
        ['buttons','button'],
        ['labels','label'],
    ];  
    const returnObject = {}
    selectorsArray.forEach( selector => {
        if (selector[2] === 'array') {
            returnObject[selector[0]] = [];
            document.querySelectorAll(selector[1]).forEach( x =>
                returnObject[selector[0]].push(document.getElementById(x.id))
            );
        } else {
            returnObject[selector[0]] = {};
            document.querySelectorAll(selector[1]).forEach( x =>
                returnObject[selector[0]][x.id] = document.getElementById(x.id)
            );
        }
    });
    returnObject.swatchNamesArray = [];
    Object.keys(returnObject.pickers).forEach(x => returnObject.swatchNamesArray.push(x.split('-')[0]));
    return returnObject;
};


export const userObjects = setAll();