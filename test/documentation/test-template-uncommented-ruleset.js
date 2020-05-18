const linterTestSuite = require('./common/linter-test-suite.js')

describe('{ruleset name}', function () {
  linterTestSuite.initialize()

  describe('{rule name}', function () {

    linterTestSuite.commonTests(linterTestSuite.FORMATS.xxx)

    it('should ignore {something}', function () {
      const document = {}
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check {something}', function () {
      const document = {}
      const expectedPaths = [
        []
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if {use case}', async function () {
      const document = {}
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if {use case}', async function () {
      const document = {}
      const errorPaths = [
        []
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})
