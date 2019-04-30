const commonFunctions = require('./common').commonFunctions;
const commonRules = require('./common').commonRules;
const swaggerFunctions = require('./swagger').swaggerFunctions;
const swaggerRules = require('./swagger').swaggerRules;
const openapiFunctions = require('./openapi').openapiFunctions;
const openapiRules = require('./openapi').openapiRules;
const merge = require('lodash').merge;

module.exports = {
    customCommonRules: merge(commonRules),
    customCommonFunctions: merge(commonFunctions),
    customSwaggerRules: merge(commonRules, swaggerRules),
    customSwaggerFunctions: merge(commonFunctions, swaggerFunctions),
    customOpenapiRules: merge(commonRules, openapiRules),
    customOpenapiFunctions: merge(commonFunctions, openapiFunctions)
};