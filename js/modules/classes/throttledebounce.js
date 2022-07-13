
export const debounce = (callbackFunction,delayTime = 1000) =>{
    let timer; // create timer here for closure so there is only one
    return (...args) => { //create inner function
        clearTimeout(timer); // rest timer each time function is called
        timer  = setTimeout(() => { callbackFunction.apply(this, args); }, delayTime);//which this is applied
    };
}

export const throttleIncomplete = (callbackFunction, delayTime = 1000) => {
    let execute = true;
    return (...args) => {
        if (execute === true) {
            execute = false;
            callbackFunction(args);
            setTimeout(() => {execute = true;}, delayTime)
        } 
    }
}
export const throttle = (callbackFunction, delayTime = 1000) => {
    let execute = true;
    let waitingArgs;
    const waitHandler = () => {
        if (waitingArgs == null) {
            execute = true;
        } else {
            callbackFunction(...waitingArgs); 

            waitingArgs = null;
        }
    } 
    return (...args) => {
        if (execute === false) {
            waitingArgs = args; 
            return;
        } // do not run function


            execute = false; // already run

            setTimeout(waitHandler, delayTime); // reset
            return callbackFunction(args); // run function

    }
}


export const throttleB = (callbackFunction, delayTime = 1000) => {
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
