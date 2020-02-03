const { loadRuleset, SEVERITY, ruleset, rule, isNotRulesetFullyTestedTestSuite, rulesetFullyTestedSuiteName } = require('./common/SpectralTestWrapper.js')

describe('basepath', function () {
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

  describe('basepath-defined', function () {
    it('should not return an error if basepath is defined', async function () {
      const document = {
        basePath: '/someBasePath'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if basepath is not defined', async function () {
      const document = {}
      const errorPath = []
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('basepath-valid-structure', function () {
    it('should not return an error if basepath has a valid structure', async function () {
      const document = {
        basePath: '/someName/v2'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if basepath has not a valid structure', async function () {
      const document = {
        basePath: '/someBasePath'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('basepath-lowerCamelCased', function () {
    it('should not return an error if basepath is lowerCamelCased', async function () {
      const document = {
        basePath: '/lowerCamelCased'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if basepath is NotLowerCamelCased', async function () {
      const document = {
        basePath: '/NotLowerCamelCased'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if basepath is notLOWERCamelCased', async function () {
      const document = {
        basePath: '/notLOWERCamelCased'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('basepath-no-trailing-slash', async function () {
    it('should return no error if basepath has no trailing slash', async function () {
      const document = {
        basePath: '/no-trailing-slash'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if basepath has a trailing slash', async function () {
      const document = {
        basePath: '/forbidden-trailing-slash/'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if basepath is just slash', async function () {
      const document = {
        basePath: '/'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('basepath-no-api', function () {
    it('should return no error if basepath does not contain api', async function () {
      const document = {
        basePath: '/some/path'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if basepath contains api', async function () {
      const document = {
        basePath: '/api/path'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('basepath-not-in-path', function () {
    it('should return no error if path does not contain basepath', async function () {
      const document = {
        paths: {
          '/some/path': {}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if path contains basepath', async function () {
      const document = {
        paths: {
          '/someName/v1/some/path': {}
        }
      }
      const errorPath = ['paths', '/someName/v1/some/path']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('basepath-version-not-in-path', function () {
    it('should return no error if path does not contain version', async function () {
      const document = {
        paths: {
          '/some/path': {}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if path contains version', async function () {
      const document = {
        paths: {
          '/v1/some/path': {}
        }
      }
      const errorPath = ['paths', '/v1/some/path']
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
