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

  describe('basepath-defined-oas2', function () {
    it('should ignore missing basepath in oas3 document', async function () {
      const document = {
        openapi: '3.0'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if basepath is defined in oas2 document', async function () {
      const document = {
        swagger: '2.0',
        basePath: '/someBasePath'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if basepath is not defined in oas2 document', async function () {
      const document = {
        swagger: '2.0'
      }
      const errorPath = []
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('basepath-defined-oas3', function () {
    it('should ignore missing servers[0].url in oas2 document', async function () {
      const document = {
        swagger: '2.0'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if servers[0].url is defined in oas3 document', async function () {
      const document = {
        openapi: '3.0',
        servers: [{ url: '/someBasePath' }]
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if servers[0].url is not defined in oas3 document', async function () {
      const document = {
        openapi: '3.0'
      }
      const errorPath = []
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('basepath-valid-structure', function () {
    it('should return no error if oas2 basepath is /name/v2', async function () {
      const document = {
        basePath: '/name/v2'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if oas2 basepath is /some-name/v22', async function () {
      const document = {
        basePath: '/some-name/v22'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if oas2 basepath is /some_name/v22', async function () {
      const document = {
        basePath: '/some_name/v22'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if oas2 basepath is /someName/v1', async function () {
      const document = {
        basePath: '/someName/v1'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if oas2 basepath is /nameWithoutVersion', async function () {
      const document = {
        basePath: '/nameWithoutVersion'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if oas2 basepath is /v1', async function () {
      const document = {
        basePath: '/v1'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return no error if oas3 server url has a valid structure (no need to check all regex cases again)', async function () {
      const document = {
        servers: [
          { url: '/someName/v1' }
        ]
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if oas3 server url has an invalid structure (no need to check all regex cases again)', async function () {
      const document = {
        servers: [
          { url: '/nameWithoutVersion' }
        ]
      }
      const errorPath = ['servers', '0', 'url']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('basepath-lowerCamelCased', function () {
    it('should not return no error if oas2 basepath is /lowerCamelCased', async function () {
      const document = {
        basePath: '/lowerCamelCased'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should not return no error if oas2 basepath is /v1', async function () {
      const document = {
        basePath: '/v1'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should not return no error if oas2 basepath is /lowerCamelCased/v1', async function () {
      const document = {
        basePath: '/lowerCamelCased/v1'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if oas2 basepath is /NotLowerCamelCased', async function () {
      const document = {
        basePath: '/NotLowerCamelCased'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if oas2 basepath is /V1', async function () {
      const document = {
        basePath: '/V1'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if oas2 basepath is /NotLowerCamelCased/V1', async function () {
      const document = {
        basePath: '/NotLowerCamelCased/V1'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return no error if oas3 server url is lowerCamelCased (no need to check all regex cases again)', async function () {
      const document = {
        servers: [
          { url: '/lowerCamelCased/v1' }
        ]
      }

      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if oas3 server url is not lowerCamelCased (no need to check all regex cases again)', async function () {
      const document = {
        servers: [
          { url: '/NotLowerCamelCased/V1' }
        ]
      }
      const errorPath = ['servers', '0', 'url']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('basepath-no-trailing-slash', async function () {
    it('should return no error if oas2 basepath has no trailing slash', async function () {
      const document = {
        basePath: '/no-trailing-slash'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if oas2 basepath has a trailing slash', async function () {
      const document = {
        basePath: '/forbidden-trailing-slash/'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if oas2 basepath is just slash', async function () {
      const document = {
        basePath: '/'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return no error if oas3 server url has no trailing slash', async function () {
      const document = {
        servers: [{ url: '/no-trailing-slash' }]
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if oas3 server url has a trailing slash (no need to check all regex cases again)', async function () {
      const document = {
        servers: [{ url: '/forbidden-trailing-slash/' }]
      }
      const errorPath = ['servers', '0', 'url']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('basepath-no-api', function () {
    it('should return no error if oas2 basepath does not contain api', async function () {
      const document = {
        basePath: '/some/path'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if oas2 basepath contains api', async function () {
      const document = {
        basePath: '/api/path'
      }
      const errorPath = ['basePath']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return no error if oas3 server url does not contain api', async function () {
      const document = {
        servers: [{ url: '/some/path' }]
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if oas3 server url contains api', async function () {
      const document = {
        servers: [{ url: '/api/path' }]
      }
      const errorPath = ['servers', '0', 'url']
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
    it('should return no untested rule', function () {
      spectralTestWrapper.checkAllRulesHaveBeenTest()
    })
  })
})
