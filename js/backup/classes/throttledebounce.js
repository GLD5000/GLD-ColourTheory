export const debounceB = (callbackFunction,delayTime = 1000) =>{
    let timer; 
    let counter = 0;
    return (...args) => { //create inner function
        if (counter === 0) callbackFunction.apply(this, args);//get first click
        counter = 1;
        clearTimeout(timer); // rest timer each time function is called
        timer  = setTimeout(() => { callbackFunction.apply(this, args); counter = 0;
        }, delayTime);//which this is applied
    };
}
export const throttle = (callbackFunction, delayTime = 250) => {
    let execute = true;
    let waitingArgs;
    const waitHandler = () => {
        if (waitingArgs == null) {
            execute = true;
        } else {
            callbackFunction(...waitingArgs); 
            waitingArgs = null;
            setTimeout(waitHandler, delayTime);
        }
    } 
    return (...args) => {
        if (execute === false) {
            waitingArgs = args; 
            return;
        } // do not run function

            callbackFunction(args); // run function

            execute = false; // already run

            setTimeout(waitHandler, delayTime); // reset
    }
}
const debounce = (callbackFunction,delayTime = 1000) =>{
    let timer; 
    return (...args) => { //create inner function
        clearTimeout(timer); // rest timer each time function is called
        timer  = setTimeout(() => { callbackFunction.apply(this, args); }, delayTime);//which this is applied
    };
}
const throttleIncomplete = (callbackFunction, delayTime = 200) => {
    let execute = true;
    return (...args) => {
        if (execute === true) {
            execute = false;
            callbackFunction(args);
            setTimeout(() => {execute = true;}, delayTime)
        } 
    }
}

