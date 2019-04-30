
const commonFunctions = {
  checkPropertiesCase: require('./functions/checkPropertiesCase').checkPropertiesCase
};
  
const commonRules = {
  lowerCamelCaseProperties: {
    summary: 'Checks that all properties names are in lowerCamelCase',
    given: '$..properties',
    then: {
      function: 'checkPropertiesCase',
      functionOptions: {
        format: "lowerCamelCase"
      }
    }
  }
};

module.exports = {
  commonFunctions: commonFunctions,
  commonRules: commonRules
};