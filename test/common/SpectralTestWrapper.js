const assert = require('assert')
const path = require('@stoplight/path')
const { Spectral, isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral')

const SEVERITY = {
  off: -1,
  error: 0,
  warn: 1,
  info: 2,
  hint: 3
}

// Rulesets file paths are expected to be GIT_REPO/rulesets/{name}-ruleset.yaml
async function loadRuleset (name, oasFormat) {
  const spectral = new SpectralTestWrapper(oasFormat)
  await spectral.loadRuleset(path.join(__dirname, '../../rulesets/' + name + '-ruleset.yaml'))
  return spectral
}

function ruleset (test, level) {
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

function rule (test) {
  let rule
  if (test.currentTest === undefined) {
    rule = test.test.parent.title
  } else {
    rule = test.currentTest.parent.title
  }
  return rule
}

function isNotRulesetFullyTestedTestSuite (test) {
  return rule(test).localeCompare(rulesetFullyTestedSuiteName(test))
}

function rulesetFullyTestedSuiteName (test) {
  return ruleset(test, 'rulesetFullyTestedSuiteName') + ' ruleset fully tested'
}

// oasFormat: null, auto, forceOas2, forceOas3
function SpectralTestWrapper (oasFormat) {
  this.spectral = new Spectral()

  switch (oasFormat) {
    case 'auto':
      this.spectral.registerFormat('oas2', isOpenApiv2)
      this.spectral.registerFormat('oas3', isOpenApiv3)
      break
    case 'forceOas2':
      this.spectral.registerFormat('oas2', function (document) { return true })
      this.spectral.registerFormat('oas3', function (document) { return false })
      break
    case 'forceOas3':
      this.spectral.registerFormat('oas2', function (document) { return false })
      this.spectral.registerFormat('oas3', function (document) { return true })
      break
    default:
      // no format registered
  }

  this.originalRuleset = this.spectral.rules
  this.testedRules = []
}

SpectralTestWrapper.prototype.loadRuleset = async function (path) {
  await this.spectral.loadRuleset(path)
}

SpectralTestWrapper.prototype.run = function (document) {
  return this.spectral.run(document)
}

// For isolation testing. The rule is added to the tested rules
SpectralTestWrapper.prototype.disableAllRulesExcept = function (name) {
  if (this.testedRules.indexOf(name) === -1) {
    this.testedRules.push(name)
  }
  const subRuleset = {}
  if (this.originalRuleset[name] === undefined) {
    throw new Error('Unknown rule ' + name)
  }
  subRuleset[name] = this.originalRuleset[name]
  this.spectral.rules = subRuleset
}

SpectralTestWrapper.prototype.resetToOriginalRuleSet = function () {
  this.spectral.rules = this.originalRuleset
}

// Rules are added to tested rule when using disableAllRulesExcept
SpectralTestWrapper.prototype.listUntestedRules = function () {
  const untestedRules = []
  for (const ruleName in this.originalRuleset) {
    // disabled rules have -1 severity
    if (this.originalRuleset[ruleName].severity >= 0 && !this.testedRules.includes(ruleName)) {
      untestedRules.push(ruleName)
    }
  }
  return untestedRules
}

SpectralTestWrapper.prototype.runAndCheckNoError = async function (document) {
  const results = await this.run(document)
  this.checkNoError(results)
}

SpectralTestWrapper.prototype.runAndCheckExpectedError = async function (document, codeOrCodes, pathOrPaths, severityOrSeverities) {
  const results = await this.run(document)
  this.checkExpectedError(results, codeOrCodes, pathOrPaths, severityOrSeverities)
}

SpectralTestWrapper.prototype.checkError = function (error, code, path, severity) {
  assert.strictEqual(error.code, code, 'invalid error code')
  assert.deepStrictEqual(error.path, path, 'invalid path')
  assert.strictEqual(error.severity, severity, 'invalid severity')
}

SpectralTestWrapper.prototype.checkExpectedError = function (errors, codeOrCodes, pathOrPaths, severityOrSeverities) {
  assert.notDeepStrictEqual(errors, [], 'no error returned')
  if (errors.length > 0) {
    let expectedErrorCount
    if (Array.isArray(codeOrCodes[0])) {
      expectedErrorCount = codeOrCodes.length
    } else if (Array.isArray(pathOrPaths[0])) {
      expectedErrorCount = pathOrPaths.length
    } else {
      expectedErrorCount = 1
    }
    assert.strictEqual(errors.length, expectedErrorCount, 'more errors than expected')

    for (let i = 0; i < errors.length; i++) {
      let code, path, severity

      if (Array.isArray(codeOrCodes[0])) {
        code = codeOrCodes[i]
      } else {
        code = codeOrCodes
      }

      if (Array.isArray(pathOrPaths[0])) {
        path = pathOrPaths[i]
      } else {
        path = pathOrPaths
      }

      if (Array.isArray(severityOrSeverities[0])) {
        severity = severityOrSeverities[i]
      } else {
        severity = severityOrSeverities
      }

      this.checkError(errors[i], code, path, severity)
    }
  }
}

SpectralTestWrapper.prototype.checkNoError = function (errors) {
  assert.deepStrictEqual(errors, [], 'unexpected error')
}

SpectralTestWrapper.prototype.checkAllRulesHaveBeenTest = function () {
  assert.deepStrictEqual(this.listUntestedRules(), [], 'untested rules')
}

module.exports.loadRuleset = loadRuleset
module.exports.ruleset = ruleset
module.exports.rule = rule
module.exports.isNotRulesetFullyTestedTestSuite = isNotRulesetFullyTestedTestSuite
module.exports.rulesetFullyTestedSuiteName = rulesetFullyTestedSuiteName
module.exports.SEVERITY = SEVERITY
