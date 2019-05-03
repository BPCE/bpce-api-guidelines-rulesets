const { RuleFunction, RuleType } = require('@stoplight/spectral');
const { DiagnosticSeverity } = require('@stoplight/types');
const { commonRules, commonFunctions, COMMON_OPTIONS } = require('../common');
const merge = require('lodash').merge;


const functions = () => {
  return {
    //exampleFunction: require('./functions/example').exampleFunction
  }
};

const rules = () => {
  return { 
    'definition-name-is-valid': {
      summary: 'A definition name must be in UpperCamelCase',
      given: '$.definitions',
      type: RuleType.STYLE,
      severity: DiagnosticSeverity.Error,
      then: {
        // to work on the key and not the value
        field: '@key',
        function: RuleFunction.PATTERN,
        functionOptions: {
          match: COMMON_OPTIONS.PATTERN_SCHEMA_NAME
        }
      }
    }
  }
};

const allRules = () => {
  return merge(commonRules(), rules());;
}

const allFunctions = () => {
  return merge(commonFunctions(), functions());
}

module.exports = {
  swaggerFunctions: allFunctions,
  swaggerRules: allRules
};