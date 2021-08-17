const linterTestSuite = require('./common/linter-test-suite.js')

describe('main', function () {
  linterTestSuite.initialize()

  // Just checking that includes work well (no real problem except for oas ruleset which requires to disable oas spectral ruleset)
  describe('basepath-defined-oas2', function () {
    it('should run a rule of basepath ruleset', async function () {
      const document = {
        swagger: '2.0'
      }
      const errorPaths = []
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-method-allowed', function () {
    it('should run a rule of http method ruleset', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {},
            post: {},
            unauthorized: {}
          },
          '/another/path': {
            patch: {},
            put: {},
            delete: {},
            options: {}
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'unauthorized'],
        ['paths', '/another/path', 'options']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-mandatory-2xx', function () {
    it('should run a rule of http status ruleset', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                200: {}
              }
            },
            post: {
              responses: {
              }
            }
          },
          '/another/path': {
            put: {
              responses: {
                200: {}
              }
            },
            patch: {
              responses: {}
            },
            delete: {
              responses: {
                204: {}
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'post', 'responses'],
        ['paths', '/another/path', 'patch', 'responses']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('info-defined', function () {
    it('should run a rule of info ruleset', async function () {
      const document = {}
      const errorPaths = []
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('response-schema-is-defined-oas2', function () {
    it('should run a rule of model response ruleset', async function () {
      const response = {
        description: 'some invalid response'
      }
      const document = {
        swagger: '2.0',
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: response,
                401: response,
                500: response
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '200'],
        ['paths', '/some/path', 'anymethod', 'responses', '401'],
        ['paths', '/some/path', 'anymethod', 'responses', '500']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('schema-name-uppercamelcase', function () {
    it('should run a rule of model ruleset', async function () {
      const document = {
        definitions: {
          someSchema: {},
          SOmeSchema: {},
          some_schema: {},
          SOMESCHEMA: {}
        }
      }
      const errorPaths = [
        ['definitions', 'someSchema'],
        ['definitions', 'SOmeSchema'],
        ['definitions', 'some_schema'],
        ['definitions', 'SOMESCHEMA']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('oas3-schema', function () {
    it('should run a rule of oas ruleset', async function () {
      const document = {
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title: 'title',
          descriptionn: 'description with typo'
        },
        paths: {}
      }
      const errorPaths = [
        ['info', 'descriptionn']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('parameter-query-forbidden-on-post-put-patch-delete', function () {
    it('run a rule of parameter ruleset', async function () {
      const operation = {
        parameters: [
          { in: 'query' }
        ]
      }
      const document = {
        paths: {
          somepath: {
            post: operation,
            put: operation,
            patch: operation,
            delete: operation
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'post', 'parameters', '0', 'in'],
        ['paths', 'somepath', 'put', 'parameters', '0', 'in'],
        ['paths', 'somepath', 'patch', 'parameters', '0', 'in'],
        ['paths', 'somepath', 'delete', 'parameters', '0', 'in']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('path-no-trailing-slash', function () {
    it('should run a rule of path ruleset', async function () {
      const document = {
        paths: {
          '/some/invalid/path/': {},
          '/': {}
        }
      }
      const errorPaths = [
        ['paths', '/some/invalid/path/'],
        ['paths', '/']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('security-rules-defined-oas2', function () {
    it('should run a rule of security ruleset', async function () {
      const document = {}
      const errorPaths = [
        []
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  // TODO need to check that all rulesets are actually included in main
})
