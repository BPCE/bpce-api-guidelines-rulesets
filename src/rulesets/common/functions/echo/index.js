// Just an example of function that can also be used for debugging rules
// see ../index.js for an example of use
const echo = (targetValue, options, paths, otherValues) => {
    const targetValueString = JSON.stringify(targetValue);
    const optionsString = JSON.stringify(options);
    console.log(`echo targetValue: ${targetValueString} and options: ${optionsString}`);
    console.log('paths');
    console.log(paths);
    console.log(otherValues);
    var result = [];

    result.push({
        message: `echo targetValue: ${targetValueString} and options: ${optionsString}`
        //message: targetValue,
        //path: paths.given.push(['echo','targetValue'])
    })
    return result;
}

module.exports = {
    echo: echo
}