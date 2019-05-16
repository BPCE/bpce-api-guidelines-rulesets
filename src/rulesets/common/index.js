const { RuleFunction, RuleType } = require('@stoplight/spectral');
const { DiagnosticSeverity } = require('@stoplight/types');

const OPTIONS = {
  PATTERN_SCHEMA_NAME: '^[A-Z][a-z0-9]+([A-Z][a-z0-9]*)*$',
  PATTERN_PROPERTY_NAME: '^(_links|[a-z]+([A-Z0-9][a-z0-9]*)*)$'
}

const SCHEMAS = {
  ERROR : require('./schemas/error.json')
}

const functions = () => {
  return {
    echo: require('./functions/echo').echo
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
      },
      tags: ['schema']
    },
    'http-status-is-authorized':{
      summary: 'HTTP status must be in authorized list',
      given: '$..responses',
      type: RuleType.STYLE,
      severity: DiagnosticSeverity.Error,
      then: {
        // to work on the key and not the value
        field: '@key',
        function: RuleFunction.PATTERN,
        functionOptions: {
          match: '^(200|201|202|204|207|400|401|403|404|406|500|503)$'
        }
      }
    },
    'test-ref': {
      summary: 'Test $ref resolution',
      given: '$..responses.201.schema',
      then: {
        function: 'echo'
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
  COMMON_SCHEMAS: SCHEMAS,
  commonFunctions: functions,
  commonRules: rules
};