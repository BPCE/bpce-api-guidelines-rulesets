const { loadRuleset, SEVERITY, ruleset, rule, isNotRulesetFullyTestedTestSuite, rulesetFullyTestedSuiteName } = require('./common/SpectralTestWrapper.js')

describe('path', function () {
  let spectralTestWrapper

  // Loads ruleset file based on the ruleset name set in the ruleset level test suite describe('{ruleset name}')
  before(async function () {
    spectralTestWrapper = await loadRuleset(ruleset(this))
  })

  // Disables all rules except the one indicated in rule level test suite describe('{rule name}'
  beforeEach(function () {
    if (isNotRulesetFullyTestedTestSuite(this)) {
      spectralTestWrapper.disableAllRulesExcept(rule(this))
    }
  })

  describe('path-no-trailing-slash', function () {
    it('should return no error if no path ends with trailing slash', async function () {
      const document = {
        paths: {
          '/some/valid/path': {}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
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
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('path-no-query-parameter', function () {
    it('should return no error if no path contains no query parameter', async function () {
      const document = {
        paths: {
          '/some/valid/path': {}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if a path contains a query parameter', async function () {
      const document = {
        paths: {
          '/some/invalid/path?with=query': {}
        }
      }
      const errorPath = ['paths', '/some/invalid/path?with=query']
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('path-lower-camel-case', function () {
    it('should return no error if path is lowerCamelCased', async function () {
      const document = {
        paths: {
          '/some/validPath': {},
          '/someValid/path': {},
          '/someValidPath': {}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if a path is not lowerCamelCased', async function () {
      const document = {
        paths: {
          '/some-invalid/path': {},
          '/some/invalid_path': {},
          '/someINVALID/path': {}

        }
      }
      const errorPath = [
        ['paths', '/some-invalid/path'],
        ['paths', '/some/invalid_path'],
        ['paths', '/someINVALID/path']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('path-valid-structure', function () {
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
      await spectralTestWrapper.runAndCheckNoError(document)
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
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  // Checks that all rules have been tested
  describe(rulesetFullyTestedSuiteName(this), function () {
    it('should return no untested rule', function () {
      spectralTestWrapper.checkAllRulesHaveBeenTest()
    })
  })
})
