const { loadRuleset, SEVERITY, ruleset, rule, isNotRulesetFullyTestedTestSuite, rulesetFullyTestedSuiteName } = require('./common/SpectralTestWrapper.js')

// @TODO Set ruleset name. Ruleset files are in the rulesets folder. Example for a info-ruleset.yaml file it's "info".
describe('{ruleset name}', function () {
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

  // @TODO Add test suite for each rule in rule set
  // @TODO Set the rule name as defined in the Spectral ruleset
  describe('{rule name}', function () {
    // @TODO Do a test for each possible success
    it('should return no error if {test}', async function () {
      // @TODO Minimal document to test the use case, no need for a complete one
      const document = {
        some: 'thing'
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    // @TODO Do a test for each possible failure
    it('should return an error if {test}', async function () {
      // @TODO Minimal document to test the use case, no need for a complete one
      const document = {
        some: 'thing'
      }
      // @TODO The expected path returned by Spectral
      const errorPath = ['some']
      // Note: you can check multiple paths with const errorsPaths = [ ["one", "path"], ["another", "path"] ]
      // @TODO The expected severity
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
