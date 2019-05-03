const { RuleFunction, RuleType } = require('@stoplight/spectral');
const { DiagnosticSeverity } = require('@stoplight/types');

const OPTIONS = {
  PATTERN_SCHEMA_NAME: '^[A-Z][a-z0-9]+([A-Z][a-z0-9]*)*$',
  PATTERN_PROPERTY_NAME: '^(_links|[a-z]+([A-Z0-9][a-z0-9]*)*)$'
}

const functions = () => {
  return {
    //exampleFunction: require('./functions/example').exampleFunction
  }
};

// functions are needed to be able to merge sets
const rules = () => {
  return {
    'property-name-is-valid': {
      summary: 'Property name must be in lowerCamelCase or be _links',
      given: '$..properties',
      type: RuleType.STYLE,
      severity: DiagnosticSeverity.Error,
      then: {
        // to work on the key and not the value
        field: '@key',
        function: RuleFunction.PATTERN,
        functionOptions: {
          match: '^(_links|[a-z]+([A-Z0-9][a-z0-9]*)*)$'
        }
      }
    }
    /*,
    'test-with-example-function': {
      summary: 'simple function echoing match object and options',
      given: '$..properties',
      then: {
        field: '@key',
        function: 'exampleFunction',
        options: {
          exampleOption: "some value"
        }
      }
    }*/
  }
};

module.exports = {
  COMMON_OPTIONS: OPTIONS,
  commonFunctions: functions,
  commonRules: rules
};