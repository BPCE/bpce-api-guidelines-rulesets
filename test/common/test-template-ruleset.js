const { loadRuleset, currentRule, SEVERITY } = require('./common/SpectralTestWrapper.js')

// Set rule setname
describe('{ruleset name}', function () {
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

  // Add test suite for each rule in rule set
  describe('{rule name}', function () {
    it('should return no error if {test}', async function () {
      const document = {
        some: 'thing'
      }
      // Do not modify the next line
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if {test}', async function () {
      const document = {
        some: 'thing'
      }
      const errorPath = ['some']
      const errorSeverity = SEVERITY.error
      // Do not modify the next lines
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPath, errorSeverity)
    })
  })
})
