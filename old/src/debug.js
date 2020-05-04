const { Spectral } = require('@stoplight/spectral')
const { RuleFunction, RuleType } = require('@stoplight/spectral')
const { DiagnosticSeverity } = require('@stoplight/types')
const { parseWithPointers } = require('@stoplight/yaml')
const { commonFunctions } = require('./rulesets/common')

const openapi = parseWithPointers(
`{
  "openapi": "3.0.0",
  "info": {
    "title": "Dummy API for Spectral",
    "version": "1.0.0"
  },
  "paths": {
    "/resources": {
      "get": {
        "summary": "Retrieves some resources",
        "responses": {
          "200": {
            "description": "The resources"
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Oops, forbidden"
          },
          "500": {
            "description": "Something went wrong"
          }
        }
      }
    }
  }
}`
)

// create a new instance of spectral with all of the baked in rulesets
const spectral = new Spectral()

spectral.addFunctions(commonFunctions())

spectral.addRules({
  'get-summary-starts-with-gets': {
    summary: 'A get operation summary must start with Gets',
    given: '$..get.summary',
    type: RuleType.STYLE,
    severity: DiagnosticSeverity.Warning,
    then: {
      function: RuleFunction.PATTERN,
      functionOptions: {
        match: '^Gets.*$'
      }
    }
  },
  'error-description-start-with-oops': {
    summary: 'An error (4xx, 5xx) description must start with Oops',
    type: RuleType.STYLE,
    severity: DiagnosticSeverity.Warning,
    given: '$..responses',
    when: {
      field: '@key',
      pattern: '^4..'
    },
    then: {
      // function: RuleFunction.PATTERN,
      function: 'echo',
      functionOptions: {
        match: '^Oops.*$'
      }
    },
    tags: ['debug']
  }
  /*,
    'error-description-start-with-oops-dumb-way': {
      summary: 'An error (4xx, 5xx) description must start with Oops',
      given: '$.paths.*.*.responses[401,500]',
      when : {
        field: '@key',
        pattern: '(4..|5..)'
      },
      type: RuleType.STYLE,
      severity: DiagnosticSeverity.Warning,
      then: {
        function: RuleFunction.PATTERN,
        functionOptions: {
          match: '^Oops.*$'
        }
      }
    }
    */
})

// run!
spectral.run(openapi).then(results => {
  console.log(JSON.stringify(results, null, 4))
})
