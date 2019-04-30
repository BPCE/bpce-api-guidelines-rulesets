const openapiFunctions = {};

const openapiRules = {
    UpperCamelCaseDefinition: {
      summary: 'Checks that all schema names are in UpperCamelCase',
      given: '$.components.schemas',
      then: {
        function: 'checkPropertiesCase', // common function
        functionOptions: {
          format: "UpperCamelCase"
        }
      }
    }
  };
  
  module.exports = {
    openapiFunctions: openapiFunctions,
    openapiRules: openapiRules
  };