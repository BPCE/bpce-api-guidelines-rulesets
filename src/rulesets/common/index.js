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
    versionNotInPathFunction: require('./functions/checkPath').versionNotInPathFunction,
    pathStructureFunction: require('./functions/checkPath').pathStructureFunction
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
<<<<<<< HEAD
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
||||||| merged common ancestors
=======
      },
      tags: ['dataRepresentationRule']
    },
    
    'arrays-as-responses-not-allowed' : {
      summary: 'Arrays must not be used at the root of a response object',
      given: '$..responses..type',
      type: RuleType.VALIDATION,
      severity: DiagnosticSeverity.Error,
      then: {
        function: RuleFunction.PATTERN,
        functionOptions: {
          notMatch: /array/i
        },
      tags: ['dataRepresentationRule']
>>>>>>> 55e600aedfaa5d96617d8636aed4836b78fb121f
      }
  },
  'versioning-in-path': {
    summary: 'Versioning should not be found in any path',
    type: RuleType.VALIDATION,
    severity: DiagnosticSeverity.Error,
    given: '$..paths',
    then: {      
      function: 'versionNotInPathFunction'
    },
    tags: ['apiVersionRule'],
  },
  'api-in-path': {
    summary: 'The acronym <api> should not be used the resources paths',
    type: RuleType.VALIDATION,
    severity: DiagnosticSeverity.Error,
    given: '$..paths',
    then: { 
        field: '@key',    
        function: RuleFunction.PATTERN,
        functionOptions: {
          notMatch: /\/api/i
        },
    },
    tags: ['resourcePathRule'],
  },
  'path-structure': {
    summary: 'Resources paths must follow a pattern',
    type: RuleType.VALIDATION,
    severity: DiagnosticSeverity.Error,
    given: '$..paths',
    then: {      
      function: 'pathStructureFunction'
    },
    tags: ['resourcePathRule'],
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