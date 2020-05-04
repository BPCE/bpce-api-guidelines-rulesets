const { RuleFunction, RuleType } = require('@stoplight/spectral')
const { DiagnosticSeverity } = require('@stoplight/types')
const { commonRules, commonFunctions, COMMON_OPTIONS } = require('../common')
const merge = require('lodash').merge

const functions = () => {
  return {
    // exampleFunction: require('./functions/example').exampleFunction
  }
}

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
    },
    'suspicious-schema-no-required-list': {
      summary: 'No required properties',
      given: '$..definitions.*',
      type: RuleType.STYLE,
      severity: DiagnosticSeverity.Warning,
      then:
        {
          field: 'required',
          function: RuleFunction.TRUTHY
        }
    },
    'suspicious-schema-empty-required-list': {
      summary: 'No required properties',
      given: '$..definitions.*.required',
      type: RuleType.STYLE,
      severity: DiagnosticSeverity.Warning,
      then:
        {
          function: RuleFunction.LENGTH,
          functionOptions: {
            min: 2 // bug dans la fonction length, il faut indiquer la longueur souhaitée + 1 (considère que l'élément est un object au lieu d'un array)
          }
        }
    },
    'error-schema-is-valid': {
      summary: 'An error must conforms to standard Errors schema',
      given: '$..responses.400.schema',
      type: RuleType.VALIDATION,
      severity: DiagnosticSeverity.Error,
      then: {
        function: RuleFunction.SCHEMA,
        functionOptions: require('../common/schemas/error.json')
      }
    }
  }
}

const allRules = () => {
  return merge(commonRules(), rules())
}

const allFunctions = () => {
  return merge(commonFunctions(), functions())
}

module.exports = {
  swaggerFunctions: allFunctions,
  swaggerRules: allRules
}
