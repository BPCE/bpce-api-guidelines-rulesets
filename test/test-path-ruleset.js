const linterTestSuite = require('./common/linter-test-suite.js')

describe('path', function () {
  linterTestSuite.initialize()

  function checkPathsFound () {
    it('should check paths', function () {
      const document = {
        paths: {}
      }
      const expectedPaths = [
        ['paths']
      ]
      const givenIndex = undefined
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })
  }

  describe('path-no-trailing-slash', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPathsFound()

    it('should return no error if no path ends with trailing slash', async function () {
      const document = {
        paths: {
          '/some/valid/path': {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a path ends with a trailing slash', async function () {
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

  describe('path-no-query-parameter', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPathsFound()

    it('should return no error if no path contains no query parameter', async function () {
      const document = {
        paths: {
          '/some/valid/path': {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a path contains a query parameter', async function () {
      const document = {
        paths: {
          '/some/invalid/path?with=query': {}
        }
      }
      const errorPaths = ['paths', '/some/invalid/path?with=query']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('path-lower-camel-case', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPathsFound()

    it('should return no error if path is lowerCamelCased', async function () {
      const document = {
        paths: {
          '/some/validPath': {},
          '/someValid/path': {},
          '/someValidPath': {},
          '/some/{someId}/path': {},
          '/v1/some/{someId}/path': {},
          '/v1/someValidPath': {},
          '/v1/deliveryPoints/{deliveryPointId}/departments': {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a path is not lowerCamelCased', async function () {
      const document = {
        paths: {
          '/some-invalid/path': {},
          '/some/invalid_path': {},
          '/someINVALID/path': {}

        }
      }
      const errorPaths = [
        ['paths', '/some-invalid/path'],
        ['paths', '/some/invalid_path'],
        ['paths', '/someINVALID/path']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('path-valid-structure', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPathsFound()

    it('should return no error if path structure is valid', async function () {
      const document = {
        paths: {
          '/resources': {},
          '/pies/{id}': {},
          '/resources/{id}/pies': {},
          '/resources/{id}/books/{id}': {},
          '/users/me': {},
          '/users/me/accounts': {},
          '/users/me/accounts/{id}': {},
          '/transactions/search': {},
          '/transactions/latest': {},
          '/terms/current': {},
          '/users/{id}/parents/me': {},
          '/accounts/{id}/balances/current': {},
          '/accounts/{id}/transactions/latest': {},
          '/accounts/{id}/transactions/search': {},
          '/v1/customers': {}, // avoiding to trigger error, having basepath in path is checked in basepath ruleset
          '/name/v1/customers': {} // avoiding to trigger error, having basepath in path is checked in basepath ruleset
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if path structure is invalid', async function () {
      const document = {
        paths: {
          '/collection/something': {},
          '/collection/something/{id}': {},
          '/{id}': {}
        }
      }
      const errorPaths = [
        ['paths', '/collection/something'],
        ['paths', '/collection/something/{id}'],
        ['paths', '/{id}']]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})
