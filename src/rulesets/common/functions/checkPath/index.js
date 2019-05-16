const pathMaxDepth = 4;
const version = /v[1-9]/i;
const englishPlural = /^[\w]+(s|i?es|ves)$/;
const pathParameter = /^{.*}/;
const pathFragmentNamesPattern = /^[a-z]+([A-Z0-9][a-z0-9]*)*$/;

const versionNotInPathFunction = (targetValue) => {
    var result = [];

    Object.keys(targetValue).forEach(function (key) {
        const pathFragments = key.split("/").filter(function (element) { return element.length != 0 });// because the path starts with the separator (left part will be an empty string)

        if (version.test(pathFragments[0])) {
            result.push({
                message: `Versionning should be done at API level using basePath property, found version in a resource path.`
            })
        }
    });
    return result;
}

const pathStructureFunction = (targetValue) => {
    var result = [];
    
    Object.keys(targetValue).forEach(function (key) {
        const pathFragments = key.split("/").filter(function (element) { return element.length != 0 });// because the path starts with the separator (left part will be an empty string)

        for (const [index, item] of pathFragments.entries()) {
            console.log("index of  " + item + " --> " + index);
            if (index % 2 != 0) {
                //every second fragment should be a path param
                if (!pathParameter.test(item)) {
                    result.push({
                        message: `Path should follow the pattern /resources1/{id1}, the path fragment <${item}> should be a path parameter. Full path: ${key}`
                    })
                    //break;
                }
            } else {
                if (!englishPlural.test(item)) {
                    result.push({
                        message: `Collection names in the path must be plural names, found <${item}> in ${key}`
                    })
                } 
            }
            //checking the case
            if (!pathFragmentNamesPattern.test(item.replace(/({|})/g, ''))){
                result.push({
                    message: `Path fragments, both parameters and collections names, must be in lowerCamelCase, found <${item.replace(/({|})/g, '')}> in ${key}`
                })
            }
        };        
        if (pathFragments.length > pathMaxDepth) {
            result.push({
                message: `Path should not be that long (${pathMaxDepth} levels max), consider refacturing it. Full path: ${key}`
            })
        }
    });
    return result;
}
module.exports = {
    versionNotInPathFunction: versionNotInPathFunction,
    pathStructureFunction: pathStructureFunction
}