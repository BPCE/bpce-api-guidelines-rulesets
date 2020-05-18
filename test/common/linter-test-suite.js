const assert = require('assert')
const { SpectralTestWrapper, FORMATS, SEVERITY } = require('./SpectralTestWrapper.js')
const path = require('@stoplight/path')

const FINALIZE_RULESET = 'ruleset test suite complete'

const TESTER_FORMATS = {
  oas2: FORMATS.oas2,
  oas3: FORMATS.oas3,
  all: 'all'
}

// Rulesets file paths are expected to be GIT_REPO/rulesets/{name}-ruleset.yaml
async function loadRuleset (name, oasFormat) {
  const spectral = new SpectralTestWrapper(oasFormat)
  await spectral.loadRuleset(path.join(__dirname, '../../rulesets/' + name + '-ruleset.yaml'))
  return spectral
}

// Get ruleset name from test
function ruleset (test) {
  let rulesetName
  if (test.tests !== undefined) {
    // inner describe level
    rulesetName = test.title
  } else {
    if (test.currentTest === undefined) {
      if (test.test.parent.suites.length > 0) {
        // before level
        rulesetName = test.test.parent.title
      } else {
        // it level
        rulesetName = test.test.parent.parent.title
      }
    } else {
      // inner describe or beforeEach
      rulesetName = test.currentTest.parent.parent.title
    }
  }
  return rulesetName
}

// Get rule name from test
function rule (test) {
  let rule
  if (test.currentTest === undefined) {
    rule = test.test.parent.title
  } else {
    rule = test.currentTest.parent.title
  }
  return rule
}

let ruleTestsReport

exports.initialize = function () {
  let linterTester

  // Loads ruleset file based on the ruleset name set in the ruleset level test suite describe('{ruleset name}')
  before(async function () {
    linterTester = await loadRuleset(ruleset(this))
    ruleTestsReport = {}
    const linterTesterRules = linterTester.listRuleNames()
    for (const rule in linterTesterRules) {
      ruleTestsReport[linterTesterRules[rule]] = {
        commonTests: false
      }
    }
  })

  // Disables all rules except the one indicated in rule level test suite describe('{rule name}'
  beforeEach(function () {
    this.linterTester = linterTester
    this.ruleTestsReport = ruleTestsReport
    this.rule = rule(this)
    if (this.currentTest.parent.title.localeCompare(FINALIZE_RULESET) !== 0) {
      this.linterTester.disableAllRulesExcept(this.rule)
    }
  })
}

exports.commonTests = function (format) {
  it('should run on', function () {
    this.ruleTestsReport[this.rule].commonTests = true
    if (format === undefined) {
      throw new Error('Missing format when calling ruleInitialize, oas2, oas3 or all value must be provided')
    }
    if (format.localeCompare(TESTER_FORMATS.oas2) === 0 || format.localeCompare(TESTER_FORMATS.oas3) === 0) {
      this._runnable.title = 'should run only on ' + format + ' document'
      this.linterTester.checkRunOnlyOn(format)
    } else if (format.localeCompare(TESTER_FORMATS.all) === 0) {
      this._runnable.title = 'should run on any document'
      this.linterTester.checkAlwaysRun()
    } else {
      throw new Error('Unexpected format provided to ruleInitialize, only oas2, oas3 or all value allowed')
    }
  })
}

exports.finalize = function () {
  describe(FINALIZE_RULESET, function () {
    it('should have no untested rule', function () {
      this.linterTester.checkAllRulesHaveBeenTest()
    })

    it('should have no rule test suite without linterTestSuite.commonTests called', function () {
      const invalidRuleTestSuite = []
      for (const ruleName in this.ruleTestsReport) {
        if (!this.ruleTestsReport[ruleName].commonTests) {
          invalidRuleTestSuite.push(ruleName)
        }
      }
      assert.deepStrictEqual(invalidRuleTestSuite, [], 'Some rule test suite do not have linterTestSuite.ruleInitialize called')
    })
  })
}

exports.SEVERITY = SEVERITY
exports.FORMATS = TESTER_FORMATS