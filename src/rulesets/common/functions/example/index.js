// Just an example of function
// see ../index.js for an example of use
const exampleFunction = (targetValue, options) => {
    const targetValueString = JSON.stringify(targetValue);
    const optionsString = JSON.stringify(options);

    var result = [];
    result.push({
        message: `echo targetValue: ${targetValueString} and options: ${optionsString}`
    })
    return result;
}

module.exports = {
    exampleFunction: exampleFunction
}