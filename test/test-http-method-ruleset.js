const { loadRuleset, currentRule, SEVERITY } = require('./common/SpectralTestWrapper.js')

describe('http-method', function () {
  let spectralTestWrapper

  before(async function () {
    spectralTestWrapper = await loadRuleset(this.test.parent.title)
  })

  beforeEach(function () {
    spectralTestWrapper.disableAllRulesExcept(this.currentTest.parent.title)
  })

  after(function () {
    describe(this.test.parent.title + ' ruleset fully tested', function () {
      it('all rules should have been tested', function () {
        spectralTestWrapper.checkAllRulesHaveBeenTest(spectralTestWrapper)
      })
    })
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
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPath, errorSeverity)
    })
  })
})
