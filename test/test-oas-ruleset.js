const linterTestSuite = require('./common/linter-test-suite.js')

describe('oas', function () {
  linterTestSuite.initialize()

  describe('oas3-schema', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, linterTestSuite.STANDARD_SPECTRAL_RULE)

    it('should return no error if document is valid oas3', async function () {
      const document = {
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title: 'title'
        },
        paths: {}
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if document is invalid oas3', async function () {
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
        ['info']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('oas2-schema', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2, linterTestSuite.STANDARD_SPECTRAL_RULE)

    it('should return no error if document is valid oas2', async function () {
      const document = {
        swagger: '2.0',
        info: {
          version: '1.0.0',
          title: 'title',
          description: 'description'
        },
        paths: {}
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if document is invalid oas2', async function () {
      const document = {
        swagger: '2.0',
        info: {
          version: '1.0.0',
          title: 'title',
          descriptionn: 'description with typo'
        },
        paths: {}
      }
      const errorPaths = [
        ['info']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})
