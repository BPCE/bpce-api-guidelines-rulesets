const { loadRuleset, SEVERITY, ruleset, rule, isNotRulesetFullyTestedTestSuite, rulesetFullyTestedSuiteName } = require('./common/SpectralTestWrapper.js')

describe('info', function () {
  let spectralTestWrapper

  before(async function () {
    spectralTestWrapper = await loadRuleset(ruleset(this))
  })

  beforeEach(function () {
    if (isNotRulesetFullyTestedTestSuite(this)) {
      spectralTestWrapper.disableAllRulesExcept(rule(this))
    }
  })

  describe('info-defined', function () {
    it('should return no error if info is defined', async function () {
      const document = {
        info: {}
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if info is not defined', async function () {
      const document = {}
      const errorPath = []
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('info-name-defined', function () {
    it('should return no error if API name is defined in info', async function () {
      const document = {
        info: {
          title: 'some API name'
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if no API name is not defined in info', async function () {
      const document = {
        info: {}
      }
      const errorPath = ['info']
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('info-name-not-contain-api', function () {
    it('should return no error if the API name does not contain api', async function () {
      const document = {
        info: {
          title: 'some name'
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if the API name contains API', async function () {
      const document = {
        info: {
          title: 'Some API name'
        }
      }
      const errorPath = ['info', 'title']
      const errorSeverity = SEVERITY.error

      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if the API name contains Api', async function () {
      const document = {
        info: {
          title: 'Some Api name'
        }
      }
      const errorPath = ['info', 'title']
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if the API name is API', async function () {
      const document = {
        info: {
          title: 'API'
        }
      }
      const errorPath = ['info', 'title']
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('info-description-provided', function () {
    it('should return no error if API description is provided', async function () {
      const document = {
        info: {
          description: 'some description'
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if the API description is not provided', async function () {
      const document = {
        info: {}
      }
      const errorPath = ['info']
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if the API description is empty', async function () {
      const document = {
        info: {
          description: ''
        }
      }
      const errorPath = ['info', 'description']
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe('info-description-valid-content', function () {
    it('should return an error if the API description starts with "this API"', async function () {
      const document = {
        info: {
          description: 'this API allows to do something'
        }
      }
      const errorPath = ['info', 'description']
      const errorSeverity = SEVERITY.info
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if the API description starts with "cette API"', async function () {
      const document = {
        info: {
          description: 'Cette API permet de faire des choses'
        }
      }
      const errorPath = ['info', 'description']
      const errorSeverity = SEVERITY.info
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if the API description starts contains "web service"', async function () {
      const document = {
        info: {
          description: 'Some description talking about web services and a few other things'
        }
      }
      const errorPath = ['info', 'description']
      const errorSeverity = SEVERITY.info
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })

    it('should return an error if the API description starts contains "API"', async function () {
      const document = {
        info: {
          description: 'Some description talking about API and a few other things'
        }
      }
      const errorPath = ['info', 'description']
      const errorSeverity = SEVERITY.info
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPath, errorSeverity)
    })
  })

  describe(rulesetFullyTestedSuiteName(this), function () {
    it('should return no untested rule', function () {
      spectralTestWrapper.checkAllRulesHaveBeenTest()
    })
  })
})
