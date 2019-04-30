
const swaggerFunctions = {};

const swaggerRules = {
    UpperCamelCaseDefinition: {
      summary: 'Checks that all definitions names are in UpperCamelCase',
      given: '$.definitions',
      then: {
        function: 'checkPropertiesCase', // common function
        functionOptions: {
          format: "UpperCamelCase"
        }
      }
    }
  };
  
  module.exports = {
    swaggerFunctions: swaggerFunctions,
    swaggerRules: swaggerRules
  };