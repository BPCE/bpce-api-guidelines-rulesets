const linterTestSuite = require('./common/linter-test-suite.js')

// TODO Set ruleset name. Ruleset files are in the rulesets folder. Example for a info-ruleset.yaml file it's "info".
describe('{ruleset name}', function () {
  // Load ruleset and set everything needed to run test
  linterTestSuite.initialize()

  // TODO Add test suite for each rule in rule set
  // TODO Set the rule name as defined in the Spectral ruleset
  describe('{rule name}', function () {
    // Only {rule name} is active, all other rules have been disabled by beforeEach

    // 1 - Common tests
    linterTestSuite.commonTests(linterTestSuite.FORMATS.xxx) // TODO Set on which format rule should run oas2/oas3/all

    // TODO 2 - Verify ALL given JSON paths
    // There must be at least a "should check ..." and there should be at least on "should ignore" for each rule's given JSON path 
  
    // TODO 2.1 - Depending on JSON path complexity, you should check that some elements are actually ignored by the rule's given(s)
    it('should ignore {something}', function () {
      const document = {
        some: {
          path: {}
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex) // if rule's given is not array, givenIndex is not needed
    })
  
    // TODO 2.2 - Depending on JSON path complexity, you should check 1 to multiple use case
    it('should check {something}', function () {
      const document = {
        some: {
          path: {}
        }
      }
      const expectedPaths = [
        ['some', 'path']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    // TODO 3 - Check rule's "then"

    // TODO 3.1 Check OK use cases (as many "it" as needed) 
    it('should return no error if {use case}', async function () {
      // Valid document (partial one with minimal data to test rule)
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                204: {},
                301: {},
                302: {},
                303: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    // TODO 3.2 - Check KO use cases (as many "it" as needed)
    it('should return an error if {use case}', async function () {
      // Document with error (partial one with minimal data to test rule)
      const response = {
        schema: {}
      }
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                204: response,
                301: response,
                302: response,
                303: response
              }
            }
          }
        }
      }
      // Expected error paths
      const errorPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '204', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '301', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '302', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '303', 'schema']
      ]
      // Expected error severity
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  // Check that tests are exhaustive
  linterTestSuite.finalize()
})
