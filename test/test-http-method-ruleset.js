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
    it('should not return an error if get, post, patch, put or delete is used', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {},
            post: {},
            patch: {},
            put: {},
            delete: {}
          },
          '/another/path': {
            get: {},
            post: {},
            patch: {},
            put: {},
            delete: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should not return an error if there are operation level parameters', async function () {
      const document = {
        paths: {
          '/some/path': {
            parameters: [],
            get: {},
            post: {},
            patch: {},
            put: {},
            delete: {}
          },
          '/another/path': {
            get: {},
            post: {},
            patch: {},
            put: {},
            delete: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should not return an error if there is an x-tension', async function () {
      const document = {
        paths: {
          '/some/path': {
            'x-tension': 'dummy value',
            get: {},
            post: {},
            patch: {},
            put: {},
            delete: {}
          },
          '/another/path': {
            get: {},
            post: {},
            patch: {},
            put: {},
            delete: {}
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if options HTTP method is used', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {},
            post: {},
            patch: {},
            put: {},
            delete: {}
          },
          '/another/path': {
            get: {},
            post: {},
            patch: {},
            put: {},
            delete: {},
            options: {}
          }
        }
      }
      const errorPath = ['paths', '/another/path', 'options']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  // Checks that all rules have been tested
  describe(rulesetFullyTestedSuiteName(this), function () {
    it('all rules should have been tested', function () {
      spectralTestWrapper.checkAllRulesHaveBeenTest()
    })
  })
})
