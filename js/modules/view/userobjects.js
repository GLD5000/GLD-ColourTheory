export const userObjectsAll = {};

function setAll() {
    const selectorsArray = [
        ['pickers','input[type="color"]'],
        ['sliders','input[type="range"]','array'],//array
        ['wrappers','wrapper'],
        //['buttons','button'],
        ['copyButtons',['.copy-single','#clipboard-flexbox']],
        ['other',['#textmode', '#prefix', '#gradient', '#colourspace', '#dice-btn', '#randomise-btn', '#gldlogo']],
        ['clipboard',['#clipboard', '#clipboard-secondary']],     
        ['history',['#history-flexbox', '#save-button']],     
        ['navbar',['#hamburger-toggle', '#navbar-list']],     
        // ['labels','label'],
    ];  
    const returnObject = {};// {all: {}};
    selectorsArray.forEach( selector => {
        if (selector[2] === 'array') {
            returnObject[selector[0]] = [];
            [selector[1]].forEach(x => {             
                document.querySelectorAll(x).forEach( x => {
                    returnObject[selector[0]].push(document.getElementById(x.id));
                    userObjectsAll[x.id] = document.getElementById(x.id);
            }   );
            });
        } else {
            returnObject[selector[0]] = {};
            [selector[1]].forEach(x => {             
                document.querySelectorAll(selector[1]).forEach( x => {
                    returnObject[selector[0]][x.id] = document.getElementById(x.id);
                    userObjectsAll[x.id] = (returnObject[selector[0]][x.id]);
            }   );
            });
        }
    });
    returnObject.smallSwatchNamesArray = [];
    Object.keys(returnObject.pickers).forEach(x => {
        const name = x.split('-')[0];
        if (name !== 'primary' && name !== 'textcolour') {
            returnObject.smallSwatchNamesArray.push(name);
        }
    });
   // this._wrapper.dataset.content = this._name;

    return returnObject;
};
export const userObjects = setAll();
