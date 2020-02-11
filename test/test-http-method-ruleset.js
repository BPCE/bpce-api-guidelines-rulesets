const { loadRuleset, SEVERITY, ruleset, rule, isNotRulesetFullyTestedTestSuite, rulesetFullyTestedSuiteName } = require('./common/SpectralTestWrapper.js')

describe('http-method', function () {
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

  describe('http-method-allowed', function () {
    it('should return no error if get, post, patch, put or delete is used', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {},
            post: {}
          },
          '/another/path': {
            patch: {},
            put: {},
            delete: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if there are path level parameters', async function () {
      const document = {
        paths: {
          '/some/path': {
            parameters: [],
            get: {},
            post: {}
          },
          '/another/path': {
            patch: {},
            put: {},
            delete: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if there is an x-tension', async function () {
      const document = {
        paths: {
          '/some/path': {
            'x-tension': 'dummy value',
            get: {},
            post: {}
          },
          '/another/path': {
            patch: {},
            put: {},
            delete: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if unauthorized HTTP method is used', async function () {
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
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('http-method-post-only-on-search', function () {
    it('should return no error if path does not end with /search and does not use post', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if path ends with /search and uses only post', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if path ends with /search, uses only post and has path level paramaters', async function () {
      const document = {
        paths: {
          '/some/path': {
            paramaters: [],
            post: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if path ends with /search, uses only post and has path x-tension', async function () {
      const document = {
        paths: {
          '/some/path': {
            'x-tension': {},
            post: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if path ends with /search and uses post and other http method', async function () {
      const document = {
        paths: {
          '/some/path/search': {
            get: {},
            post: {},
            patch: {}
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path/search', 'get'],
        ['paths', '/some/path/search', 'patch']
      ]
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if path ends with /search and uses http method other than post', async function () {
      const document = {
        paths: {
          '/some/path/search': {
            get: {},
            patch: {}
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path/search', 'get'],
        ['paths', '/some/path/search', 'patch']
      ]
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('http-method-no-post-on-unit-resource', function () {
    it('should ignore collections', async function () {
      const document = {
        paths: {
          '/resources': {
            post: {}
          },
          '/resources/{id}/resources': {
            post: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should ignore post /search', async function () {
      const document = {
        paths: {
          '/resources/search': {
            post: {}
          },
          '/resources/{id}/resources/search': {
            post: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if post is not used on unitary resource', async function () {
      const pathObject = {
        parameters: [],
        'x-tension': 'dummy value',
        get: {},
        put: {},
        patch: {},
        delete: {},
      }
      const document = {
        paths: {
          '/name/v1/resources/{id}': pathObject,
          '/v1/resources/{id}': pathObject,
          '/resources/{id}': pathObject,
          '/resources/{id}/resources/me': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if post is used on unitary resource', async function () {
      const pathObject = {
        parameters: [],
        'x-tension': 'dummy value',
        post: {},
        get: {},
        put: {},
        patch: {},
        delete: {},
      }
      const document = {
        paths: {
          '/name/v1/resources/{id}': pathObject,
          '/v1/resources/{id}': pathObject,
          '/resources/{id}': pathObject,
          '/resources/{id}/resources/me': pathObject
        }
      }
      const errorPaths = [
        ['paths', '/name/v1/resources/{id}', 'post'],
        ['paths', '/v1/resources/{id}', 'post'],
        ['paths', '/resources/{id}', 'post'],
        ['paths', '/resources/{id}/resources/me', 'post']
      ]
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
